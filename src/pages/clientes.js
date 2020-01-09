

import React,{useState,useEffect} from 'react';
import './main.css';
//import {Link} from 'react-router-dom';
import ClienteTr from "../components/clienteTr"
import Cliente from "../components/cliente";
import 'semantic-ui-css/semantic.min.css';
import { Modal, Button,Icon,Table,Input, Grid,Message } from "semantic-ui-react";
//import {DateInput} from 'semantic-ui-calendar-react';
import axios from "axios";
import _ from 'lodash';
const HOST = "http://localhost:8001";

export default function Clientes(props) {

  const [state,setState]=useState({clientFormModal: false,
    _id:0,
    name: "",
    snackMessage: "",
    success:true});

  const [client,setClient]=useState({ _id:0,
                                      isAdd:true});  
  const [clients,setClients]=useState({});

  useEffect(()=>{
    let isCancelled = false;

    async function loadClientes(){
      var url = HOST + `/api/clients/all`;
       const response= await axios.get(url);
       //console.log(response);
       
       if(response.data.length>0){
       const NewRes = response.data.map(function(row) {
        
        
        return { title : row.nomeCliente, _id: row._id,date:row.date }
        
        });
       
        
        if (!isCancelled) {
          setSource(NewRes);
          setClients(response.data);
          //setState();
         // setCarros(NewRes);
       // console.log(NewRes);
        }
      }
        }
           
    loadClientes();    
    return () => {
      isCancelled = true;
    }; 
    },[]);

  
  const [source,setSource]=useState([]);
  
  
  async function handleSnackbar(){
    var bar = document.getElementById("snackbar");
    bar.className = "show";
    setTimeout(function() {
      bar.className = bar.className.replace("show", "");
    }, 3000);
  };

   async  function delet(dClient){
     
     
      await axios
      .delete(HOST + `/api/clients/client/`+dClient)
      .then(async response => {
        setState(prevState=>({
          ...prevState,
           snackMessage: "Cliente excluido com sucesso!" }));
        handleSnackbar();
        var url = HOST + `/api/clients/all`;
       const respon= await axios.get(url);
         setClients(respon.data);
         
         
        return true;
      })
      .catch(err => {
        console.log(err);
        setState(prevState=>({
          ...prevState,
           snackMessage: "Falha ao excluir Cliente..." }));
          handleSnackbar();
        return false;
      });
    }

    var renderClients = () => {
      
      
      if (!clients.length || clients.length === 0) {
        return <Table.Row><Table.Cell><p>Não há clientes disponíveis</p></Table.Cell></Table.Row>;
      } else { 
        var ar=clients;
        //console.log(ar);
        
        //ar.sort(function(a, b){return a.quantity-b.quantity});
        //console.log(source);
        if(sear.title){
         
        var re = new RegExp(_.escapeRegExp(sear.title), 'i');
        var isMatch = (clients) => re.test(clients.nomeCliente);
        ar=_.filter(clients, isMatch);
        
        
        }  
        
        return ar.map((client,i) => (
          

          <ClienteTr {...client} key={client._id} onDelete={delet}  />
        ));
      }
    };

    const initialState = { isLoading: false, results: source, value: '',_id:"0" };
      const [sear,setSear]=useState(initialState);

  
  function handleSear(e){
  

    e.persist();
    e.preventDefault();
    setSear(prevState=>({
      ...prevState, 
       title: e.target.value }));
  };
  

  return (
    <div>
     

      
      <div className="container" >
      <Grid columns={1} className="grid">
      <Grid.Row>
      <Grid.Column width={14}   > 
         
                          <Input defaultValue={sear.title}  
                          name="name"
                          type="text"
                          onChange={e=>handleSear(e)}
                          autoFocus></Input>
        <Table celled striped  size="small" columns="9">
          <Table.Header>
          <Table.Row>
              <Table.HeaderCell colSpan="6" >
                
                <Button
                  
                  onClick={() => setState(prevState=>({
                    ...prevState,
                    clientFormModal: true }))}
                    primary
                    size="huge"
                >
                  <Icon name="plus" /> Adicionar Cliente
                </Button>
              </Table.HeaderCell>
            </Table.Row>
            <Table.Row>
              <Table.HeaderCell >Nome</Table.HeaderCell>
              <Table.HeaderCell >CPF</Table.HeaderCell>
              <Table.HeaderCell >Telefone</Table.HeaderCell>
              <Table.HeaderCell >Data de Adição</Table.HeaderCell>
              <Table.HeaderCell><Icon name="edit" /></Table.HeaderCell>
              <Table.HeaderCell><Icon name="trash" /></Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{renderClients()}</Table.Body>
        </Table>
        </Grid.Column>
        </Grid.Row>
      </Grid>
      </div>

      <Modal open={state.clientFormModal} 
      onClose={()=>{setState(prevState=>({
                            ...prevState,
                            clientFormModal:false}))}} closeIcon>
        <Modal.Header>
          Adicionar Cliente
        </Modal.Header>
        <Modal.Content>
          <Cliente {...client}/>
        </Modal.Content>
        {/*<Modal.Actions>
          <Button onClick={() => setState(prevState=>({
    ...prevState,
     clientFormModal: false }))}>
            Fechar
          </Button>
          <Button onClick={()=>handleNewClient()} positive>Salvar</Button>
          </Modal.Actions>*/}
      </Modal>
      <Message id="snackbar" success={state.success ? true : false } error={state.success ? false : true } className="message">
      <Icon name={state.success ? "check circle" : "times circle" } />{state.snackMessage}
      </Message>
      
    </div>
  );
}