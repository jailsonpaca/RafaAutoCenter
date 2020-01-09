

import React,{useState,useEffect} from 'react';
import '../pages/main.css';
//import {Link} from 'react-router-dom';
import 'semantic-ui-css/semantic.min.css';
import {Image,Form,Divider,TextArea,Header,Dropdown} from 'semantic-ui-react';
import {DateInput} from 'semantic-ui-calendar-react';
import axios from "axios";
const HOST = "http://localhost:8001";

export default function Cliente(props) {

  const [state,setState]=useState({
    nomeCliente:"",
    date:"",
    telefone:"",
    cpf:"",
    sexo:"",
    estado:"",
    cidade:"",
    bairro:"",
    cep:"",
    rua:"",
    numeroEndereco:"",
    apartamento:false,
    nomeApartamento:"",
    numeroApartamento:"",
    carros:[] 
  });
  const [newCarro,setNewCarro]=useState({});
  
  useEffect(()=>{
    let isCancelled = false;

    async function loadCliente(){
      if(!props.isAdd){
      var url = HOST + `/api/clients/client/${props._id}`;
       const response= await axios.get(url);
       console.log(response.data);
       
       if(response.data){       
        
        if (!isCancelled) {
          
          setState(response.data);
          
          
          console.log(state);
          
          //getS();
         // setCarros(NewRes);
       // console.log(NewRes);
        }
        }
      }  
     }
           
    loadCliente();    
    return () => {
      isCancelled = true;
    }; 
    },[]);

    function handleEnter(event){
      if (event.keyCode === 13) {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index + 1].focus();
        event.preventDefault();
      }
    }

  var handleClienteNome = (e, { value }) => setState(prevstate=>({...prevstate, nomeCliente:value }));
  //var handleDataAdd = (e, { value }) => setState({ value });
  var handleTelefone = (e, { value }) => setState(prevstate=>({...prevstate, telefone:value }));
  var handleCpf = (e, { value }) => setState(prevstate=>({...prevstate, cpf:value }));
  var handleSexo = (e, { value }) => setState(prevstate=>({...prevstate, sexo:value }));
  
  var handleEstado = (e, { value }) => setState(prevstate=>({...prevstate, estado:value }));
  var handleCidade = (e, { value }) => setState(prevstate=>({...prevstate, cidade:value }));
  var handleBairro = (e, { value }) => setState(prevstate=>({...prevstate, bairro:value }));
  var handleCep = (e, { value }) => setState(prevstate=>({...prevstate, cep:value }));
  var handleRua = (e, { value }) => setState(prevstate=>({...prevstate, rua:value }));
  var handleNumeroEndereco = (e, { value }) => setState(prevstate=>({...prevstate, numeroEndereco:value }));
  var handleApartamento = (e, { value }) =>{ 
   var newV=!state.apartamento; 
   console.log(state.apartamento); 
   
   setState(prevstate=>({...prevstate, apartamento:newV })); };
  var handleNomeApartamento = (e, { value }) => setState(prevstate=>({...prevstate, nomeApartamento:value }));
  var handleNumeroApartamento = (e, { value }) => setState(prevstate=>({...prevstate, numeroApartamento:value }));
  
  function handleNomeCarro(e,i){
                e.persist(); 

              var ar=state.carros;
              ar[i].nome=e.target.value;
        
    setState(prevstate=>({...prevstate, carros:ar }));
  }

  function handleKmCarro(e,i){
        e.persist(); 

        var ar=state.carros;
        ar[i].km=e.target.value;

    setState(prevstate=>({...prevstate, carros:ar }));
    }

  
  function handleInfoCarro(e,i){
      e.persist(); 

      var ar=state.carros;
      ar[i].info=e.target.value;

    setState(prevstate=>({...prevstate, carros:ar }));
   }  

   function handleSubmit(){
      
     if(props.isAdd){
       
      console.log("Adicionando...");
      handleNewClient();
     }else{

      console.log("Editando...");
      handleEditClient();

     }
      
      

   }

   async function handleEditClient(){
   
    
    await axios
      .put(HOST + `/api/clients/update`, state)
      .then(response => {
        console.log("TRUST_EDIT");
        /*setState(prevState=>({
          ...prevState,
           snackMessage: "Cliente atualizado com sucesso!" }));
        handleSnackbar();*/
        return true;
      })
      .catch(err => {
        console.log(err);
        /*setState(prevState=>({
          ...prevState,
           success:false,
           snackMessage: "Atualização de Cliente falhou..." }));
          handleSnackbar();*/
        return false;
      });
  };

   function handleNewNomeCarro(e){
    e.persist(); 
    var newV=e.target.value;
    setNewCarro(prevstate=>({...prevstate, nome:newV })); 
   }

   function handleNewPlacaCarro(e){
    e.persist(); 
    var newV=e.target.value;
    setNewCarro(prevstate=>({...prevstate, placa:newV })); 
   }

   function handleNewInfoCarro(e){
    e.persist(); 
    var newV=e.target.value;
    setNewCarro(prevstate=>({...prevstate, info:newV })); 
   }

   function handleNewKmCarro(e){
    e.persist(); 
    var newV=e.target.value;
    setNewCarro(prevstate=>({...prevstate, km:newV }));
   }

   function handleSubmitCarro(){
    var ar=state.carros;
    ar.push(newCarro);

  setState(prevstate=>({...prevstate, carros:ar }));
  setNewCarro({});

   }

   async function handleNewClient(){

    var newCliente = {
      nomeCliente: state.nomeCliente,
      date:state.date,
      telefone:state.telefone,
      cpf:state.cpf,
      sexo:state.sexo,
      estado:state.estado,
      cidade:state.cidade,
      bairro:state.bairro,
      cep:state.cep,
      rua:state.rua,
      numeroEndereco:state.numeroEndereco,
      apartamento:state.apartamento,
      nomeApartamento:state.nomeApartamento,
      numeroApartamento:state.numeroApartamento,
      carros:state.carros 
    };
//console.log(newProduct);

    await axios
      .post(HOST + `/api/clients/client`, newCliente)
      .then(response =>{
          console.log("trust");
                  
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
        console.log(err);
    /*    setState(prevState=>({
          ...prevState,
           success:false,
           snackMessage: "Falha ao salvar o produto..." }));
           handleSnackbar();*/
      });
      
  };


  
  const {nomeCliente,date,telefone,cpf,sexo,estado,cidade,bairro,cep,rua,numeroEndereco,apartamento,nomeApartamento,numeroApartamento,carros } = state;
  const options=[{ text: 'Masculino', value: "masculino",selected:true },
  { text: 'Feminino', value: 'feminino' }];
  function getS(){
    console.log(state);
    
    
   if(state.sexo==="masculino") {return options[0].value;
  }else if(state.sexo==="feminino"){return options[1].value;}
};
var renderSexo=()=>{
    
      if(state.sexo==="masculino") {
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
        
      }else if(state.sexo==="feminino"){
        
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
 const [selectedS,setS]=useState();
  return (
      <div className="container" style={{marginRight:"1%"}}>
  <Form>
  <Header as='h3'>Sobre o Cliente</Header>
        <Form.Group widths='equal'>
          <Form.Input fluid label='Nome' placeholder='Nome' defaultValue={nomeCliente} onChange={handleClienteNome} onKeyDown={handleEnter}/>
          <Form.Input label='Data de adição' defaultValue={date} /*control={DateInput}*/  />
          <Form.Input fluid label='Telefone' placeholder='Telefone' defaultValue={telefone} onChange={handleTelefone} onKeyDown={handleEnter}/>
          <Form.Input fluid label='CPF' placeholder='CPF'  defaultValue={cpf} onChange={handleCpf} onKeyDown={handleEnter}/>
          
          {renderSexo()}
        </Form.Group>
        <Divider />
        <Header as='h3'>Endereço</Header>
        <Form.Group widths='equal'>
       
          <Form.Input fluid label='Estado' placeholder='Estado' /*defaultValue="sc"*/ defaultValue={estado} onChange={handleEstado} onKeyDown={handleEnter}/>
          <Form.Input fluid label='Cidade' placeholder='Cidade' defaultValue={cidade} onChange={handleCidade} onKeyDown={handleEnter}/>
          <Form.Input fluid label='Bairro' placeholder='Bairro' defaultValue={bairro} onChange={handleBairro} onKeyDown={handleEnter}/>
          </Form.Group>
          <Form.Group widths='equal'>
          <Form.Input fluid label='CEP' placeholder='CEP' defaultValue={cep} onChange={handleCep} onKeyDown={handleEnter}/>
          <Form.Input fluid label='Rua' placeholder='Rua' defaultValue={rua} onChange={handleRua} onKeyDown={handleEnter}/>
          <Form.Input fluid label='Numero' placeholder='Número'  defaultValue={numeroEndereco} onChange={handleNumeroEndereco} onKeyDown={handleEnter}/>
          </Form.Group>
          <Form.Group>
          <Form.Radio
            toggle
            label='Apartamento'
            
            //defaultValue={!apartamento}
            checked={apartamento}
            onChange={handleApartamento}
          />
          <Form.Input disabled={!apartamento} fluid label='Nome do Apartamento' placeholder='Nome' defaultValue={nomeApartamento} onChange={handleNomeApartamento} onKeyDown={handleEnter}/>
          <Form.Input disabled={!apartamento} fluid label='Número Apartamento' placeholder='Número' defaultValue={numeroApartamento} onChange={handleNumeroApartamento} onKeyDown={handleEnter}/>
        </Form.Group>
        <Divider />
        
        <Header as='h3'>Carros</Header>

            <Form.Group inline widths='equal' >
              <Form.Input fluid label='Nome' placeholder='Nome'  onChange={handleNewNomeCarro} onKeyDown={handleEnter}/>
              <Form.Input fluid label='Placa' onChange={handleNewPlacaCarro} onKeyDown={handleEnter}/>
              <Form.Input fluid label='Km' placeholder='Km'  onChange={handleNewKmCarro} onKeyDown={handleEnter}/>
              <Form.Input control={TextArea} fluid="true" label='Informações' placeholder='Info' onChange={handleNewInfoCarro} onKeyDown={handleEnter}/>
              {/*<Form.Input fluid label='Data de adição'   />*/}
              <Form.Button onClick={()=>handleSubmitCarro()} >Salvar Carro</Form.Button>
            </Form.Group>
          {carros ? (
          carros.map((carro,i)=>{return(
            <Form.Group inline key={i} widths='equal'>
              <Form.Input fluid label='Nome' placeholder='Nome' defaultValue={carro.nome} onChange={e=>handleNomeCarro(e,i)} onKeyDown={handleEnter}/>
              <Form.Input fluid label='Placa'  defaultValue={carro.placa} onKeyDown={handleEnter}/>
              <Form.Input fluid label='Km' placeholder='Km' defaultValue={carro.km} onChange={e=>handleKmCarro(e,i)} onKeyDown={handleEnter}/>
              <Form.Input control={TextArea} fluid="true" label='Informações' placeholder='Info' defaultValue={carro.info} onChange={e=>handleInfoCarro(e,i)} onKeyDown={handleEnter}/>
              <Form.Input fluid label='Data de adição'  defaultValue={carro.date} />
            </Form.Group>
          )})):(
            <p>Não há carros cadastrados</p>
          )}
        <Form.Button onClick={()=>handleSubmit()} positive>Salvar</Form.Button>
      </Form>
    </div>
   
  );
}