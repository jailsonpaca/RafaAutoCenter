import React,{useState} from 'react';
import '../assets/main.css';
import 'semantic-ui-css/semantic.min.css';
import {Form,TextArea,Button,Dropdown,TransitionablePortal,Icon,Header, Segment} from 'semantic-ui-react';
import {DateTimeInput} from 'semantic-ui-calendar-react';
import axios from "axios";
import moment from "moment";
import 'moment/locale/pt-br';
import {HOST} from '../components/global.js'


export default function Problemas() {

  const [desc,setDesc]=useState("Olá Jailson, gostaria de informar sobre um problema que ocorreu no sistema RafaAutoCenter.");
  const options=[{key:"problema",value:"problema",text:"Problema"},{key:"alteração",value:"alteração",text:"Alteração"}];
  const [open,setOpen]=useState(false);
  const [openError,setOpenError]=useState(false);
  moment.locale('pt-br');
  const [data,setData]=useState(moment().subtract(1, "hour").format("DD-MM-YYYY hh-mm"));

  async function sendmail(){
    
    var newDesc=`<p>${desc}</p>`
    var message={
      text:newDesc,
      date:data
    }
    var url = HOST + `/send-email`;
    await axios.post(url,message).then(async (e)=>{
      
      setOpen(true);
      setInterval(()=>setOpen(false),1500);
    },(err)=>{
      setOpenError(true);
      setInterval(()=>setOpenError(false),1500);
    });
      
  }
  var   handleData=(e, { value }) => {
  
    
    setData(value);

  }
 
  var  handleOption=(e, { value }) => {
  
      if(value==="alteração"){
        setDesc("Olá Jailson, gostaria de informar sobre uma alteração a se fazer no sistema RafaAutoCenter.")
      }else{
        setDesc("Olá Jailson, gostaria de informar sobre um problema que ocorreu no sistema RafaAutoCenter.");
      }

  }
  
  var  handleDesc=(e, { value }) => {
    
    setDesc(value);

}

  return (
      <div className="container" style={{padding: "8%",marginRight:"13%"}}>
        <TransitionablePortal open={open} transition={{ animation:'fade', duration:500 }}>
              <Segment textAlign='center' style={{ left: '40%', position: 'fixed', top: '50%', zIndex: 1000 }}>
              <Icon name="paper plane" size="massive"/>
              <Header><strong>Muito bem! O email foi enviado com sucesso!</strong></Header>
              </Segment>
        </TransitionablePortal>
        <TransitionablePortal open={openError} transition={{ animation:'fade', duration:500 }}>
            <Segment textAlign='center' style={{ left: '40%', position: 'fixed', top: '50%', zIndex: 1000 }}>
            <Icon name="cancel" size="massive"/>
            <Header><strong>Ops! O email não foi enviado!</strong></Header>
            </Segment>
        </TransitionablePortal>
        <Form size="massive">
          <Form.Group widths='equal'>
          
          <Form.Field
            control={Dropdown}
            label='Motivo'
            options={options}
            onChange={handleOption}
            placeholder='Escolha...'
            selection
          />
          <Form.Field
           label="Quando aconteceu?"
           control={DateTimeInput}
           name="date"
           placeholder="Date"
           value={data}
           iconPosition="left"
           onChange={handleData}
           localization='pt-br'
           animation='none'
         />
          </Form.Group>
      <Form.Field
          control={TextArea}
          value={desc}
          onChange={handleDesc}
          label='Descreva o Problema/Alteração'
          placeholder='Digite aqui...'
        />
        <Form.Field control={Button} style={{marginLeft:"40%"}} size="massive" positive onClick={()=>sendmail()}>Enviar Email</Form.Field>
      </Form>
       
           
    
    </div>
   
  );
}

