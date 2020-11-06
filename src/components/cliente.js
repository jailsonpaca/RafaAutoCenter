

import React, { useState, useEffect } from 'react';
import '../assets/main.css';
import 'semantic-ui-css/semantic.min.css';
import { Message, Icon, Form, Divider, Header, Table, TextArea } from 'semantic-ui-react';
import { DateInput } from 'semantic-ui-calendar-react';
import moment from "moment";
import 'moment/locale/pt-br';
import axios from "axios";
import CompleteTransactions from "./CompleteTransactions";
import { HOST, /*TIME*/ } from './global.js'

/*eslint eqeqeq:0*/
export default function Cliente(props) {

  const [state, setState] = useState({
    nomeCliente: "",
    date: props.date,
    telefone: "",
    cpf: "",
    sexo: "",
    estado: "",
    cidade: "",
    bairro: "",
    cep: "",
    rua: "",
    numeroEndereco: "",
    apartamento: false,
    nomeApartamento: "",
    numeroApartamento: "",
    carros: [],
    inadimplente: false,
  });
  const [newCarro, setNewCarro] = useState({});
  const [dele, setDelete] = useState(0);
  const [transactions, setTransactions] = useState([]);

  useEffect(() => {
    let isCancelled = false;

    async function loadCliente() {
      if (!props.isAdd) {
        var url = HOST + `/api/clients/client/${props._id}`;
        const response = await axios.get(url);
        url = HOST + `/api/all`;
        const response2 = await axios.get(url);
        if (response.data) {
          if (!isCancelled) {
            setState(response.data);
            setTransactions(response2.data);
          }
        }
      }
    }

    loadCliente();
    return () => {
      isCancelled = true;
    };
  }, [props._id, props.isAdd, dele]);

  function handleEnter(event) {
    if (event.keyCode === 13) {
      const form = event.target.form;
      const index = Array.prototype.indexOf.call(form, event.target);
      form.elements[index + 1].focus();
      event.preventDefault();
    }
  }

  var handleClienteNome = (e, { value }) => setState(prevstate => ({ ...prevstate, nomeCliente: value }));
  var handleData = (e, { value }) => setState(prevstate => ({ ...prevstate, date: value }));
  var handleTelefone = (e, { value }) => setState(prevstate => ({ ...prevstate, telefone: value }));
  var handleCpf = (e, { value }) => setState(prevstate => ({ ...prevstate, cpf: value }));
  var handleSexo = (e, { value }) => setState(prevstate => ({ ...prevstate, sexo: value }));

  var handleEstado = (e, { value }) => setState(prevstate => ({ ...prevstate, estado: value }));
  var handleCidade = (e, { value }) => setState(prevstate => ({ ...prevstate, cidade: value }));
  var handleBairro = (e, { value }) => setState(prevstate => ({ ...prevstate, bairro: value }));
  var handleCep = (e, { value }) => setState(prevstate => ({ ...prevstate, cep: value }));
  var handleRua = (e, { value }) => setState(prevstate => ({ ...prevstate, rua: value }));
  var handleNumeroEndereco = (e, { value }) => setState(prevstate => ({ ...prevstate, numeroEndereco: value }));
  var handleApartamento = (e, { value }) => {
    var newV = !state.apartamento;
    setState(prevstate => ({ ...prevstate, apartamento: newV }));
  };
  var handleInadimplente = () => {
    var newV = !state.inadimplente;
    setState(prevstate => ({ ...prevstate, inadimplente: newV }));
  };
  var handleNomeApartamento = (e, { value }) => setState(prevstate => ({ ...prevstate, nomeApartamento: value }));
  var handleNumeroApartamento = (e, { value }) => setState(prevstate => ({ ...prevstate, numeroApartamento: value }));

  function handleNomeCarro(e, i) {
    e.persist();

    var ar = state.carros;
    ar[i].nome = e.target.value;

    setState(prevstate => ({ ...prevstate, carros: ar }));
  }

  function handleKmCarro(e, i) {
    e.persist();

    var ar = state.carros;
    ar[i].km = e.target.value;

    setState(prevstate => ({ ...prevstate, carros: ar }));
  }


  function handleInfoCarro(e, i) {
    e.persist();

    var ar = state.carros;
    ar[i].info = e.target.value;

    setState(prevstate => ({ ...prevstate, carros: ar }));
  }

  function handleSubmit() {

    if (props.isAdd) {

      handleNewClient();
    } else {

      handleEditClient();

    }
    if (props.handleClientClose) {
      props.handleClientClose();
    }

  }

  async function handleEditClient() {


    await axios
      .put(HOST + `/api/clients/update`, state)
      .then(response => {
        /*setState(prevState=>({
          ...prevState,
           snackMessage: "Cliente atualizado com sucesso!" }));
        handleSnackbar();*/
        return true;
      })
      .catch(err => {
        /*setState(prevState=>({
          ...prevState,
           success:false,
           snackMessage: "Atualização de Cliente falhou..." }));
          handleSnackbar();*/
        return false;
      });
  };


  function handleNewNomeCarro(e) {
    e.persist();
    var newV = e.target.value;
    setNewCarro(prevstate => ({ ...prevstate, nome: newV }));
  }

  function handleNewPlacaCarro(e) {
    e.persist();
    var newV = e.target.value;
    setNewCarro(prevstate => ({ ...prevstate, placa: newV }));
  }

  function handleNewInfoCarro(e) {
    e.persist();
    var newV = e.target.value;
    setNewCarro(prevstate => ({ ...prevstate, info: newV }));
  }

  function handleNewKmCarro(e) {
    e.persist();
    var newV = e.target.value;
    setNewCarro(prevstate => ({ ...prevstate, km: newV }));
  }

  function handleSubmitCarro() {
    var ar = state.carros;
    ar.push(newCarro);

    setState(prevstate => ({ ...prevstate, carros: ar }));
    setNewCarro({});

  }

  async function handleNewClient() {

    var newCliente = {
      nomeCliente: state.nomeCliente,
      date: state.date,
      telefone: state.telefone,
      cpf: state.cpf,
      sexo: state.sexo,
      estado: state.estado,
      cidade: state.cidade,
      bairro: state.bairro,
      cep: state.cep,
      rua: state.rua,
      numeroEndereco: state.numeroEndereco,
      apartamento: state.apartamento,
      nomeApartamento: state.nomeApartamento,
      numeroApartamento: state.numeroApartamento,
      carros: state.carros,
      inadimplente: state.inadimplente,
    };

    await axios
      .post(HOST + `/api/clients/client`, newCliente)
      .then(response => {

        /*
          setState(prevState=>({
            ...prevState,   
            snackMessage: "Produto adicionado com Sucesso!" }));
        handleSnackbar();
        var p=products;
      p.push(newProduct);
      setProducts(p);*/
      })
      .catch(err => {
        /*    setState(prevState=>({
              ...prevState,
               success:false,
               snackMessage: "Falha ao salvar o produto..." }));
               handleSnackbar();*/
      });

  };



  const { nomeCliente, date, telefone, cpf, estado, cidade, bairro, cep, rua, numeroEndereco, apartamento, nomeApartamento, numeroApartamento, carros, inadimplente } = state;
  const options = [{ text: 'Masculino', value: "masculino", selected: true },
  { text: 'Feminino', value: 'feminino' }];

  var renderSexo = () => {

    if (state.sexo === "masculino") {
      return (
        <Form.Dropdown
          fluid
          label='Sexo'
          options={options}
          placeholder='Sexo'
          defaultValue={options[0].value}
          onChange={handleSexo}
        />
      );

    } else if (state.sexo === "feminino") {

      return (
        <Form.Dropdown
          fluid
          label='Sexo'
          options={options}
          placeholder='Sexo'
          defaultValue={options[1].value}
          onChange={handleSexo}
        />
      );
    }

  }

  var rendertransactions = () => {
    moment.locale('pt-br');
    if (transactions.length === 0) {
      return <tr><td><p>Transações não encontradas</p></td></tr>;
    } else {

      var ar = transactions.filter(e => {

        if (e.ClienteId == state._id) {
          return e;
        } return null;
      })
      ar = ar.sort(function compare(a, b) {
        var dateA = moment(a.date, "DD-MMM-YYYY HH:mm:ss").toDate().getTime();
        var dateB = moment(b.date, "DD-MMM-YYYY HH:mm:ss").toDate().getTime();
        return dateA - dateB;
      });

      return ar.map(transaction => (
        <CompleteTransactions key={transaction._id} onQuitar={pagar} onDelete={deletTransaction}  {...transaction} />
      ));
    }
  };

  async function deletTransaction(dTransaction) {

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
        setState(prevState => ({
          ...prevState,
          success: false,
          snackMessage: "Falha ao excluir Transação..."
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
  async function pagar(dTransaction) {

    await axios
      .put(HOST + `/api/transaction`, dTransaction)
      .then(async response => {

        setState(prevState => ({
          ...prevState,
          success: true,
          snackMessage: "Transação atualizada com sucesso!"
        }));
        // handleSnackbar();
        //setDelete(dele+1);
        return true;
      })
      .catch(err => {
        setState(prevState => ({
          ...prevState,
          success: false,
          snackMessage: "Falha ao atualizar Transação..."
        }));
        // handleSnackbar();
        return false;
      });
  }

  return (
    <div className="container" style={{ marginRight: "1%" }}>
      <Form>
        <Header as='h3'>Sobre o Cliente</Header>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Nome' placeholder='Nome' defaultValue={nomeCliente} onChange={handleClienteNome} onKeyDown={handleEnter} />
          <Form.Field label='Data de adição' value={date} control={DateInput} onChange={handleData} />
          <Form.Input fluid label='Telefone' placeholder='Telefone' defaultValue={telefone} onChange={handleTelefone} onKeyDown={handleEnter} />
          <Form.Input fluid label='CPF' placeholder='CPF' defaultValue={cpf} onChange={handleCpf} onKeyDown={handleEnter} />

          {renderSexo()}
        </Form.Group>
        <Divider />
        <Header as='h3'>Endereço</Header>
        <Form.Group widths='equal'>

          <Form.Input fluid label='Estado' placeholder='Estado' /*defaultValue="sc"*/ defaultValue={estado} onChange={handleEstado} onKeyDown={handleEnter} />
          <Form.Input fluid label='Cidade' placeholder='Cidade' defaultValue={cidade} onChange={handleCidade} onKeyDown={handleEnter} />
          <Form.Input fluid label='Bairro' placeholder='Bairro' defaultValue={bairro} onChange={handleBairro} onKeyDown={handleEnter} />
        </Form.Group>
        <Form.Group widths='equal'>
          <Form.Input fluid label='CEP' placeholder='CEP' defaultValue={cep} onChange={handleCep} onKeyDown={handleEnter} />
          <Form.Input fluid label='Rua' placeholder='Rua' defaultValue={rua} onChange={handleRua} onKeyDown={handleEnter} />
          <Form.Input fluid label='Numero' placeholder='Número' defaultValue={numeroEndereco} onChange={handleNumeroEndereco} onKeyDown={handleEnter} />
        </Form.Group>
        <Form.Group>
          <Form.Radio
            toggle
            label='Apartamento'
            checked={apartamento}
            onChange={handleApartamento}
          />
          <Form.Input disabled={!apartamento} fluid label='Nome do Apartamento' placeholder='Nome' defaultValue={nomeApartamento} onChange={handleNomeApartamento} onKeyDown={handleEnter} />
          <Form.Input disabled={!apartamento} fluid label='Número Apartamento' placeholder='Número' defaultValue={numeroApartamento} onChange={handleNumeroApartamento} onKeyDown={handleEnter} />
          <Form.Radio
            toggle
            label='inadimplente'
            checked={inadimplente}
            onChange={handleInadimplente}
          />
        </Form.Group>
        <Divider />

        <Header as='h3'>Carros</Header>

        <Form.Group inline widths='equal' >
          <Form.Input fluid label='Nome' placeholder='Nome' onChange={handleNewNomeCarro} onKeyDown={handleEnter} />
          <Form.Input fluid label='Placa' onChange={handleNewPlacaCarro} onKeyDown={handleEnter} />
          <Form.Input fluid label='Km' placeholder='Km' onChange={handleNewKmCarro} onKeyDown={handleEnter} />
          <Form.Input control={TextArea} fluid="true" label='Informações' placeholder='Info' onChange={handleNewInfoCarro} onKeyDown={handleEnter} />
          {/*<Form.Input fluid label='Data de adição'   />*/}
          <Form.Button onClick={() => handleSubmitCarro()} >Adicionar</Form.Button>
        </Form.Group>
        {carros ? (
          carros.map((carro, i) => {
            return (
              <Form.Group inline key={i} widths='equal'>
                <Form.Input fluid label='Nome' placeholder='Nome' defaultValue={carro.nome} onChange={e => handleNomeCarro(e, i)} onKeyDown={handleEnter} />
                <Form.Input fluid label='Placa' defaultValue={carro.placa} onKeyDown={handleEnter} />
                <Form.Input fluid label='Km' placeholder='Km' defaultValue={carro.km} onChange={e => handleKmCarro(e, i)} onKeyDown={handleEnter} />
                <Form.Input control={TextArea} fluid="true" label='Informações' placeholder='Info' defaultValue={carro.info} onChange={e => handleInfoCarro(e, i)} onKeyDown={handleEnter} />
                <Form.Input fluid label='Data de adição' defaultValue={carro.date} />
              </Form.Group>
            )
          })) : (
            <p>Não há carros cadastrados</p>
          )}
        <Divider />
        <Header as='h3'>Transações</Header>
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
        <Form.Button onClick={() => handleSubmit()} positive>Salvar</Form.Button>
      </Form>
      <Message id="snackbar" success={state.success ? true : false} error={state.success ? false : true} className="message">
        <Icon name={state.success ? "check circle" : "times circle"} />{state.snackMessage}
      </Message>
    </div>

  );
}