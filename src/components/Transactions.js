import React, { useState,useEffect } from "react";
import "./App.css";
import CompleteTransactions from "./CompleteTransactions";
import axios from "axios";
import _ from 'lodash';
import moment from "moment";
import 'moment/locale/pt-br';
import { Message,Icon,Label,Table,Input, Grid } from "semantic-ui-react";
import {DateInput} from 'semantic-ui-calendar-react';

const HOST = "http://localhost:8001";
const url = HOST + `/api/all`;

export default function Transactions(props){
  
    const [state,setState]=useState({success:true, transactions: [] });
    moment.locale('pt-br');
    const [data,setData]=useState(moment().format("DD-MM-YYYY"));
    const [dele,setDelete]=useState(0);
    useEffect(()=>{
      let isSubscribed = true;
      async function loadTransaction(){
      axios
      .get(url)
      .then((response) =>{
        if (isSubscribed) {
        setState(prevState=>({...prevState, transactions: response.data }));
        }
      })
      .catch(err => {
        console.log(err);
      });
    }
    loadTransaction(); 
    return () => isSubscribed = false;
      
    },[dele])


    var { transactions } = state;

    var rendertransactions = () => {
      
      if (transactions.length === 0) {
        return <tr><td><p>Transações não encontradas</p></td></tr>;
      } else {
        moment.locale('pt-br');
      
        var ar= _.orderBy(transactions,[object => new moment(object.date,"DD-MMM-YYYY HH:mm:ss").format("YYYYMMDD HHmmss")], ['desc']);
       
        ar=_.map(ar,function (a) { if(moment(a.date,"DD-MMM-YYYY HH:mm:ss").format("YYYYMMDD")===moment(data,"DD-MM-YYYY").format("YYYYMMDD")){
          
          
          return a;
        }});
        ar = _.without(ar, undefined);
        
        /*if((sear.code)){
         
        var re = new RegExp(_.escapeRegExp(sear.code), 'i');
        var isMatch = (ari) => re.test(ari.id);
        ar=_.filter(ar, isMatch);
        
        
        } */ 
        var s=0,c=0;
        for(var i=0;i<ar.length;i++){
          
          for(var j=0;j<ar[i].items.length;j++){
            s+=parseFloat(ar[i].items[j].price)*parseFloat(ar[i].items[j].quantity);  
            if(ar[i].items[j].precofabrica){
              
              //console.log("i: "+i);
              
              //console.log(parseFloat(ar[i].items[j].precofabrica)*parseFloat(ar[i].items[j].quantity));
             
              
            c+=parseFloat(ar[i].items[j].precofabrica)*parseFloat(ar[i].items[j].quantity);
              
          }
          }
          if(ar[i].desconto){
            
            
          //c+=parseInt(ar[i].desconto,10);
        }
        }
       console.log(c);
       console.log(s);
       
        document.getElementById("iSum").value=parseFloat(s,10).toFixed(2);
        document.getElementById("lSum").value=parseFloat((s-c)).toFixed(2);
        return ar.map(transaction => (
          <CompleteTransactions key={transaction._id} onDelete={delet} {...transaction} />
        ));
      }
    };

    async  function delet(dTransaction){
        //console.log(HOST + `/api/`+dTransaction._id);
        
       await axios
       .delete(HOST + `/api/`+dTransaction._id)
       .then(async response => {
         setState(prevState=>({
           ...prevState,
           success:true,
            snackMessage: "Transação excluida com sucesso!" }));
         handleSnackbar();
        setDelete(dele+1);
         return true;
       })
       .catch(err => {
         console.log(err);
         setState(prevState=>({
           ...prevState,
           success:false,
            snackMessage: "Falha ao excluir Transação..." }));
           handleSnackbar();
         return false;
       });
     }
    
     async function handleSnackbar(){
      var bar = document.getElementById("snackbar");
      bar.className = "show";
      setTimeout(function() {
        bar.className = bar.className.replace("show", "");
      }, 3000);
    };
  

    var handleChange = (event, {name, value}) => {
          setData(moment(value,"DD-MM-YYYY").format("DD-MM-YYYY"));
    }

    var handleNext = () => {
     var d=moment(data,"DD-MM-YYYY").add(1, 'd').format("DD-MM-YYYY");
      setData(d);
    }
    var handleBack = () => {
      var d=moment(data,"DD-MM-YYYY").subtract(1, 'd').format("DD-MM-YYYY");
     
      
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
          <Grid.Row columns={3}  >
            <Grid.Column width={6} className="dataP">
          <Input labelPosition='right'  /*style={{marginRight: "10%"}}*/>
            <Label>
            <Icon name='left arrow' onClick={handleBack} />
            </Label>
            <DateInput
           name="date"
           placeholder="Date"
           value={data}
           iconPosition="left"
           onChange={handleChange}
           localization='pt-br'
           animation='none'
         />
            <Label>
            <Icon name='right arrow' onClick={handleNext}/>
            </Label>
          </Input>
          </Grid.Column>
          <Grid.Column width={4} className="cSum">
          <Input labelPosition='right' defaultValue="0" id="iSum" disabled  inverted={true}>
            <Label active>Total:</Label>
            <input />
            <Label active ><Icon name='dollar sign' /></Label>
          </Input>
          </Grid.Column>
          <Grid.Column width={3} className="lSum">
          <Input labelPosition='right' defaultValue="0" id="lSum" disabled  inverted={true}>
            <Label active>Lucro:</Label>
            <input />
            <Label active><Icon name='dollar sign' /></Label>
          </Input>
          </Grid.Column>         
          </Grid.Row>
        <Grid.Row>
        <Grid.Column width={14}> 
        {/*<Input defaultValue={sear.title}  
                            name="name"
                            type="text"
                            onChange={e=>handleSear(e)}
                            autoFocus></Input>*/}
        <h1>Transações:</h1>
      <div>
      

        <Table celled striped  size="small" columns="4">
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Hora</Table.HeaderCell>
              <Table.HeaderCell>Total</Table.HeaderCell>
              <Table.HeaderCell>Produtos</Table.HeaderCell>
              <Table.HeaderCell>Detalhes</Table.HeaderCell>
            </Table.Row>
          </Table.Header>
          <Table.Body>{rendertransactions()}</Table.Body>
        </Table>
      </div>
      </Grid.Column>
      </Grid.Row>
      </Grid>
      <Message id="snackbar" success={state.success ? true : false } error={state.success ? false : true } className="message">
        <Icon name={state.success ? "check circle" : "times circle" } />{state.snackMessage}
        </Message>
      </div>
    );
  
}


