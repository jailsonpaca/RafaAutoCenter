import React, { useState,useEffect,useRef} from "react";
import "./App.css";
import axios from "axios";
import moment from "moment";
import { useHotkeys } from 'react-hotkeys-hook';
import 'moment/locale/pt-br';
import { Modal, Button,Icon,Label,Table,Input, Form, Grid,Search,Message,Checkbox,Dropdown } from "semantic-ui-react";
import LivePos from "./LivePos";
import logo from './logo.png';
//import ReactToPrint from "react-to-print";
//import ReactPDF from '@react-pdf/renderer';
//import html2canvas from 'html2canvas';
import recibo1 from './recibo1';
import recibo2 from './recibo2';
//import printer from "pdf-to-printer";


import _ from 'lodash';
import taxas from './taxas';
const HOST = "http://localhost:8001";


export default function Pos(){
  
useHotkeys('a', () =>{  setTimeout(()=>{document.getElementById('addP').click(); },300);  });
useHotkeys('f', () =>{setTimeout(()=>{ if(state.receiptModal){document.getElementById('useFolha').click();
                       }else{document.getElementById('checkoutButton').click(); }  },300);});
useHotkeys('c', () =>{ 
  if(state.checkOutModal){ document.getElementById('useC').click(); }
  if(state.receiptModal){ document.getElementById('useCupom').click();}
});
useHotkeys('i', () =>{ if(state.checkOutModal){document.getElementById('printR').click();
                       }else if(state.cartaoModal){document.getElementById('printR').click();}});


const [showv, setShow] = useState(false);

const close = () =>{setShow(false)};
const show = () => setShow(true);
const [success,setSuccess]=useState(true);
  const [state,setState]=useState({quantity: 1,
    id: 0,
    receiptModal:false,
    addItemModal: false,
    checkOutModal: false,
    amountDueModal: false,
    cartaoModal:false,
    garantia:"NÃO POSSUI",
    name: "",
    price: 0 ,
    publicInfo:false,
    carro:222});
const [carros,setCarros]=useState([{key: 222, text: "Nenhum", value: 0, info:""}]);

    const [pag,setPag]=useState({
      totalPayment: 0,
      total: 0,
      desconto:0,
      cartao:false,
      changeDue: 0});
    const troc=useRef(0);  
    
    const [items,setItems]=useState([]);
    const [source,setSource]=useState([]);
    const [message,setMessage]=useState("");
    const [cliente,setCliente]=useState({});
    const [cartaos,setCartao]=useState({isUsed:false,
      debito:true,
     parcela:false,
     num:0});

const [isSuf,setSuf]=useState(false);
  useEffect(()=>{
    let isCancelled = false;

    async function loadProducts(){
      var url = HOST + `/api/inventory/products`;
       const response= await axios.get(url);
       const NewRes = response.data.map(function(row) {
        
        
        return { title : row.name, code: row._id, price:row.price,precofabrica:row.precofabrica,emestoque:row.quantity }
        
        });
       
        
        if (!isCancelled) {
          
          NewRes.push({ title : "serviço", code: 111, price:"0",precofabrica:0,emestoque:1000 });
          
         setSource(NewRes);
       // console.log(NewRes);
        }
        }
        async function loadClientes(){
          var url = HOST + `/api/clients/all`;
           const response= await axios.get(url);
           //console.log(response);
           //if(response.data)
           const NewRes = response.data.map(function(row) {
            
            
            return { title : row.nomeCliente, code2: row._id,cpf:row.cpf, carros:row.carros}
            
            });
           
            
            if (!isCancelled) {
              
              NewRes.push({title : "nenhum", code2: 222, carros:[]});  
              
             setCliente(NewRes);
            //console.log(NewRes);
            }
    
          }
    loadClientes();          
    loadProducts();    
    return () => {
      isCancelled = true;
    }; 
    },[]);

var renderTotal=()=>{
  
  return(

    <Label.Detail>R$ {parseFloat(pag.total).toFixed(2)}</Label.Detail>
  );
}

  function handleSubmit(e){
    
    const currentItem = {
      id: state.id,
      name: state.name,
      price: parseFloat(state.price).toFixed(2),
      quantity: state.quantity,
      precofabrica:parseFloat(state.precofabrica).toFixed(2)
    };
   
    
    setItems(items.concat([currentItem]));
    var total=pag.total+currentItem.price;
    setPag(prevState=>({
      ...prevState,
      total:total
    }));
   // console.log("er");
    
    setState(prevState=>({
      ...prevState,
      addItemModal: false,
      id:0
    }));
    setSear(initialState);
    
  };

  

  var handleCarro = (e, data) => {
    e.persist();
    
    
    var car = data.options.filter(function(item) {
      return item.value === data.value;
    });

   // console.log(car);
    
    setState(prevState=>({
      ...prevState,
       carro:car}));

  };

  function handleName(e){

    setState(prevState=>({
      ...prevState,
       name: e}));

    
  };

  function handlePrice(e){
    //e.preventDefault();
    setState(prevState=>({
      ...prevState,
       price: parseFloat(e).toFixed(2) }));
  };
   function handlePayment(){
    
    if(state.cartaoModal){
      
      var t=pag.total;
      setPag(prevState=>({
        ...prevState,
        total:parseFloat(((t*100)/(100-taxas[cartaos.num]))-pag.desconto).toFixed(2),
        changeDue: 0 
      }));
      setState(prevState=>({
        ...prevState,
        checkOutModal: false,
        cartaoModal:false,
        receiptModal: true,
      }));
      
      setTimeout(()=>{handleSaveToDB(); },300);
      
    }else if(isSuf){
    var amountDiff =(parseFloat(pag.total-pag.desconto, 10) - parseFloat(pag.totalPayment, 10)).toFixed(2);
    
      setPag(prevState=>({
        ...prevState,
        changeDue: amountDiff
      }));
      troc.current=amountDiff;
      setState(prevState=>({
        ...prevState,
        checkOutModal: false,
        receiptModal: true,
      }));
      
      setTimeout(()=>{handleSaveToDB(); },300);
    
  }
  };
  function handleChange(id, value){
    
    var itemv = items;
    if (value === "delete") {
      var newitems = itemv.filter(function(item) {
        return item.id !== id;
      });
    
     setItems(newitems)
    } else {
      for (var i = 0; i < itemv.length; i++) {
        if (itemv[i].id === id) {
          var ind= source.findIndex(x => x.code == id);
          
          
          if(source[ind].emestoque>=value){
            itemv[i].quantity = value;
        
          setItems(itemv);
          }
          
        }
      }
      
    }
    var total=0;
  for(var i=0;i<itemv.length;i++){
    total+=itemv[i].price*itemv[i].quantity;
  }
  setPag(prevState=>({
    ...prevState,
    total:total
  }));
  };
  function handleCheckOut(){
     
    var itemv = items;
    var totalCost = 0;
    for (var i = 0; i < itemv.length; i++) {
      var price = itemv[i].price * itemv[i].quantity;
      totalCost = (parseFloat(totalCost, 10) + parseFloat(price, 10)).toFixed(2);
    }
    setState(prevState=>({
      ...prevState,
      checkOutModal: true }));
      setPag(prevState=>({
        ...prevState,
      total: totalCost
      }));
  }; 
      
  async function handleSaveToDB(){
    moment.locale('pt-br');
    
    var transaction;
    if(state.cartaoModal){
      transaction = {
        date: moment().subtract(1, "hour").format("DD-MMM-YYYY HH:mm:ss"),
        total: parseFloat(((pag.total*100)/(100-taxas[cartaos.num]))-pag.desconto).toFixed(2),
        desconto:parseFloat(pag.desconto).toFixed(2),
        cartao:true,
        parcelas:cartaos.num,
        troco:0,
        garantia:state.garantia,
        info:state.info,
        clienteNome:state.clienteNome,
        ClienteCpf:state.ClienteCpf,
        carro:state.carro,
        items: items
        
      };
    }else{
      transaction = {
      date: moment().subtract(1, "hour").format("DD-MMM-YYYY HH:mm:ss"),
      total: parseFloat((pag.total-pag.desconto),10).toFixed(2),
      desconto:parseFloat(pag.desconto,10),
      cartao:false,
      parcelas:-1,
      totalPago:parseFloat(pag.totalPayment,10).toFixed(2),
      troco:parseFloat(troc.current,10).toFixed(2),
      garantia:state.garantia,
      info:state.info,
      clienteNome:state.clienteNome,
      ClienteCpf:state.ClienteCpf,
      carro:state.carro,
      items: items
    };
  }
    await axios.post(HOST + "/api/new", transaction).then(async (response)=>{
      setState(prevState=>({
        ...prevState,
        transactionId: response.data }));
      
      setSuccess(true);
      for(var i=0;i<items.length;i++){
        if(items[i].id!==111){
          var k=0;
          while(k<items[i].quantity){
            await axios.put(HOST + `/api/inventory/product/decrement/`+items[i].id)
            .then(response => {   return true; }).catch(err => {    console.log(err); return false;      });
            k++;
          }
        
        }
      }
      
      var bar=document.getElementById("snackbar");
      bar.className = "show";
      setTimeout(function() {
        bar.className = bar.className.replace("show", "");
      }, 3000);
    },err => {
      setSuccess(false);
      var bar=document.getElementById("snackbar");
      bar.className = "show";
      setTimeout(function() {
        bar.className = bar.className.replace("show", "");
      }, 3000);
      console.log(err);
    });
    
  };


    var verify=(parcelas)=>{
      if(parcelas===0){ return "Débito"}
      else{ return parcelas+" Vezes"}
    }
  
    var renderReceipt = () => {
      return (
        <Modal open={state.receiptModal} closeIcon 
        onClose={()=>{
          
          setItems([]);
          setPag({ totalPayment: 0,
            total: 0,
            desconto:0,
            cartao:false,
            changeDue: 0});
          setState({quantity: 1,
            id: 0,
            receiptModal:false,
            addItemModal: false,
            checkOutModal: false,
            amountDueModal: false,
            cartaoModal:false,
            garantia:"NÃO POSSUI",
            name: "",
            price: 0 });
            setCartao({isUsed:false,
              debito:true,
            parcela:false,
            num:0});
            setSuf(false);
          }}>
          <Modal.Header >
            Recibo
          </Modal.Header>
          <Modal.Content>
            

          <Button id="useCupom" onClick={()=>{ if(recibo1(logo,items,state,pag,cartaos)){
            
                    }else{
                      setSuccess(false);
                      var bar=document.getElementById("snackbar");
                      bar.className = "show";
                      setTimeout(function() {
                        bar.className = bar.className.replace("show", "");
                      }, 3000);
                         }
}} primary>Cupom</Button>

<Button id="useFolha" onClick={()=>{
if(recibo2(logo,items,state,pag,cartaos)){
            
}else{
  setSuccess(false);
  var bar=document.getElementById("snackbar");
  bar.className = "show";
  setTimeout(function() {
    bar.className = bar.className.replace("show", "");
  }, 3000);
}    }} primary>Folha</Button>

          
          
          {pag.cartao ? ( 
            <div>
            <Label>
              Total:
              <Label.Detail>R$ {parseFloat(pag.total).toFixed(2)}</Label.Detail>
            </Label>
            <Label>
              Em: {verify(cartaos.num)}
              <Label.Detail></Label.Detail>
            </Label>
            </div> ) : (
            <div>
              <Label size="massive">
              Total:
              <Label.Detail>{parseFloat(pag.totalPayment,10).toFixed(2)}</Label.Detail>
            </Label>
            <Label size="massive">
              Troco:
              <Label.Detail>{parseFloat(pag.changeDue).toFixed(2)}</Label.Detail>
            </Label>
            </div>)}
           
          </Modal.Content>
          <Modal.Actions>
            <Button className="ui button" onClick={() =>{ 
              setItems([]);
              setPag({ totalPayment: 0,
                total: 0,
                desconto:0,
                cartao:false,
                changeDue: 0});
                setState({quantity: 1,
                  id: 0,
                  receiptModal: false,
                  addItemModal: false,
                  checkOutModal: false,
                  amountDueModal: false,
                  cartaoModal:false,
                  garantia:"NÃO POSSUI",
                  name: "",
                  price: 0 });
                  setCartao({isUsed:false,
                    debito:true,
                   parcela:false,
                   num:0});
                   setSuf(false);
              
              }}>
              Fechar
            </Button>
          </Modal.Actions>
        </Modal>
      );
    };

    var renderLivePos = () => {
      
      
      if (items.length === 0) {
        return<Table.Row><Table.Cell><p> Sem Produtos Adicionados</p></Table.Cell></Table.Row> ;
      } else {
        //console.log(source);
        
          //console.log(items);
          
        return items.map((item,i) =><LivePos {...item} emestoque={source[source.findIndex(x => x.code == item.id)].emestoque} key={i}  handleChange={handleChange} />,
          this
        );
      }
    };

    function handleEnter(event){
      if (event.keyCode === 13) {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        if(form.elements[index + 1]){
          form.elements[index + 1].focus();
        }
        
        event.preventDefault();
      }
    }
    

      const initialState = { isLoading: false, results: source, value: '',code:"0" };
      const [sear,setSear]=useState(initialState);
      const initialState2 = { isLoading2: false, results2: cliente, value2: '',code2:"0",carros:[] };
      const [sear2,setSear2]=useState(initialState2);

      async function handleClienteSelect(e, { result }){
        setSear2(prevState=>({
        ...prevState, value2: result.title,code2:result.code2 }));
        
        const options = result.carros.map(function(row) {
        
        
          return {cor:row.cor, placa: row.placa, text: row.nome,description: row.km, value: row.km, info:row.info}
          
          });
          options.push({key: 222, text: "Nenhum",description:"", value: 0, info:""});
        setCarros(options);
        //setCarros(result.carros);
        
        
          //bar.className = bar.className.replace("show", "");
          var url = HOST + `/api/clients/endereco/${result.code2}`;
          const response= await axios.get(url);
          var endereco=response.data;
        setState(prevState=>({
          ...prevState, 
          ClienteId:parseInt(result.code2,10),
          ClienteCpf:parseInt(result.cpf,10),
          ClienteEndereco:endereco,
          ClienteNome:result.title
          }));
          
             /*setTimeout(()=>{
              console.log(carros);      },150);*/
                setMessage("");
                setSuccess(true);
             

            
      }

  function handleClienteChange(e, { value }){
    
    
    setSear2(prevState=>({
      ...prevState, isLoading2: true, value2:value }));
    
    
    
      if(sear2.value2){
    
        
      if (sear2.value2.length+1 < 1){return setSear2(initialState2);}
      var re = new RegExp(_.escapeRegExp(sear2.value2), 'i');
      var isMatch = (result) => re.test(result.code2);
      var ar=_.filter(cliente, isMatch);
      
      //console.log(ar);
      
      if(ar.length===1){
        
        if(ar[0].code2===value2){
          
         
        setSear2(prevState=>({
          ...prevState, 
          isLoading2: false, 
          value:ar[0].title,
          code:ar[0].code2,
          carros:ar[0].carros }));
        setState(prevState=>({
          ...prevState, 
          ClienteId:parseInt(ar[0].code2,10),
          ClienteName:ar[0].title}));
          setCarros(ar[0].carros);
            setMessage("");
                setSuccess(true);
          
          
        }
          
      }
      re = new RegExp(_.escapeRegExp(sear2.value2), 'i');
      isMatch = (result) => re.test(result.title);

      setSear2(prevState=>({
        ...prevState,
        isLoading2: false,
        results2: _.filter(cliente, isMatch)
      }));
      }
  }

      function handleResultSelect(e, { result }){
        setSear(prevState=>({
        ...prevState, value: result.title,code:result.code }));
        
        if(result.title==="serviço"){
          setState(prevState=>({
            ...prevState, 
              id:parseInt(result.code,10),
              name:result.title,
              price:parseFloat(result.price),
              precofabrica:parseFloat(result.precofabrica)}));
               
                  setMessage("");
                  setSuccess(true);
        }else{
        if(result.emestoque>0){
          //bar.className = bar.className.replace("show", "");
          //console.log((result.code));
          
        setState(prevState=>({
          ...prevState, 
            id:parseInt(result.code,10),
            name:result.title,
            price:parseFloat(result.price),
            precofabrica:parseFloat(result.precofabrica)}));
             
              setTimeout(()=>{
                document.getElementById('AddI').click();
              setState(prevState=>({
                ...prevState, 
                name:'',
                id:0,
                price:0 }));
                setSear(initialState);},50);
                setMessage("");
                setSuccess(true);
              }else{
                setMessage("Produto indisponível");
                setSuccess(false);
                      
              //        bar.className = "show";
                      //console.log("tsetb");
                      
              
              }  

            }   
      }

  function handleSearchChange(e, { value }){
    
    
    setSear(prevState=>({
      ...prevState, isLoading: true, value:value }));
    
    
      if(sear.value){
      if (sear.value.length+1 < 1){return setSear(initialState);}
      var re = new RegExp(_.escapeRegExp(sear.value), 'i');
      var isMatch = (result) => re.test(result.code);
      var ar=_.filter(source, isMatch);
      
      if(ar.length===1){
        
        if(ar[0].code===value){
          
          if(ar[0].emestoque>0){
            //bar.className = bar.className.replace("show", "");
          
        setSear(prevState=>({
          ...prevState, 
          isLoading: false, 
          value:ar[0].title,
          code:ar[0].code }));
        setState(prevState=>({
          ...prevState, 
          id:parseInt(ar[0].code,10),
          name:ar[0].title,
          price:parseFloat(ar[0].price),
          precofabrica:parseFloat(ar[0].precofabrica) }));
          setTimeout(()=>{
          document.getElementById('AddI').click();
          setState(prevState=>({
            ...prevState, 
            name:'',
            id:0,
            price:0 }));
            setSear(initialState);},50);
            setMessage("");
                setSuccess(true);
          }else{
            setMessage("Produto indisponível");
            setSuccess(false);
                  
                  //bar.className = "show";
                  
                  
          }
          
        }
          
      }
      re = new RegExp(_.escapeRegExp(sear.value), 'i');
      isMatch = (result) => re.test(result.title);

      setSear(prevState=>({
        ...prevState,
        isLoading: false,
        results: _.filter(source, isMatch)
      }));
      }
  }
  
      var  handleParcela=(e, { value }) => {
          //  console.log(taxas[value]);
        //console.log(value);
          setCartao(prevState=>({
          ...prevState,
          num:value}));}

      
          
      function handlePaycar(e){
        //console.log("e: "+e);
        
        setCartao(prevState=>({
          ...prevState,
          isUsed: true
        }));
        
        

       setPag(prevState=>({
        ...prevState,
         cartao: e}));
        // setTimeout(function(){ console.log(pag.cartao); }, 1000);
          
           
             handlePayment();
      }


  
  const { isLoading, value, results } = sear;
  const { isLoading2, value2, results2 } = sear2;
  //console.log(cliente);
  
  useEffect(()=>{
    
    if( parseFloat(pag.total-pag.desconto, 10) <= parseFloat(pag.totalPayment, 10)){
      setSuf(true);
      //return(true);
    }else{
      setSuf(false);
     // return(false);
    }
  },[pag]);

  var  handleTroco=(e, { value }) => {

  
      setPag(prevState=>({
        ...prevState,
        totalPayment: value
      }));

    
    }
    
  var  handleDesconto=(e, { value }) => {


    setPag(prevState=>({
      ...prevState,
      desconto: value
    }));

  }
 
    return (
     
        
        <div className="container" >
        <Grid columns={2} className="grid">
        <Grid.Row>
        <Grid.Column width={13}   >
        
         
          
          
          
          {renderReceipt()}
          <Table celled striped  collapsing={true} columns="6" className="table" >
            <Table.Header>
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
                    <Label color="black" size="massive"  >
            Total: {/*<Label.Detail>R$ {pag.total}</Label.Detail>*/renderTotal()}
          </Label>
                  </span>
                  <Modal open={showv}  onClose={()=>close()} closeIcon>
                    <Modal.Header >
                        Adicionar Item(Produto)
                    </Modal.Header>
                    <Modal.Content>
                      <Form
                        
                        //onSubmit={()=>handleSubmit()}
                        className="form-horizontal"
                      >
                        <Form.Field>
                          <label className="col-md-2 lead" htmlFor="name">
                            Nome
                          </label>

                            <Input
                              
                              name="name"
                              type="text"
                              required
                              value={state.id}
                              onChange={e=>handleName(e.target.value)}
                              onKeyDown={handleEnter}
                              disabled
                            />
                            <Form.Field>
                             <Search
                              loading={isLoading}
                              onResultSelect={handleResultSelect}
                              onSearchChange={_.debounce(handleSearchChange, 500, {
                                leading: true,
                              })}
                              results={results}
                              value={value}
                              noResultsMessage="Sem resultados..."
                              //onKeyDown={handleEnter}
                              autoFocus
                              //{...this.props}
                            />
                          </Form.Field>
                        </Form.Field>
                        <Form.Field>
                            <label className="col-md-2 lead" htmlFor="price">
                                Preço
                            </label>
                            <Input labelPosition='right' type='text' placeholder='Valor'>
                            <Label >R$</Label>
                            <Input type="number"
                              step="any"
                              min="0"
                              defaultValue={state.price}
                              onChange={e=>handlePrice(e.target.value)}
                              className="form-control"
                              name="price"
                              onKeyDown={handleEnter}
                              required
                              />

                            </Input>
                          
                  
                          
                        </Form.Field>
                       
                        
                        {message!==""?(
                        <Message className="message"  id="snackbar2" style={{display: 'block',}} success={success ? true : false } error={success ? false : true } negative>
                      <Icon name={success ? "check circle" : "times circle" } />{message}
                        </Message>):(<p >Disponível</p> )}
                        
                      </Form>
                      
                      
                    </Modal.Content>
                    <Modal.Actions>
                      <Button className="ui button" id="AddI" onClick={()=>handleSubmit()} size="massive" positive>Adicionar</Button>
                      <Button className="ui button"
                        onClick={() =>close()}
                        size="massive"
                      >
                        Cancelar
                      </Button>
                    </Modal.Actions>
                  </Modal>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row >
                <Table.HeaderCell>Nome</Table.HeaderCell>
                <Table.HeaderCell>Preço</Table.HeaderCell>
                <Table.HeaderCell>Quantidade</Table.HeaderCell>
                <Table.HeaderCell>Taxa</Table.HeaderCell>
                <Table.HeaderCell>Total</Table.HeaderCell>
                <Table.HeaderCell>#</Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{renderLivePos()}</Table.Body>
          </Table>
       
          
        </Grid.Column>
        <Grid.Column width={1} stretched={true} >
        <Button
                
                id="checkoutButton"
                onClick={()=>handleCheckOut()}
                positive
                
              > <div  className="bCheckout">
                <Icon name="cart" size="large" style={{marginLeft: "-6px"}}/>
                <br/>
                <br/>
                <p  className="tCheckout">FINALIZAR</p>
                </div>
              </Button>
              
                <Modal open={state.checkOutModal} closeIcon 
                onClose={()=>setState(prevState=>({
                                  ...prevState,
                                  checkOutModal:false}))}>
                  <Modal.Header >
                    Finalizar Venda
                  </Modal.Header>
                  <Modal.Content>
                    <div ng-hide="transactionComplete" className="lead">
                    <Label color="black" size="massive"  >
            Total: <Label.Detail>R$ {parseFloat(pag.total).toFixed(2)}</Label.Detail>
          </Label>
                    
                      <Form size="massive"
                        className="form-horizontal"
                        name="checkoutForm"
                        //onSubmit={()=>handlePayment()}
                      > 
                      <Form.Group widths='equal'>
                      
                      <Form.Field width="5">
                      
                      <label className="col-md-2 lead" htmlFor="name">Digite o Cliente</label> 
                      <Search
                              loading={isLoading2}
                              onResultSelect={handleClienteSelect}
                              onSearchChange={_.debounce(handleClienteChange, 500, {
                                leading: true,
                              })}
                              results={results2}
                              value={value2}
                              noResultsMessage=""
                              onKeyDown={handleEnter}
                              autoFocus
                              //{...this.props}
                      />
                      </Form.Field>
                        <Form.Field width="5">
                        
                        <label className="col-md-2 lead" htmlFor="name">Digite o Valor Recebido</label> 
                        <Input labelPosition='right'  type='text' placeholder='Valor'>
                        
                            <Label>R$</Label>
                            <Input
                              type="number"
                              id="checkoutPaymentAmount"
                             value={pag.totalPayment}
                              name="payment"
                              onChange={handleTroco}
                              onKeyDown={handleEnter}
                              min="0"
                             // autoFocus
                            />
                            </Input>
                          </Form.Field>
                          
                          <Form.Field width="5">
                          
                          <label className="col-md-2 lead" htmlFor="name">Digite o Desconto</label> 
                        <Input labelPosition='right' type='text' placeholder='Valor'>
                        
                            <Label>R$</Label>
                            <Input
                              type="number"
                              id="checkoutPaymentAmount"
                             value={pag.desconto}
                              name="payment"
                              onChange={handleDesconto}
                              onKeyDown={handleEnter}
                              min="0"
                             // autoFocus
                            />
                            </Input>
                          </Form.Field>
                          </Form.Group>
                          <Form.Group widths='equal'>

                          <Form.Field width="5">
                      
                      <label className="col-md-2 lead" htmlFor="name">Carro do Cliente</label> 
                      <Dropdown
                        placeholder='Selecione o Carro'
                        fluid
                        selection
                        //value={state.carro}
                        onChange={handleCarro}
                        options={carros}
                      />
                      </Form.Field>
                          <Form.Field width="5">

                        <Input labelPosition='right' type='text' placeholder='Garantia'>
                            <Label>Garantia</Label>
                            <Input
                              type="text"
                              id="checkoutPaymentAmount"
                              
                              name="payment"
                              onChange={event =>{
                                
                                event.persist();
                                setState(prevState=>({
                                  ...prevState,
                                  garantia: event.target.value
                                }))
                              }}
                              onKeyDown={handleEnter}
                              min="0"
                              //autoFocus
                            />
                          </Input>
                          </Form.Field>
                          <Form.Field width="5">
                          <Input labelPosition='right' type='text' placeholder='Informações'>
                            <Label>Informações</Label>
                            <Input
                              type="text"
                              //id="checkoutPaymentAmount"
                      
                              //name="payment"
                              onChange={event =>{
                                
                                event.persist();
                                setState(prevState=>({
                                  ...prevState,
                                  info: event.target.value
                                }))
                              }}
                              onKeyDown={handleEnter}
                              
                              //autoFocus
                            />
                          </Input>
                          <Checkbox 
                          label='MOSTRAR PARA CLIENTE'  
                             
                              onChange={event =>{
                                
                                
                                event.persist();
                                setState(prevState=>({
                                  ...prevState,
                                  publicInfo: !state.publicInfo
                                }))
                                
                              }}/>
                          </Form.Field>
                          </Form.Group>
                        
                        <div className="lead" />
                        <Button
                          id="useC"
                          className="ui button"
                          onClick={()=>{
                          setState(prevState=>({
                            ...prevState,
                            cartaoModal: true
                          }));
                          
                            }
                          }
                          primary
                          size="massive"
                        >
                          Cartão
                        </Button>
                        
                        {!isSuf ? (
                          <Message negative>
                          <Message.Header>Valor pago insuficiente!</Message.Header>
                          </Message>
                        ):(<Button
                          id="printR"
                          className="ui button"
                          onClick={()=>handlePayment()}
                          primary
                          size="massive"
                        >
                          Imprimir Recibo
                        </Button>)}
                      </Form>
                    </div>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button className="ui button"
                      onClick={() =>{ setState(prevState=>({
                        ...prevState, 
                        checkOutModal: false }));
                      
                      }
                      }
                      size="massive"
                    >
                      Fechar
                    </Button>
                  </Modal.Actions>
                </Modal>
                              
                <Modal open={state.cartaoModal} closeIcon 
                onClose={()=>setState(prevState=>({
                                  ...prevState,
                                  cartaoModal:false}))}>
                  <Modal.Header >
                    Compra em Cartão
                  </Modal.Header>
                  <Modal.Content>
                    <div ng-hide="transactionComplete" className="lead">
                      <h1>
                        Total:
                        <span className="text-danger">
                          {" "}
                          {parseFloat(pag.total).toFixed(2)}{" "}
                        </span>
                      </h1>

                      <Form size="massive"
                        className="form-horizontal"
                        name="checkoutForm"
                        //onSubmit={()=>handlePayment()}
                      >
                        <Form.Group widths='equal'>
                          
                          <Form.Radio
                           
                            label='Debito'
                            value='debito'
                            checked={cartaos.debito}
                            onChange={()=>{
                              if(cartaos.debito){
                              handleParcela(0);  
                              setCartao(prevState=>({
                                ...prevState,
                                num:1,
                                parcela:true,
                                debito:false
                              }));
                            }else{
                              setCartao(prevState=>({
                                ...prevState,
                                num:0,
                                parcela:false,
                                debito:true
                              }));
                            }
                             }}
                          />
                           <Form.Radio
                            label='Crédito'
                            value='credito'
                            checked={cartaos.parcela}
                            onChange={()=>{
                              if(cartaos.parcela){
                                setCartao(prevState=>({
                                  ...prevState,
                                  num:0,
                                  parcela:false,
                                  debito:true
                                }));
                              }else{
                                setCartao(prevState=>({
                                  ...prevState,
                                  num:1,
                                  parcela:true,
                                  debito:false
                                }));
                              }
                            }}
                          />
                          <Form.Select
                            fluid
                            label='Parcelas'
                            options={[
                              { key: '1', text: '1x', value: 1 },
                              { key: '2', text: '2x', value: 2 },
                              { key: '3', text: '3x', value: 3 },
                              { key: '4', text: '4x', value: 4 },
                              { key: '5', text: '5x', value: 5 },
                              { key: '6', text: '6x', value: 6 },
                              { key: '7', text: '7x', value: 7 },
                              { key: '8', text: '8x', value: 8 },
                              { key: '9', text: '9x', value: 9 },
                              { key: '10', text: '10x', value: 10 },
                              { key: '11', text: '11x', value: 11 },
                              { key: '12', text: '12x', value: 12 },
                            ]}
                            placeholder='Parcelas'
                            onChange={handleParcela}
                            disabled={cartaos.debito}
                          />
                        </Form.Group>
                        
                        <div className="lead" />
                        <Form.Group widths='equal'>
                        <Button
                          id="printR"
                          className="ui button"
                          onClick={()=>{
                           handlePaycar(true) }}
                          primary
                          size="massive"
                          
                        >
                          Imprimir Recibo
                        </Button>
  
                          <Form.Field
                          control={Input}
                          value={pag.desconto}
                          onChange={handleDesconto}
                          onKeyDown={handleEnter}
                          label='Desconto'
                          placeholder='Desconto'
                         
                        />
                        <Form.Field
                          control={Input}
                          value={(pag.total)*taxas[cartaos.num]-pag.desconto}
                          label='Total com Taxas'
                          placeholder='Total'
                          readOnly
                        />
                        </Form.Group>
                      </Form>
                    </div>
                  </Modal.Content>
                  <Modal.Actions>
                    <Button className="ui button"
                      onClick={() =>{ 
                        
                        
                        setState(prevState=>({
                          ...prevState,
                           cartaoModal: false}));
                           setPag(prevState=>({
                            ...prevState,
                            cartao: false}));
                          
                           setCartao(prevState=>({
                            ...prevState,
                            isUsed: false
                          }));
                       }}
                      size="massive"
                    >         
                      Fechar
                    </Button>
                  </Modal.Actions>
                </Modal>              
            
        </Grid.Column>
        </Grid.Row>
        </Grid>
        <Message id="snackbar" success={success ? true : false } error={success ? false : true } className="message">
        <Icon name={success ? "check circle" : "times circle" } />{message}
        </Message>
        </div>
      
    );
  
}


