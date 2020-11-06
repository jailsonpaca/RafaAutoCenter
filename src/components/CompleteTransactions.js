import React, { useState, useEffect } from "react";
import axios from "axios";
import moment from "moment";
import 'moment/locale/pt-br';
import { Button, Icon, Table } from "semantic-ui-react";
import ModalDetalhes from './modals/detalhes-transacao';
import ModalPagar from './modals/editar-pagamento';
import { HOST } from './global.js'
moment.locale('pt-BR');
/*eslint eqeqeq:0*/
export default function CompleteTransactions(props) {

  const [state, setState] = useState({
    transactionModal: false,
    trocaModal: false,
    pagarModal: false,
    totalquantity: 0,
    desconto: 0,
    items: []
  });

  const [cliente, setCliente] = useState("nenhum");
  useEffect(() => {
    let isCancelled = false;

    async function loadCliente() {
      if (!props.isAdd) {
        var url = HOST + `/api/clients/client/${props.ClienteId}`;

        const response = await axios.get(url);
        if (response.data) {

          if (!isCancelled) {


            setCliente(response.data.nomeCliente);

          }
        }
      }
    }

    loadCliente();
    return () => {
      isCancelled = true;
    };
  }, [props.ClienteId, props.isAdd]);


  var { date, estado, total, items, cartao, parcelas, } = props;

  var renderQuantity = items => {
    var totalquantity = 0;
    if (items) {
      for (var i = 0; i < items.length; i++) {
        totalquantity =
          parseInt(totalquantity, 10) + parseInt(items[i].quantity, 10);
      }
    }
    return totalquantity.toFixed(2);
  };

  var getsoma = items => {
    var sum = 0;

    if (items) {
      for (var i = 0; i < items.length; i++) {
        if (items[i].precofabrica) {
          sum += parseFloat(items[i].precofabrica) * items[i].quantity;
        }
      }
    }
    return sum.toFixed(2);
  };

  function soma(a, b) {

    return (parseFloat(a, 10) + parseFloat(b, 10)).toFixed(2);
  }

  function subtract(a, b) {

    return (parseFloat(a) - parseFloat(b)).toFixed(2);
  }
  var verify = () => {


    if (parseInt(parcelas, 10) === 0) { return "Débito" }
    else { return "Crédito" }
  }

  var parc = () => {
    return parcelas + " X";
  }

  return (
    <Table.Row positive={cartao} negative={estado === 0 ? (true) : (false)}>
      <Table.Cell width="4"> {date}</Table.Cell>
      <Table.Cell width="1"> {total} </Table.Cell>
      <Table.Cell width="1"> {renderQuantity(items)} </Table.Cell>
      <Table.Cell width="1"> {cliente} </Table.Cell>
      <Table.Cell width="1">
        <Button
          onClick={() => setState(prevState => ({
            ...prevState,
            transactionModal: true
          }))}
          icon
          size="huge"
        >
          <Icon name="zoom" />
        </Button>
      </Table.Cell>

      <ModalDetalhes open={state.transactionModal} subtract={subtract} getsoma={getsoma}
        soma={soma} data={props} verify={verify} parc={parc} setState={setState} cliente={cliente} />

      <ModalPagar open={state.pagarModal} newPago={state.newPago}
        desconto={state.desconto} setState={setState} data={props} />
    </Table.Row>
  );

}


