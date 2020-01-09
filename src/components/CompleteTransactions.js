import React, { useState } from "react";
import TransactionDetail from "./TransactionDetail";
import 'moment/locale/pt-br';
import axios from "axios";
import { Modal, Button,Icon,Table, } from "semantic-ui-react";
const HOST = "http://localhost:8001";

export default function CompleteTransactions(props){
  
  const [state,setState]=useState({
    transactionModal: false,
    trocaModal: false,
    totalquantity: 0,
    items: []
  });


  
    var { date, total, items,totalPago,troco,cartao,parcelas,desconto,garantia,info} = props;
    var renderQuantity = items => {
      var totalquantity = 0;
      for (var i = 0; i < items.length; i++) {
        totalquantity =
          parseInt(totalquantity, 10) + parseInt(items[i].quantity, 10);
      }

      return totalquantity.toFixed(2);
    };

    var getTotal=items=>{
      var sum=0;
      
      
       for(var i=0;i<items.length;i++){
         //console.log(items[i].price);
         if(items[i].price){
          
        sum+=parseFloat(items[i].price)*items[i].quantity;
       // console.log(sum);
        
         }
       }
         
       
        
       return sum.toFixed(2); 
    }

    var getsoma=items=>{
        var sum=0;
        
        
         for(var i=0;i<items.length;i++){
           if(items[i].precofabrica){
            //console.log(items);
          sum+=parseFloat(items[i].precofabrica)*items[i].quantity;
          //console.log(items[i]);
           }
         }
           
         
          
         return sum.toFixed(2);
    };

    var troca =async(id) => {
      var k=0;
      delet();
      for(var i=0;i<items.length;i++){
        if(items[i].id!==111){
          k=0;
          
          
          while(k<items[i].quantity){

            await axios.put(HOST + `/api/inventory/product/increment/`+items[i].id)
            .then(response => {   return true; }).catch(err => {    console.log(err); return false;      });
            k++;
          }
      }
      }

    }

    var renderItemDetails = items => {
      return items.map((item,i) => <TransactionDetail onTroca={troca} key={i} {...item} />);
    };

    function soma(a,b){
    //  console.log(b);
      
      return (parseFloat(a,10)+parseFloat(b,10)).toFixed(2);
    }
    
    function subtract(a,b){
      console.log(a+"  "+b);
      
      return (parseFloat(a)-parseFloat(b)).toFixed(2);
    }
    var verify=()=>{
     
      
      if(parseInt(parcelas,10)===0){ return "Débito"}
      else{ return "Crédito"}
    }

    var parc=()=>{
      return parcelas + " X";
    }
    function delet(){
      var dTransaction = {
        _id: props._id
      };
      setState(prevState=>({...prevState, transactionModal: false }));
      props.onDelete(dTransaction);
      
    }
    
    return (
      <Table.Row positive={cartao}>
        <Table.Cell width="4"> {date}</Table.Cell>
        <Table.Cell width="1"> {total} </Table.Cell>
        <Table.Cell width="1"> {renderQuantity(items)} </Table.Cell>
        <Table.Cell width="1">
          <Button
            onClick={() => setState(prevState=>({
              ...prevState,  
              transactionModal: true }))}
              icon
              size="huge"
          >
            <Icon name="zoom" />
          </Button>
        </Table.Cell>

        <Modal open={state.transactionModal}>
          <Modal.Header>
            Detalhes da Transação
          </Modal.Header>
          <Modal.Content>
            <div className="panel panel-primary">
              <div className="panel-heading text-center lead">{date}</div>
              
              {cartao ?(<Table className="receipt table table-hover">
                <Table.Header>
                  <Table.Row className="small">
                    <Table.HeaderCell> Quantidade </Table.HeaderCell>
                    <Table.HeaderCell> Produto </Table.HeaderCell>
                    <Table.HeaderCell> Preço </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {renderItemDetails(items)}
                <Table.Body>
                  <Table.Row className="total">
                    <Table.Cell />
                    <Table.Cell>Total</Table.Cell>
                    <Table.Cell> R$ {soma(total,desconto)} </Table.Cell>
                  </Table.Row>
                  <Table.Row negative>
                    <Table.Cell />
                    <Table.Cell>Desconto</Table.Cell>
                    <Table.Cell> R$ {desconto} </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell />
                    <Table.Cell> {verify()}</Table.Cell>
                    <Table.Cell> {parc()} </Table.Cell>
                  </Table.Row>
                  <Table.Row className="lead" positive>
                    <Table.Cell />
                    <Table.Cell>Lucro:</Table.Cell>
                    <Table.Cell> R$ {subtract(getTotal(items),getsoma(items))} </Table.Cell>
                  </Table.Row>
                  <Table.Row className="lead">
                    <Table.Cell />
                    <Table.Cell>Garantia:</Table.Cell>
                    <Table.Cell> {garantia}  </Table.Cell>
                  </Table.Row>
                  <Table.Row className="lead">
                    <Table.Cell />
                    <Table.Cell>Informações:</Table.Cell>
                    <Table.Cell> {info} </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>):(<Table className="receipt table table-hover">
                <Table.Header>
                  <Table.Row className="small">
                    <Table.HeaderCell> Quantitidade </Table.HeaderCell>
                    <Table.HeaderCell> Produto </Table.HeaderCell>
                    <Table.HeaderCell> Preço </Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                {renderItemDetails(items)}
                <Table.Body>
                  <Table.Row className="total">
                    <Table.Cell />
                    <Table.Cell>Total</Table.Cell>
                    <Table.Cell> R$ {soma(total,desconto)} </Table.Cell>
                  </Table.Row>
                  <Table.Row>
                    <Table.Cell />
                    <Table.Cell>Pagamento</Table.Cell>
                    <Table.Cell> R$ {totalPago} </Table.Cell>
                  </Table.Row>
                  <Table.Row negative>
                    <Table.Cell />
                    <Table.Cell>Desconto</Table.Cell>
                    <Table.Cell> R$ {desconto} </Table.Cell>
                  </Table.Row>
                  <Table.Row className="lead">
                    <Table.Cell />
                    <Table.Cell>Troco</Table.Cell>
                    <Table.Cell> R$ {troco} </Table.Cell>
                  </Table.Row>
                  <Table.Row className="lead" positive>
                    <Table.Cell />
                    <Table.Cell>Lucro:</Table.Cell>
                    <Table.Cell> R$ {subtract(getTotal(items),getsoma(items))} </Table.Cell>
                  </Table.Row>
                  <Table.Row className="lead">
                    <Table.Cell />
                    <Table.Cell>Garantia:</Table.Cell>
                    <Table.Cell> {garantia} </Table.Cell>
                  </Table.Row>
                  <Table.Row className="lead">
                    <Table.Cell />
                    <Table.Cell>Informações:</Table.Cell>
                    <Table.Cell> {info} </Table.Cell>
                  </Table.Row>
                </Table.Body>
              </Table>) }
              
            </div>
          </Modal.Content>
          <Modal.Actions>
          <Button onClick={() =>delet() } negative>
              Excluir
            </Button>
            
            <Button onClick={() => setState(prevState=>({...prevState, transactionModal: false }))}>
              Fechar
            </Button>
          </Modal.Actions>
        </Modal>
        
      </Table.Row>
    );
  
}


