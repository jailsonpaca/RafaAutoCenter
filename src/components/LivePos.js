import React from "react";
import "../assets/App.css";
import { Button, Icon, Table, Input } from "semantic-ui-react";

export default function LivePos(props) {

  async function increment() {
    var v = parseFloat(props.quantity) + 1;
    if (props.emestoque >= v) {

      changed(v);
    }


  };

  async function decrement() {

    var v = parseFloat(props.quantity) - 1;
    if(v>=0){

      changed(v);
    }

  };

  async function delet() {

    //var v = parseFloat(props.quantity) - 1;
    changed("delete");

  };

  async function changed(e) {

    props.handleChange(id, e);

  };

  const { id, name, price } = props;


  return (
    <Table.Row>
      <Table.Cell colSpan="2"   style={{padding:'.78571429em 0',textAlign: 'center'}}> {name}</Table.Cell>
      <Table.Cell   style={{padding:'.78571429em 0',textAlign: 'center'}}>R$ {price}</Table.Cell>
      <Table.Cell   style={{padding:'.78571429em 0',textAlign: 'center'}}>

        <Button
          icon
          onClick={() => decrement()}
          attached='left'
          style={{verticalAlign: 3}}
        >
          <Icon name="minus" />
        </Button>


        <Input type="number" min="0.1" style={{ width: "40% ", height: "40px" }} value={props.quantity}
        onChange={e => changed(e.target.value)} className="qtyInput" />


        <Button
          icon
          onClick={() => increment()}
          attached='right'
          style={{verticalAlign: 3}}
        >
          <Icon name="plus" />
        </Button>
      </Table.Cell>
      {/*<Table.Cell width="1"  collapsing style={{padding:'.78571429em 0',textAlign: 'center'}}>R$ 0.00</Table.Cell>*/}
      <Table.Cell  style={{padding:'.78571429em 0',textAlign: 'center'}}>R$ {price * props.quantity}</Table.Cell>
      <Table.Cell  style={{padding:'.78571429em 0',textAlign: 'center'}}>
        <Button onClick={() => delet()}><Icon name="trash" /></Button>
      </Table.Cell>
    </Table.Row>
  );

}


