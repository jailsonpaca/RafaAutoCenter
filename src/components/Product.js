import React, { useState } from "react";
import { Button, Icon, Table } from "semantic-ui-react";
import ModalEditProduct from "./modals/editar-produto";

export default function Product(props) {

  const [state, setState] = useState({
    productModal: false,
    _id: props._id,
    new_id: props._id,
    name: props.name,
    newName: props.name,
    price: props.price,
    newPrice: props.price,
    quantity: props.quantity,
    fornecedor: props.fornecedor,
    newFornecedor: props.fornecedor,
    precofabrica: props.precofabrica,
    newPrecofabrica: props.precofabrica,
    newQuantity: props.quantity
  });

  function handleProduct() {

    setState(prevState => ({
      ...prevState,
      productModal: false
    }));
    var editProduct = {
      name: state.newName,
      quantity: state.newQuantity,
      price: state.newPrice,
      precofabrica: state.newPrecofabrica,
      fornecedor: state.newFornecedor,
      _id: state.new_id
    };

    props.onEditProduct(editProduct);
    setState(prevState => ({
      ...prevState, name: state.newName,
      quantity: state.newQuantity,
      price: state.newPrice,
      fornecedor: state.newFornecedor,
      precofabrica: state.newPrecofabrica,
      _id: state.new_id
    }));
  };

  function delet() {
    var dProduct = {
      name: state.name,
      quantity: state.quantity,
      price: state.price,
      precofabrica: state.precofabrica,
      fornecedor: state.fornecedor,
      _id: state._id
    };
    props.onDelete(dProduct);
  }

  const {
    name,
    price,
    quantity,
    precofabrica,
    fornecedor,
    _id,
  } = state;

  return (
    <Table.Row>

      <Table.Cell width="4" style={{ maxWidth: 320 }}>{name}({_id})</Table.Cell>
      <Table.Cell width="2">R$ {price}<br />R$ {precofabrica}</Table.Cell>
      <Table.Cell width="1">{quantity}</Table.Cell>
      <Table.Cell width="1">{fornecedor}</Table.Cell>
      <Table.Cell width="1">
        <Button
          icon
          onClick={() => setState(prevState => ({
            ...prevState,
            productModal: true
          }))}
        ><Icon name="edit" /></Button>
      </Table.Cell>
      <Table.Cell width="1">
        <Button
          icon
          negative
          onClick={() => delet()}

        >
          <Icon name="trash"></Icon>
        </Button>
      </Table.Cell>
      <ModalEditProduct open={state.productModal} data={state} setState={setState}
        handleProduct={handleProduct} />
    </Table.Row>
  );
}

