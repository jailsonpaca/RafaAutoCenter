import React from "react";
import { Modal, Button, Form, Input, Search, Label, Message, Checkbox, Dropdown } from "semantic-ui-react";
import _ from 'lodash';
import axios from "axios";
import { HOST } from '../global.js';

export default function ModalFinishOrder({ open, setState, handleEnter, handleMessage, handleDesconto,
  handlePayment, isSuf, data, pag, sear, setSear, initialState, cliente, setPag, carros, setCarros }) {

  async function handleClienteSelect(e, { result }) {
    setSear(prevState => ({
      ...prevState, value2: result.title, code2: result.code2
    }));

    const options = result.carros.map(function (row) {


      return { cor: row.cor, placa: row.placa, text: row.nome, description: row.km, value: row.km, info: row.info }

    });
    options.push({ key: 222, text: "Nenhum", description: "", value: 0, info: "" });
    setCarros(options);

    if (result.inadimplente === "false") {
      var url = HOST + `/api/clients/endereco/${result.code2}`;
      const response = await axios.get(url);
      var endereco = response.data;
      setState(prevState => ({
        ...prevState,
        ClienteId: result.code2,
        //ClienteId:parseInt(result.cpf,10),
        ClienteEndereco: endereco,
        ClienteNome: result.title
      }));
      handleMessage("Cliente Selecionado", true);
    } else if (result.inadimplente === "true") {
      setState(prevState => ({
        ...prevState,
        ClienteId: result.code2
      }));
      handleMessage(`O cliente está inadimplente!${result.code2}`, false);
    }
  }

  function handleClienteChange(e, { value }) {


    setSear(prevState => ({
      ...prevState, isLoading2: true, value2: value
    }));



    if (sear.value2) {


      if (sear.value2.length + 1 < 1) { return setSear(initialState); }
      var re = new RegExp(_.escapeRegExp(sear.value2), 'i');
      var isMatch = (result) => re.test(result.code2);
      var ar = _.filter(cliente, isMatch);


      if (ar.length === 1) {

        if (ar[0].code2 === value2) {


          setSear(prevState => ({
            ...prevState,
            isLoading2: false,
            value: ar[0].title,
            code: ar[0].code2,
            carros: ar[0].carros
          }));
          setState(prevState => ({
            ...prevState,
            ClienteId: parseInt(ar[0].code2, 10),
            ClienteName: ar[0].title
          }));
          setCarros(ar[0].carros);
          handleMessage("Tudo Ok", true);

        }

      }
      re = new RegExp(_.escapeRegExp(sear.value2), 'i');
      isMatch = (result) => re.test(result.title);

      setSear(prevState => ({
        ...prevState,
        isLoading2: false,
        results2: _.filter(cliente, isMatch)
      }));
    }
  }

  var handleTroco = (e, { value }) => {


    setPag(prevState => ({
      ...prevState,
      totalPayment: value
    }));


  }
  var handleCarro = (e, data) => {
    e.persist();


    var car = data.options.filter(function (item) {
      return item.value === data.value;
    });


    setState(prevState => ({
      ...prevState,
      carro: car
    }));

  };

  const { isLoading2, value2, results2 } = sear;

  return (
    <Modal open={open} closeIcon
      onClose={() => setState(prevState => ({
        ...prevState,
        checkOutModal: false
      }))}>
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
                <Input labelPosition='right' type='text' placeholder='Valor'>

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
                    onChange={event => {

                      event.persist();
                      setState(prevState => ({
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
                    onChange={event => {

                      event.persist();
                      setState(prevState => ({
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

                  onChange={event => {


                    event.persist();
                    setState(prevState => ({
                      ...prevState,
                      publicInfo: !data.publicInfo
                    }))

                  }} />
              </Form.Field>
            </Form.Group>

            <div className="lead" />
            <Button
              id="useC"
              className="ui button"
              onClick={() => {
                setState(prevState => ({
                  ...prevState,
                  cartaoModal: true
                }));

              }
              }
              primary
              size="massive"
              type="button"
            >
              Cartão
                        </Button>
            <Button
              id="useC"
              className="ui button"
              onClick={() => {
                setState(prevState => ({
                  ...prevState,
                  fiado: true
                }));
                handlePayment();
              }
              }
              primary
              size="massive"
              type="button"
            >
              FIADO
                        </Button>

            {!isSuf ? (
              <Message negative>
                <Message.Header>Valor pago insuficiente!</Message.Header>
              </Message>
            ) : (<Button
              id="printR"
              className="ui button"
              onClick={() => handlePayment()}
              primary
              size="massive"
              type="button"
            >
              Imprimir Recibo
            </Button>)}
          </Form>
        </div>
      </Modal.Content>
      <Modal.Actions>
        <Button className="ui button"
          onClick={() => {
            setState(prevState => ({
              ...prevState,
              checkOutModal: false
            }));

          }
          }
          type="button"
          size="massive"
        >
          Fechar
                    </Button>
      </Modal.Actions>
    </Modal>

  );
}