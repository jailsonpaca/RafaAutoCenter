import React from "react";
import "../assets/App.css";
import { Table,Button,Icon } from "semantic-ui-react";

export default function TransactionDetail(props){
  
    var { quantity, name,id, price,precofabrica } = props;
    var productTotal;
    function troca(id){

      props.onTroca(id);

    }
    if(price){productTotal = (parseFloat(quantity) * parseFloat(price)).toFixed(2);}
    else{productTotal=0; }
    return (
      <Table.Body>
        <Table.Row>
          <Table.Cell> {quantity} </Table.Cell>
          <Table.Cell>
            {name}
          </Table.Cell>
          <Table.Cell>
            <span>{productTotal}</span>
            <br />
            <small className="small-text">
              <em>R$ {price} cada</em>
              <em> R$ {precofabrica} fabrica</em>
            </small>
            <Button
            icon
            onClick={() =>{troca(id);}}
          ><Icon name="exchange" /></Button>
          </Table.Cell>
        </Table.Row>
      </Table.Body>
    );
  
}
