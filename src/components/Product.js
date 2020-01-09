import React, {useState } from "react";
import { Modal, Button,Icon,Table,Input, Form } from "semantic-ui-react";

export default function Product(props){
  
  const [state,setState]=useState({productModal: false,
                                  _id:props._id,
                                  new_id:props._id,
                                  name: props.name,
                                  newName: props.name,
                                  price: props.price,
                                  newPrice: props.price,
                                  quantity: props.quantity,
                                  fornecedor:props.fornecedor,
                                  newFornecedor:props.fornecedor,
                                  precofabrica:props.precofabrica,
                                  newPrecofabrica:props.precofabrica,
                                  newQuantity: props.quantity
                                });


  function handleName(e){

    e.persist();
    e.preventDefault();
    setState(prevState=>({
      ...prevState, 
       newName: e.target.value }));
  };
  function handle_id(e){
    
    e.persist();
    e.preventDefault();
    setState(prevState=>({
      ...prevState, 
       new_id: e.target.value }));

  };
  function handlePrice(e){
    e.persist();
    e.preventDefault();
    setState(prevState=>({
      ...prevState, 
       newPrice:e.target.value}));
  };
  function handleQuantity(e){
    e.persist();
    e.preventDefault();
    setState(prevState=>({
      ...prevState, 
       newQuantity: e.target.value }));
  };
  function handlePrecofabrica(e){
    e.persist();
    e.preventDefault();
    setState(prevState=>({
      ...prevState, 
       newPrecofabrica: e.target.value }));
  };
  function handleFornecedor(e){
    e.persist();
    e.preventDefault();
    setState(prevState=>({
      ...prevState, 
       newFornecedor: e.target.value }));
  };
  function handleProduct(){
    
    setState(prevState=>({
      ...prevState, 
       productModal: false }));
    //console.log("id", props._id);
    var editProduct = {
      name: state.newName,
      quantity: state.newQuantity,
      price: state.newPrice,
      precofabrica:state.newPrecofabrica,
      fornecedor:state.newFornecedor,
      _id: state.new_id
    };
    console.log(editProduct);
    
    props.onEditProduct(editProduct);
    setState(prevState=>({
      ...prevState,  name:state.newName,
              quantity:state.newQuantity,
              price: state.newPrice,
              fornecedor:state.newFornecedor,
              precofabrica:state.newPrecofabrica,
            _id:state.new_id }));
  };

  function delet(){
    var dProduct = {
      name: state.name,
      quantity: state.quantity,
      price: state.price,
      precofabrica:state.precofabrica,
      fornecedor:state.fornecedor,
      _id: state._id
    };
    props.onDelete(dProduct);
  }
  
    const {
      newName,
      newPrice,
      newQuantity,
      name,
      price,
      quantity,
      precofabrica,
      fornecedor,
      _id,
      newPrecofabrica,
      new_id,
      newFornecedor

    } = state;

    function handleEnter(event){
      if (event.keyCode === 13) {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        form.elements[index + 1].focus();
        event.preventDefault();
      }
    }

    return (
        <Table.Row>
        
        <Table.Cell width="4">{name}({_id})</Table.Cell>
        <Table.Cell width="2">R$ {price}/R$ {precofabrica}</Table.Cell>
        <Table.Cell width="1">{quantity}</Table.Cell>
        <Table.Cell width="1">{fornecedor}</Table.Cell>
        <Table.Cell width="1">
          <Button
            icon
            onClick={() => setState(prevState=>({
              ...prevState, 
              productModal: true }))}
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
        <Modal open={state.productModal}>
          <Modal.Header>
            Editar Produto
          </Modal.Header>
          <Modal.Content><Form  name="newProductForm">
              <Form.Field>
                <label className="col-md-4 control-label" htmlFor="barcode">
                  Código de Barras
                </label>
                <div className="col-md-4">
                  <Input
                    id="barcode"
                    name="barcode"
                    placeholder="Código de Barras"
                    onChange={e=>handle_id(e)}
                    className="form-control"
                    value={new_id}
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
              
              <Form.Field>
                <label className="col-md-4 control-label" htmlFor="name">
                  Nome
                </label>
                <div className="col-md-4">
                  <Input
                    name="name"
                    placeholder="Nome"
                    onChange={e=>handleName(e)}
                    className="form-control"
                    value={newName}
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
              <Form.Field>
                <label className="col-md-4 control-label" htmlFor="price">
                  Preço
                </label>
                <div className="col-md-4">
                  <Input
                    name="price"
                    type="number"
                    placeholder="Preço"
                    className="form-control"
                    onChange={e=>handlePrice(e)}
                    value={newPrice}
                    //step="any"
                    //min="0"
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
              <Form.Field>
                <label className="col-md-4 control-label" htmlFor="price">
                  Preço de Fábrica
                </label>
                <div className="col-md-4">
                  <Input
                    name="price"
                    type="number"
                    placeholder="Preço"
                    className="form-control"
                    onChange={e=>handlePrecofabrica(e)}
                    defaultValue={newPrecofabrica}
                    step="any"
                    //min="0"
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
              <Form.Field>
                <label
                  className="col-md-4 control-label"
                  htmlFor="quantity_on_hand"
                >
                  Quantidade em estoque
                </label>
                <div className="col-md-4">
                  <Input
                    name="quantity_on_hand"
                    typer="number"
                    min="0"
                    placeholder="Quantidade em Estoque"
                    onChange={e=>handleQuantity(e)}
                    value={newQuantity}
                    className="form-control"
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
              <Form.Field>
                <label
                  className="col-md-4 control-label"
                  htmlFor="quantity_on_hand"
                >
                  Fornecedor
                </label>
                <div className="col-md-4">
                  <Input
                    name="quantity_on_hand"
                    placeholder="Fornecedor"
                    onChange={e=>handleFornecedor(e)}
                    defaultValue={newFornecedor}
                    className="form-control"
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
              
              <br /> <br /> <br />
            </Form>
          </Modal.Content>
          <Modal.Actions>
            <Button onClick={() => setState(prevState=>({
              ...prevState,  productModal: false }))}>
              Fechar
            </Button>
            <Button onClick={()=>handleProduct()}>Atualizar</Button>
          </Modal.Actions>
        </Modal></Table.Row>
    );
}

