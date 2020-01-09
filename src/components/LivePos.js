import React,{useState,useEffect} from "react";
import "./App.css";
import { Button,Icon,Table,Input} from "semantic-ui-react";

export default function LivePos(props){

  const [itemNumber,setQ]=useState(props.quantity);
  
  async function increment () {
    var v=itemNumber+1;
    if(props.emestoque>=v){
      
    setQ(v);
    
    changed(v);
    }
    
    
  };

  useEffect(()=>{
    setQ(props.quantity);
  
  },[props.quantity]);

  async function decrement() {
    
    var v=itemNumber-1;
    setQ(v);
    changed(v);
    
     
  };

  async function delet() {
    
    var v=itemNumber-1;
    setQ(v);
    changed("delete");
    
  };

  async function changed(e) {
    
    props.handleChange(id, e);
   
  };

    const { id, name, price} = props;
    
    
    return (
      <Table.Row>
        <Table.Cell width="4"> {name}</Table.Cell>
        <Table.Cell width="2"> R$ {price}</Table.Cell>
        <Table.Cell width="2">
          
          <Button
            icon
            onClick={() => decrement()}
            attached='left'
          >
            <Icon name="minus" />
          </Button>

          
            <Input type="number" style={{width:"40% ",height:"40px"}} value={itemNumber}   onChange={e=>changed(e.target.value)} disabled/>
          

          <Button
            icon
            onClick={() => increment() }
            attached='right'
          >
            <Icon name="plus" />
          </Button>
        </Table.Cell>
        <Table.Cell width="1">R$ 0.00</Table.Cell>
        <Table.Cell width="1">{price*itemNumber}</Table.Cell>
        <Table.Cell width="1">
          <Button
            
            onClick={() => delet()}
          >
            <Icon name="trash" />
          </Button>
        </Table.Cell>
      </Table.Row>
    );
  
}


