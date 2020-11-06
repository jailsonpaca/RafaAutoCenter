import React from "react";
import { Modal, Button, Input, Form, Label } from "semantic-ui-react";
import moment from "moment";
moment.locale('pt-BR');

export default function ModalEditarPagamento({ open,setState,newPago,desconto,data }) {


      function handlePagar(e) {

        setState(prevState => ({
          ...prevState,
          newPago: e
        }));
    
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

      var handleDesconto = (e, { value }) => {

        setState(prevState => ({
          ...prevState,
          desconto: value
        }));
    
      }

      async function pagar() {

        var dTransaction = {
          ClienteId: data.ClienteId,
          cartao: data.cartao,
          date: data.date,
          desconto: data.desconto,
          devendo: data.devendo,
          estado: data.estado,
          garantia: data.garantia,
          items: data.items,
          parcelas: data.parcelas,
          total: data.total,
          totalPago: data.totalPago,
          troco: data.troco,
          _id: data._id
        }
    
        dTransaction.devendo = parseFloat(dTransaction.devendo) - parseFloat(newPago) - parseFloat(desconto);
        dTransaction.total = parseFloat(dTransaction.total) - parseFloat(desconto);
    
        dTransaction.totalPago = parseFloat(dTransaction.totalPago) + parseFloat(newPago);
        dTransaction.desconto = parseFloat(dTransaction.desconto) + parseFloat(desconto);
        if (dTransaction.devendo > 0) {
          dTransaction.estado = 0;
        } else if (Number(dTransaction.estado) === 0) {//se devia e não deve mais 
          moment.locale('pt-br');
          dTransaction.estado = 3;
          dTransaction.pagou = newPago;
          dTransaction.quandoPagou = moment().format("DD-MMM-YYYY HH:mm:ss");
          //var url = HOST + `/api/clients/endereco/${dTransaction.ClienteId}`;
        }
        data.onQuitar(dTransaction);
        setState(prevState => ({
          ...prevState,
          pagarModal: false
        }));
    
      }

    return (
        <Modal open={open} closeIcon onClose={() => setState(prevState => ({
            ...prevState,
            pagarModal: false
          }))}>
            <Modal.Header>
              Editar Pagamento
              </Modal.Header>
            <Modal.Content>
              <Form>
                <Form.Field>
                  <label className="col-md-2 lead" htmlFor="name">Digite o Valor a pagar</label>
                  <Input labelPosition='right' type='text' placeholder='Valor'>
    
                    <Label>R$</Label>
                    <Input
                      type="number"
                      id="checkoutPaymentAmount"
                      //value={newPago}
                      name="payment"
                      onChange={e => handlePagar(e.target.value)}
                      onKeyDown={handleEnter}
                      min="0"
                      autoFocus
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
                      value={desconto}
                      name="payment"
                      onChange={handleDesconto}
                      onKeyDown={handleEnter}
                      min="0"
                    // autoFocus
                    />
                  </Input>
                </Form.Field>
              </Form>
            </Modal.Content>
            <Modal.Actions>
    
              <Button onClick={() => pagar()} positive>
                Pagar
                </Button>
    
            </Modal.Actions>
          </Modal>
    )
}