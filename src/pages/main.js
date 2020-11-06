import React, { useState, useEffect } from 'react';
import '../assets/main.css';
import logo from '../assets/logo.png';
import 'semantic-ui-css/semantic.min.css';
import { Image, Grid, Header, Card, Button, Modal, Table, Message, Icon } from 'semantic-ui-react';
import Clock from 'react-live-clock';
import moment from "moment";
import 'moment/locale/pt-br';
import TextLoop from "react-text-loop";
import CompleteTransactions from "../components/CompleteTransactions";
import axios from "axios";
import { HOST } from '../components/global.js'
import Maintenance from '../components/modals/manutencoes';

export default function Main() {

  moment.locale('pt-br');


  const [state, setState] = useState(0);
  const [order, setOrder] = useState(0);
  const [snack, setSnack] = useState({ success: true });
  const [openD, setOpenD] = useState(false);
  const [openM, setOpenM] = useState(false);
  const [transactions, setTransactions] = useState([]);
  const [dele, setDelete] = useState(0);

  useEffect(() => {
    let isCancelled = false;


    async function loadV() {
      var url = HOST + `/api/hoje`;//somente o número de vendas de hoje
      const response = await axios.get(url);
      url = HOST + `/api/dividas`;
      const response2 = await axios.get(url);

      if (!isCancelled) {

        setState(response.data);
        setTransactions(response2.data);
      }
    }

    loadV();
    return () => {
      isCancelled = true;
    };
  }, [openD, dele]);

  function handleDivida() {

    setOpenD(true);

  }

  function handleManutencoes(v) {
    setOpenM(v);
  }

  async function pagar(dTransaction) {

    await axios
      .put(HOST + `/api/transaction`, dTransaction)
      .then(async response => {

        setSnack(prevState => ({
          ...prevState,
          success: true,
          snackMessage: "Transação atualizada com sucesso!"
        }));
        // handleSnackbar();
        setDelete(dele + 1);
        return true;
      })
      .catch(err => {
        console.log(err);
        setSnack(prevState => ({
          ...prevState,
          success: false,
          snackMessage: "Falha ao atualizar Transação..."
        }));
        // handleSnackbar();
        return false;
      });
  }

  var rendertransactions = () => {
    moment.locale('pt-br');
    if (transactions.length === 0) {
      return <tr><td><p>Transações não encontradas</p></td></tr>;
    } else {

      var ar = transactions;
      if (ar.length > 0) {
        switch (order) {
          case 0:
            ar = ar.sort(function compare(a, b) {
              var dateA = moment(a.date, "DD-MMM-YYYY HH:mm:ss").toDate().getTime();
              var dateB = moment(b.date, "DD-MMM-YYYY HH:mm:ss").toDate().getTime();
              return dateA - dateB;
            });
            break;
          case 2:
            ar = ar.sort(function compare(a, b) {
              if (!a.ClienteNome) {
                a.ClienteNome = "nenhum";
              }
              if (!b.ClienteNome) {
                b.ClienteNome = "nenhum";
              }
              if (b.ClienteNome < a.ClienteNome) { return -1; }
              if (b.ClienteNome > a.ClienteNome) { return 1; }
              return 0;
            });
            break;
          case 3:
            ar = ar.sort(function compare(a, b) {
              return b.totalPago - a.totalPago;
            });
            break;
          default:
            ar = ar.sort(function compare(a, b) {
              var dateA = moment(a.date, "DD-MMM-YYYY HH:mm:ss").toDate().getTime();
              var dateB = moment(b.date, "DD-MMM-YYYY HH:mm:ss").toDate().getTime();
              return dateB - dateA;
            });
            break;
        }
        return ar.map(transaction => (
          <CompleteTransactions key={transaction._id} onQuitar={pagar} /* onDelete={delet} */ {...transaction} />
        ));
      } else {
        return <h1>Nenhuma dívida foi carregada...</h1>;
      }

    }
  };

  function getSomaTotal() {
    var sum = 0;
    if (transactions.length > 0) {
      transactions.map((e) => sum += e.devendo);
    }
    return sum;
  }

  return (
    <div className="ContainerMain">
      <Grid columns='equal' divided>
        <Grid.Row>
          <Grid.Column>
            <TextLoop interval={2000} delay={1000} springConfig={{ stiffness: 180, damping: 8 }}>
              <Header style={{ fontSize: "300%", marginLeft: "-120px" }}>Olá...</Header>
              <Header style={{ fontSize: "300%", marginLeft: "-120px" }}>Seja Bem Vindo!</Header>
            </TextLoop>
            <Image id="logo" style={{ backgroundColor: 'white', width: 300, marginLeft: 10, marginTop: "10%" }} alt="logo" src={logo}></Image>
          </Grid.Column>
          <Grid.Column>
            <img alt="clima" style={{ margin: 10 }} src="https://www.tempo.com/wimages/foto82093bc661aa3f2505b9e96aae7f6a8d.png"></img>
          </Grid.Column>
        </Grid.Row>
        <Grid.Row>
          <Grid.Column>
            <Card style={{ width: "100%", marginLeft: "-15%" }}>
              <Card.Content style={{ backgroundColor: "cornflowerblue" }}>
                <Card.Header >Vendas/Serviços Hoje</Card.Header>
              </Card.Content>
              <Card.Content>
                <Card.Description>
                  <Header style={{ fontSize: "300%" }}>{state}</Header>
                </Card.Description>
              </Card.Content>
            </Card>
          </Grid.Column>
          <Grid.Column style={{ marginTop: "5%" }}>
            <Grid.Row>
              <Clock style={{ fontSize: "80px" }} format="HH:mm:ss" ticking={true} interval={1000} //date={moment().toISOString()} 
              />
            </Grid.Row>
            <Grid.Row style={{ marginTop: "5%" }}>
              <Button onClick={() => handleDivida()} negative size="huge">Dívidas</Button>
              <Button onClick={() => handleManutencoes(true)} primary size="huge">Manutenções</Button>
            </Grid.Row>
          </Grid.Column>
        </Grid.Row>
      </Grid>
      <Maintenance open={openM} handleModal={handleManutencoes} />
      <Modal open={openD}
        onClose={() => { setOpenD(false) }} closeIcon>
        <Modal.Header>
          Ver Dívidas
          (Total:{getSomaTotal()})
        </Modal.Header>
        <Modal.Content>
          <Button onClick={() => setOrder(0)} >Mais Antigas</Button>
          <Button onClick={() => setOrder(1)} >Mais Novas</Button>
          <Button onClick={() => setOrder(2)} >Nome</Button>
          <Button onClick={() => setOrder(3)} >Valor</Button>
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
            <Table.Body>{rendertransactions()}</Table.Body>
          </Table>
        </Modal.Content>
        {/*<Modal.Actions>
          
          </Modal.Actions>*/}
      </Modal>
      <Message id="snackbar" success={snack.success ? true : false} error={snack.success ? false : true} className="message">
        <Icon name={snack.success ? "check circle" : "times circle"} />{snack.snackMessage}
      </Message>
    </div>

  );
}

