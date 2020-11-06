import React, { useState, useEffect, useRef } from "react";
import "../assets/App.css";
import axios from "axios";
import moment from "moment";
import { useHotkeys } from 'react-hotkeys-hook';
import 'moment/locale/pt-br';
import { Button, Icon, Label, Table, Grid, Message } from "semantic-ui-react";
import LivePos from "./LivePos";
import taxas from './utils/taxas';
import ModalRecibo from './modals/recibo-modal';
import { HOST } from './global.js'
import ModalAddItem from "./modals/adicionar-item";
import ModalFinishOrder from "./modals/finalizarVenda";
import ModalCompraCartao from "./modals/compra-cartao";
import ModalClienteInadimplente from "./modals/cliente-inadimplente";
import { statePos, pagPos, itemsPos, clientePos, cartaosPos } from './utils/defaults';
import { useRecoilState } from 'recoil';

function replaceItemAtIndex(arr, index, newValue) {
  return [...arr.slice(0, index), newValue, ...arr.slice(index + 1)];
}

/*eslint eqeqeq:0*/
export default function Pos() {

  useHotkeys('a', () => { setTimeout(() => { document.getElementById('addP').click(); }, 300); });
  useHotkeys('f', () => {
    setTimeout(() => {
      if (state.receiptModal) {
        document.getElementById('useFolha').click();
      } else { document.getElementById('checkoutButton').click(); }
    }, 300);
  });
  useHotkeys('c', () => {
    if (state.checkOutModal) { document.getElementById('useC').click(); }
    if (state.receiptModal) { document.getElementById('useCupom').click(); }
  });
  useHotkeys('i', () => {
    if (state.checkOutModal) {
      document.getElementById('printR').click();
    } else if (state.cartaoModal) { document.getElementById('printR').click(); }
  });

  const [showv, setShow] = useState(true);
  const [showMessage, setShowMessage] = useState(false);
  const close = () => { setShow(false) };
  const show = () => setShow(true);
  const [success, setSuccess] = useState(true);
  const [state, setState] = useRecoilState(statePos);
  const [pag, setPag] = useRecoilState(pagPos);
  const troc = useRef(0);
  const [items, setItems] = useRecoilState(itemsPos);
  const [carros, setCarros] = useState([{ key: 222, text: "Nenhum", value: 0, info: "" }]);
  const [source, setSource] = useState([]);
  const [message, setMessage] = useState("");
  const [cliente, setCliente] = useRecoilState(clientePos);
  const [cartaos, setCartao] = useRecoilState(cartaosPos);

  const [isSuf, setSuf] = useState(false);
  useEffect(() => {
    let isCancelled = false;

    async function loadProducts() {
      var url = HOST + `/api/inventory/products`;

      await axios.get(url).then((response) => {
        const NewRes = response.data.map(function (row) {

          return { key: row._id, title: row.name, code: row._id, price: row.price, precofabrica: row.precofabrica, emestoque: row.quantity, type: row.type }

        });
        if (!isCancelled) {

          NewRes.push({ key: 111, title: "serviço", code: 111, price: "0", precofabrica: 0, emestoque: 1000, type: 0 });

          setSource(NewRes);
        }
      });
    }

    async function loadClientes() {
      var url = HOST + `/api/clients/all`;
      //const response= 
      await axios.get(url).then((response) => {

        const NewRes = response.data.map(function (row) {


          return { key: row._id, title: row.nomeCliente, code2: row._id, cpf: row.cpf, inadimplente: String(row.inadimplente), carros: row.carros }

        });


        if (!isCancelled) {

          NewRes.push({ key: 222, title: "nenhum", code2: 222, carros: [] });

          setCliente(NewRes);
        }


      });

    }

    loadClientes();
    loadProducts();
    return () => {
      isCancelled = true;
    };
  }, [setCliente]);
  var renderTotal = () => {

    return (

      <Label.Detail>R$ {parseFloat(pag.total).toFixed(2)}</Label.Detail>
    );
  }

  function handleSubmit(e) {

    const currentItem = {
      id: state.id,
      name: state.name,
      price: parseFloat(state.price).toFixed(2),
      quantity: state.quantity,
      type: state.type,
      precofabrica: parseFloat(state.precofabrica).toFixed(2)
    };
    let ar = items, found = ar.findIndex(e => e.id == currentItem.id);

    if (found != -1) {
      const newAr = replaceItemAtIndex(items, found, {
        ...items[found],
        quantity: items[found].quantity + 1,
      });
      setItems(newAr);
    } else {
      setItems((oldItems) => [
        ...oldItems,
        currentItem
      ]);
      //setItems(ar.concat([currentItem]));
    }
    var total = parseFloat(pag.total) + parseFloat(currentItem.price);
    setPag(prevState => ({
      ...prevState,
      total: total
    }));

    setState(prevState => ({
      ...prevState,
      addItemModal: false,
      price: 0,
      id: 0
    }));
    setSear(initialState);

  };

  function handlePayment() {

    if (state.fiado) {

      var ti = (parseFloat(pag.total - pag.desconto, 10) - parseFloat(pag.totalPayment, 10)).toFixed(2);
      setPag(prevState => ({
        ...prevState,
        total: ti,
        changeDue: 0
      }));
      setState(prevState => ({
        ...prevState,
        checkOutModal: false,
        cartaoModal: false,
        receiptModal: true,
      }));

      setTimeout(() => { handleSaveToDB(); }, 300);

    }

    if (state.cartaoModal) {

      var t = pag.total;
      setPag(prevState => ({
        ...prevState,
        total: parseFloat(((t * 100) / (100 - taxas[cartaos.num])) - pag.desconto).toFixed(2),
        changeDue: 0
      }));
      setState(prevState => ({
        ...prevState,
        checkOutModal: false,
        cartaoModal: false,
        receiptModal: true,
      }));

      setTimeout(() => { handleSaveToDB(); }, 300);

    } else if (isSuf) {
      var amountDiff = (parseFloat(pag.total - pag.desconto, 10) - parseFloat(pag.totalPayment, 10)).toFixed(2);

      setPag(prevState => ({
        ...prevState,
        changeDue: amountDiff
      }));
      troc.current = amountDiff;
      setState(prevState => ({
        ...prevState,
        checkOutModal: false,
        receiptModal: true,
      }));

      setTimeout(() => { handleSaveToDB(); }, 300);

    }
  };
  function handleChange(id, value) {

    var itemv = items;
    if (value === "delete") {
      var newitems = itemv.filter(function (item) {
        return item.id !== id;
      });

      setItems(newitems)
    } else {
      for (var i = 0; i < itemv.length; i++) {
        if (itemv[i].id === id) {
          var ind = source.findIndex(x => x.code == id);

          if (source[ind].emestoque >= value) {
            const newAr = replaceItemAtIndex(itemv, i, {
              ...itemv[i],
              quantity: value,
            });
            setItems(newAr);
            itemv = newAr;
          }

        }
      }

    }
    var total = 0;
    for (i = 0; i < itemv.length; i++) {
      total += itemv[i].price * itemv[i].quantity;
    }
    setPag(prevState => ({
      ...prevState,
      total: total
    }));
  };
  function handleCheckOut() {

    var itemv = items;
    var totalCost = 0;
    for (var i = 0; i < itemv.length; i++) {
      var price = itemv[i].price * itemv[i].quantity;
      totalCost = (parseFloat(totalCost, 10) + parseFloat(price, 10)).toFixed(2);
    }
    setState(prevState => ({
      ...prevState,
      checkOutModal: true
    }));
    setPag(prevState => ({
      ...prevState,
      total: totalCost
    }));
  };

  async function handleSaveToDB() {
    moment.locale('pt-br');
    if (items.length > 0) {
      var transaction;
      if (state.fiado) {
        transaction = {
          estado: 0,
          date: moment().format("DD-MMM-YYYY HH:mm:ss"),
          total: parseFloat((pag.total - pag.desconto), 10).toFixed(2),
          desconto: parseFloat(pag.desconto, 10),
          cartao: false,
          parcelas: -1,
          totalPago: parseFloat(pag.totalPayment, 10).toFixed(2),
          troco: parseFloat(troc.current, 10).toFixed(2),
          devendo: parseFloat((pag.total - pag.desconto), 10).toFixed(2) - parseFloat(pag.totalPayment, 10).toFixed(2),
          garantia: state.garantia,
          info: state.info,
          ClienteNome: state.ClienteNome,
          ClienteId: state.ClienteId,
          items: items
        };
      } else {
        if (state.cartaoModal) {
          transaction = {
            estado: 2,
            date: moment().format("DD-MMM-YYYY HH:mm:ss"),
            total: parseFloat(((pag.total * 100) / (100 - taxas[cartaos.num])) - pag.desconto).toFixed(2),
            desconto: parseFloat(pag.desconto).toFixed(2),
            cartao: true,
            parcelas: cartaos.num,
            troco: 0,
            garantia: state.garantia,
            info: state.info,
            carro: state.carro,
            ClienteNome: state.ClienteNome,
            ClienteId: state.ClienteId,
            items: items

          };
        } else {
          transaction = {
            estado: 1,
            date: moment().format("DD-MMM-YYYY HH:mm:ss"),
            total: parseFloat((pag.total - pag.desconto), 10).toFixed(2),
            desconto: parseFloat(pag.desconto, 10),
            cartao: false,
            parcelas: -1,
            totalPago: parseFloat(pag.totalPayment, 10).toFixed(2),
            troco: parseFloat(troc.current, 10).toFixed(2),
            garantia: state.garantia,
            info: state.info,
            carro: state.carro,
            ClienteNome: state.ClienteNome,
            ClienteId: state.ClienteId,
            items: items
          };
        }
      }
    }
    await axios.post(HOST + "/api/new", transaction).then(async (response) => {
      setState(prevState => ({
        ...prevState,
        transactionId: response.data
      }));
      for (var i = 0; i < items.length; i++) {
        if (items[i].id !== 111) {
          var k = 0;
          while (k < items[i].quantity) {
            await axios.put(HOST + `/api/inventory/product/decrement/` + items[i].id)
              .then(response => { return true; }).catch(err => { ; return false; });
            k++;
          }

        }
      }
      handleMessage("Tudo Ok", true);
    }, err => {
      handleMessage("Algo deu errado", false);
    });

  };

  useEffect(() => {
    let isMounted = true, timer; // note this flag denote mount status
    if (isMounted && showMessage) {
      timer = setTimeout(function () {
        setShowMessage(false);
      }, 10000);
    }
    return () => { isMounted = false; clearTimeout(timer) };
  }, [showMessage])

  function handleMessage(me, op) {
    setSuccess(op);

    if (me.slice(0, me.lastIndexOf('!') + 1) == "O cliente está inadimplente!") {
      setMessage(me.slice(0, me.lastIndexOf('!') + 1));
      setState(prevState => ({
        ...prevState,
        checkOutModal: false
      }));
      setShowMessage(true);
    } else {
      setMessage(me);
      setShowMessage(true);
    }
  }

  var renderLivePos = () => {


    if (items.length === 0 || source.length === 0) {
      return <Table.Row><Table.Cell><p> Sem Produtos Adicionados</p></Table.Cell></Table.Row>;
    } else {
      return items.map((item, i) => <LivePos {...item} emestoque={source[source.findIndex(x => x.code == item.id)].emestoque} key={i} handleChange={handleChange} />,
        this
      );
    }
  };

  function handleEnter(event) {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      if (form.elements[index + 1]) {
        form.elements[index + 1].focus();
      }

      event.preventDefault();
    }
  }

  const initialState = { isLoading: false, results: source, value: '', code: "0" };
  const [sear, setSear] = useState(initialState);
  const initialState2 = { isLoading2: false, results2: cliente, value2: '', code2: "0", carros: [] };
  const [sear2, setSear2] = useState(initialState2);

  useEffect(() => {

    if (parseFloat(pag.total - pag.desconto, 10) <= parseFloat(pag.totalPayment, 10)) {
      setSuf(true);
      //return(true);
    } else {
      setSuf(false);
      // return(false);
    }
  }, [pag]);

  var handleDesconto = (e, { value }) => {

    setPag(prevState => ({
      ...prevState,
      desconto: value
    }));

  }

  return (
    <>
      <Grid columns={2} className="grid">
        <Grid.Row>
          <Grid.Column width={13}   >
            <ModalRecibo open={state.receiptModal} setItems={setItems} setPag={setPag}
              setState={setState} setCartao={setCartao} setSuf={setSuf} items={items} data={state}
              pag={pag} cartaos={cartaos} handleMessage={handleMessage} />
            <Table celled striped collapsing={true} compact="very" columns="5" className="table">
              <Table.Header fullWidth>
                <Table.Row>
                  <Table.HeaderCell colSpan="6" >
                    <span className="pull-left">
                      <Button
                        onClick={() => show()}
                        className="ui button"
                        primary
                        size="huge"
                        id="addP"
                      >
                        <Icon name="plus" /> Adicionar Item
                    </Button>
                      <Label color="black" size="huge"  >
                        Total: {renderTotal()}
                      </Label>
                    </span>
                    <ModalAddItem open={showv} setState={setState} initialState={initialState}
                      sear={sear} setSear={setSear} source={source} message={message}
                      data={state} close={close} handleEnter={handleEnter} success={success}
                      handleMessage={handleMessage} handleSubmit={handleSubmit} />
                  </Table.HeaderCell>
                </Table.Row>
                <Table.Row >
                  <Table.HeaderCell colSpan="2" style={{ padding: '.78571429em 0', textAlign: 'center' }}>Nome</Table.HeaderCell>
                  <Table.HeaderCell style={{ padding: '.78571429em 0', textAlign: 'center' }}>Preço</Table.HeaderCell>
                  <Table.HeaderCell style={{ padding: '.78571429em 0', textAlign: 'center' }}>Quantidade</Table.HeaderCell>
                  {/*<Table.HeaderCell>Taxa</Table.HeaderCell>*/}
                  <Table.HeaderCell style={{ padding: '.78571429em 0', textAlign: 'center' }}>Total</Table.HeaderCell>
                  <Table.HeaderCell style={{ padding: '.78571429em 0', textAlign: 'center' }}>#</Table.HeaderCell>
                </Table.Row>
              </Table.Header>
              <Table.Body>{renderLivePos()}</Table.Body>
            </Table>
          </Grid.Column>
          <Grid.Column width={1} stretched={true} >
            <Button
              id="checkoutButton"
              onClick={() => handleCheckOut()}
              positive> <div className="bCheckout">
                <Icon name="cart" size="large" style={{ marginLeft: "-6px" }} />
                <br />
                <br />
                <p className="tCheckout">FINALIZAR</p>
              </div>
            </Button>
            <ModalFinishOrder open={state.checkOutModal} setState={setState} pag={pag} handleEnter={handleEnter}
              handleDesconto={handleDesconto} handlePayment={handlePayment} handleMessage={handleMessage} isSuf={isSuf}
              sear={sear2} setSear={setSear2} cliente={cliente} setPag={setPag} carros={carros} setCarros={setCarros} />
            <ModalCompraCartao open={state.cartaoModal} setState={setState} pag={pag}
              setPag={setPag} cartaos={cartaos} setCartao={setCartao}
              handleEnter={handleEnter} handleDesconto={handleDesconto} handlePayment={handlePayment} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Message id="snackbar" success={success} error={!success} className={`message ${showMessage ? ("show") : ("")}`} >
        <Icon name={success ? "check circle" : "times circle"} />
        {message == "O cliente está inadimplente!" ? (
          <ModalClienteInadimplente open={state.clienteOpen} ClienteId={state.ClienteId}
            setState={setState} />

        ) : (<>{message}</>)}
      </Message>
    </>

  );

}


