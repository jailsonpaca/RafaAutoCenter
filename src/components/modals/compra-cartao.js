import React from "react";
import { Modal, Button, Form, Input } from "semantic-ui-react";
import taxas from '../utils/taxas';

export default function ModalCompraCartao({ open, setState, pag, setPag, cartaos, setCartao,
  handlePayment, handleDesconto, handleEnter }) {

  var handleParcela = (e, { value }) => {
    setCartao(prevState => ({
      ...prevState,
      num: value
    }));
  }

  function handlePaycar(e) {

    setCartao(prevState => ({
      ...prevState,
      isUsed: true
    }));

    setPag(prevState => ({
      ...prevState,
      cartao: e
    }));


    handlePayment();
  }

  return (
    <Modal open={open} closeIcon
      onClose={() => setState(prevState => ({
        ...prevState,
        cartaoModal: false
      }))}>
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
                onChange={() => {
                  if (cartaos.debito) {
                    handleParcela(0);
                    setCartao(prevState => ({
                      ...prevState,
                      num: 1,
                      parcela: true,
                      debito: false
                    }));
                  } else {
                    setCartao(prevState => ({
                      ...prevState,
                      num: 0,
                      parcela: false,
                      debito: true
                    }));
                  }
                }}
              />
              <Form.Radio
                label='Crédito'
                value='credito'
                checked={cartaos.parcela}
                onChange={() => {
                  if (cartaos.parcela) {
                    setCartao(prevState => ({
                      ...prevState,
                      num: 0,
                      parcela: false,
                      debito: true
                    }));
                  } else {
                    setCartao(prevState => ({
                      ...prevState,
                      num: 1,
                      parcela: true,
                      debito: false
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
                onClick={() => {
                  handlePaycar(true)
                }}
                primary
                size="massive"
                type="button"
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
                value={(pag.total) * taxas[cartaos.num] - pag.desconto}
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
          type="button"
          onClick={() => {


            setState(prevState => ({
              ...prevState,
              cartaoModal: false
            }));
            setPag(prevState => ({
              ...prevState,
              cartao: false
            }));

            setCartao(prevState => ({
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
  );
}