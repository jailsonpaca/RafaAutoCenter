import React, { useState, useEffect } from "react";
import "../assets/App.css";
import Rendertransactions from './utils/render-transactions';
import axios from "axios";
import moment from "moment";
import 'moment/locale/pt-br';
import { Message, Icon, Label, Table, Input, Grid, Button } from "semantic-ui-react";
import { DateInput } from 'semantic-ui-calendar-react';
import history from '../history';
import { HOST } from './global.js'
const url = HOST + `/api/all`;
moment.locale('pt-br');
export default function Transactions(props) {

  const [state, setState] = useState({ success: true, transactions: [] });
  const [type, setType] = useState(4);
  moment.locale('pt-br');


  const [data, setData] = useState(moment().format("DD-MM-YYYY"));

  const [dele, setDelete] = useState(0);
  useEffect(() => {

    if (history.location.state) {

      setData(moment(history.location.state.data, "DD-MM-YYYY").format("DD-MM-YYYY"));
    }
    let isSubscribed = true;
    async function loadTransaction() {
      axios
        .get(url)
        .then((response) => {
          if (isSubscribed) {
            setState(prevState => ({ ...prevState, transactions: response.data }));
          }
        })
        .catch(err => {
          console.log(err);
        });
    }
    loadTransaction();
    return () => isSubscribed = false;

  }, [dele])

  async function delet(dTransaction) {

    await axios
      .delete(HOST + `/api/` + dTransaction._id)
      .then(async response => {
        setState(prevState => ({
          ...prevState,
          success: true,
          snackMessage: "Transação excluida com sucesso!"
        }));
        handleSnackbar();
        setDelete(dele + 1);
        return true;
      })
      .catch(err => {
        console.log(err);
        setState(prevState => ({
          ...prevState,
          success: false,
          snackMessage: "Falha ao excluir Transação..."
        }));
        handleSnackbar();
        return false;
      });
  }

  async function pagar(dTransaction) {

    await axios
      .put(HOST + `/api/transaction`)
      .then(async response => {
        setState(prevState => ({
          ...prevState,
          success: true,
          snackMessage: "Transação atualizada com sucesso!"
        }));
        handleSnackbar();
        setDelete(dele + 1);
        return true;
      })
      .catch(err => {
        console.log(err);
        setState(prevState => ({
          ...prevState,
          success: false,
          snackMessage: "Falha ao atualizar Transação..."
        }));
        handleSnackbar();
        return false;
      });
  }

  async function handleSnackbar() {
    var bar = document.getElementById("snackbar");
    bar.className = "show";
    setTimeout(function () {
      bar.className = bar.className.replace("show", "");
    }, 3000);
  };


  var handleChange = (event, { name, value }) => {
    setData(moment(value, "DD-MM-YYYY").format("DD-MM-YYYY"));
  }

  var handleNext = () => {
    var d = moment(data, "DD-MM-YYYY").add(1, 'd').format("DD-MM-YYYY");
    setData(d);
  }
  var handleBack = () => {
    var d = moment(data, "DD-MM-YYYY").subtract(1, 'd').format("DD-MM-YYYY");


    setData(d);
  }

  /*const initialState = { isLoading: false, results: state.transactions, value: '',code:"0" };
  const [sear,setSear]=useState(initialState);

function handleSear(e){
 
  e.persist();
  e.preventDefault();
  setSear(prevState=>({
    ...prevState, 
     code: e.target.value }));

};*/

  return (
    <div className="container" >
      <Grid columns={1} className="grid">
        <Grid.Row columns={4}  >
          <Grid.Column width={5} className="dataP">
            <Input labelPosition='right'  /*style={{marginRight: "10%"}}*/ size="mini">
              <Label>
                <Icon name='left arrow' onClick={handleBack} />
              </Label>
              <DateInput
                style={{ width: "62%" }}
                name="date"
                placeholder="Date"
                value={data}
                iconPosition="left"
                onChange={handleChange}
                localization='pt-br'
                animation='none'
              />
              <Label style={{ marginLeft: "-26.5%" }}>
                <Icon name='right arrow' onClick={handleNext} />
              </Label>
            </Input>
          </Grid.Column>
          <Grid.Column width={3} className="cSum" >
            <Input labelPosition='right' defaultValue="0" id="iSum" disabled inverted={true} size="mini">
              <Label active>Total:</Label>
              <input />
              <Label active className="labelc"><Icon name='dollar sign' /></Label>
            </Input>
          </Grid.Column>
          <Grid.Column width={3} className="lSum">
            <Input labelPosition='right' defaultValue="0" id="lSum" disabled inverted={true} size="mini">
              <Label active>Lucro:</Label>
              <input />
              <Label active className="labell"><Icon name='dollar sign' /></Label>
            </Input>
          </Grid.Column>
          <Grid.Column width={4} className="rSum">
            <Input labelPosition='right' defaultValue="0" id="rSum" disabled inverted={true} size="mini">
              <Label active>Recebido:</Label>
              <input />
              <Label active className="labelR"><Icon name='dollar sign' /></Label>
            </Input>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column width={14}>
            <h1>Transações:</h1>
            <Button onClick={() => setType(4)}>Todas</Button>
            <Button onClick={() => setType(1)}>Completa(paga)</Button>
            <Button onClick={() => setType(2)}>Cartão</Button>
            <Button onClick={() => setType(0)}>Devendo</Button>
            <Button onClick={() => setType(3)}>Recebida</Button>

            <div>


              <Table celled striped size="small" columns="4">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell>Hora</Table.HeaderCell>
                    <Table.HeaderCell>Total</Table.HeaderCell>
                    <Table.HeaderCell>Produtos</Table.HeaderCell>
                    <Table.HeaderCell>Cliente</Table.HeaderCell>
                    <Table.HeaderCell>Detalhes</Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body><Rendertransactions transactions={state.transactions} data={data}
                  type={type} delet={delet} pagar={pagar} /></Table.Body>
              </Table>
            </div>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Message id="snackbar" success={state.success ? true : false} error={state.success ? false : true} className="message">
        <Icon name={state.success ? "check circle" : "times circle"} />{state.snackMessage}
      </Message>
    </div>
  );

}


