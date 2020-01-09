import React, { useEffect,useState} from "react";
import "./App.css";
import Product from "./Product";
import axios from "axios";
import { Modal, Button,Icon,Table,Input, Form, Grid,Message } from "semantic-ui-react";
import _ from 'lodash';
//import SnackBar from './snackbar/index';
//const style = <link rel="stylesheet" href="//cdn.jsdelivr.net/npm/semantic-ui@2.4.2/dist/semantic.min.css" />;


const HOST = "http://localhost:8001";
export default function Inventory() {
  
  

  const [state,setState]=useState({productFormModal: false,
    _id:0,
    name: "",
    snackMessage: "",
    success:true,
    quantity: 1,
    price: 0,
    precofabrica:0,
    fornecedor:""});
  
  const [products,setProducts]=useState([]);
  const [source,setSource]=useState([]);

  useEffect(()=>{
    let isSubscribed = true;
    async function loadProducts(){
      var url = HOST + `/api/inventory/products`;
       const response= await axios.get(url);
       const NewRes = response.data.map(function(row) {

        return { title : row.name, code: row._id, price:row.price }
        });
        if (isSubscribed) {
         setSource(NewRes);
         setProducts(response.data);
         
        }
         //console.log("eff");
         
    }

    loadProducts(); 
    return () => isSubscribed = false;
   },[state.productFormModal]);  
  
  
  async function handleNewProduct(){
    
    setState(prevState=>({
      ...prevState,
       productFormModal: false }));
       if(state._id==0){
         var unique=Math.floor(Math.random()*1000000000000);
         console.log("unique: "+unique);
         
        var newProduct = {
          name: state.name,
          quantity: state.quantity,
          price: parseFloat(state.price).toFixed(2),
          precofabrica:parseFloat(state.precofabrica).toFixed(2),
          fornecedor:state.fornecedor,
          _id:unique
        };
       }else{
    var newProduct = {
      name: state.name,
      quantity: state.quantity,
      price: parseFloat(state.price).toFixed(2),
      precofabrica:parseFloat(state.precofabrica).toFixed(2),
      fornecedor:state.fornecedor,
      _id:state._id
    };
  }

    await axios
      .post(HOST + `/api/inventory/product`, newProduct)
      .then(response =>{
          setState(prevState=>({
            ...prevState, 
            snackMessage: "Produto adicionado com Sucesso!" }));
        handleSnackbar();
        var p=products;
      p.push(newProduct);
      setProducts(p);
          })
      .catch(err => {
        console.log(err);
        setState(prevState=>({
          ...prevState,
           success:false,
           snackMessage: "Falha ao salvar o produto..." }));
        handleSnackbar();
      });
      
  };
  async function handleEditProduct(editProduct){
   
    
    await axios
      .put(HOST + `/api/inventory/product`, editProduct)
      .then(response => {
        setState(prevState=>({
          ...prevState,
           snackMessage: "Produto atualizado com sucesso!" }));
        handleSnackbar();
        return true;
      })
      .catch(err => {
        console.log(err);
        setState(prevState=>({
          ...prevState,
           success:false,
           snackMessage: "Atualização de produto falhou..." }));
          handleSnackbar();
        return false;
      });
  };

  function handleName(e){
    e.persist();

    setState(prevState=>({
      ...prevState,
       name: e.target.value }));
  };
  function handle_id(e){
    e.persist();

    setState(prevState=>({
      ...prevState,
       _id: e.target.value }));
  };
  function handlePrice(e){
    e.persist();

    setState(prevState=>({
      ...prevState,
       price: parseFloat(e.target.value).toFixed(2) }));
  };
  function handlePrecofabrica(e){
    e.persist();

    setState(prevState=>({
      ...prevState,
       precofabrica: parseFloat(e.target.value).toFixed(2) }));
  };

  function handleFornecedor(e){
    e.persist();

    setState(prevState=>({
      ...prevState,
       fornecedor: e.target.value }));
  };
  function handleQuantity(e){
    e.persist();

    setState(prevState=>({
      ...prevState,
       quantity: e.target.value }));
  };
  async function handleSnackbar(){
    var bar = document.getElementById("snackbar");
    bar.className = "show";
    setTimeout(function() {
      bar.className = bar.className.replace("show", "");
    }, 3000);
  };

  
   

   async  function delet(dProduct){
     
      await axios
      .delete(HOST + `/api/inventory/product/`+dProduct._id)
      .then(async response => {
        setState(prevState=>({
          ...prevState,
           snackMessage: "Produto excluido com sucesso!" }));
        handleSnackbar();
        var url = HOST + `/api/inventory/products`;
       const respon= await axios.get(url);
         setProducts(respon.data);
         
         
        return true;
      })
      .catch(err => {
        console.log(err);
        setState(prevState=>({
          ...prevState,
           snackMessage: "Falha ao excluir produto..." }));
          handleSnackbar();
        return false;
      });
    }

    var renderProducts = () => {
      //console.log(products);
      
      if (products.length === 0) {
        return //<tr><td><p>{products}</p></td></tr>;
      } else { 
        var ar=products;
        ar.sort(function(a, b){return a.quantity-b.quantity});
        if(sear.title){
         
        var re = new RegExp(_.escapeRegExp(sear.title), 'i');
        var isMatch = (products) => re.test(products.name);
        ar=_.filter(products, isMatch);
        
        
        }  

        return ar.map((product,i) => (
          

          <Product {...product} key={product._id} onDelete={delet} onEditProduct={handleEditProduct} />
        ));
      }
    };


    function handleEnter(event){
      if (event.keyCode === 13) {
        const form = event.target.form;
        const index = Array.prototype.indexOf.call(form, event.target);
        if(form.elements[index + 1]){
          form.elements[index + 1].focus();
        }
        event.preventDefault();
      }
    }

    const initialState = { isLoading: false, results: source, value: '',code:"0" };
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
                      productFormModal: true }))}
                      primary
                      size="huge"
                  >
                    <Icon name="plus" /> Adicionar novo item
                  </Button>
                </Table.HeaderCell>
              </Table.Row>
              <Table.Row>
                <Table.HeaderCell >Nome/Codigo de Barras</Table.HeaderCell>
                <Table.HeaderCell >Preço/Preço de Fábrica</Table.HeaderCell>
                <Table.HeaderCell >Quantidade em Estoque</Table.HeaderCell>
                <Table.HeaderCell >Fornecedor</Table.HeaderCell>
                <Table.HeaderCell><Icon name="edit" /></Table.HeaderCell>
                <Table.HeaderCell><Icon name="trash" /></Table.HeaderCell>
              </Table.Row>
            </Table.Header>
            <Table.Body>{renderProducts()}</Table.Body>
          </Table>
          </Grid.Column>
          </Grid.Row>
        </Grid>
        </div>

        <Modal open={state.productFormModal} 
        onClose={()=>{setState(prevState=>({
                              ...prevState,
                              productFormModal:false}))}}>
          <Modal.Header>
            Adicionar produto
          </Modal.Header>
          <Modal.Content>
            <Form className="form-horizontal" name="newProductForm">
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
                   // value={state._id}
                    onKeyDown={handleEnter}
                    autoFocus
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
                    className="form-control"
                    onChange={e=>handleName(e)}
                    value={state.name}
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
              <Form.Field>
                <label className="col-md-4 control-label" >
                  Preço
                </label>
                <div className="col-md-4">
                  <Input
                    name="price"
                    placeholder="Preço"
                    className="form-control"
                    onChange={e=>handlePrice(e)}
                    value={state.price}
                    type="number"
                    //step="any"
                    //min="0"
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
              <Form.Field>
              <Form.Field>
                <label className="col-md-4 control-label" >
                  Preço de Fábrica
                </label>
                <div className="col-md-4">
                  <Input
                    //name="price"
                    placeholder="Preço"
                    className="form-control"
                    onChange={e=>handlePrecofabrica(e)}
                    value={state.precofabrica}
                    type="number"
                    step="any"
                   // min="0"
                    onKeyDown={handleEnter}
                  />
                </div>
              </Form.Field>
                <label className="col-md-4 control-label">
                  Quantidade em estoque
                </label>
                <div className="col-md-4">
                  <Input
                  min="0"
                  type="number"
                    name="quantity_on_hand"
                    placeholder="Quantidade em Estoque"
                    onChange={e=>handleQuantity(e)}
                    value={state.quantity}
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
                    name="fornecedor"
                    placeholder="Fornecedor"
                    onChange={e=>handleFornecedor(e)}
                    value={state.fornecedor}
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
      ...prevState,
       productFormModal: false }))}>
              Fechar
            </Button>
            <Button onClick={()=>handleNewProduct()} positive>Salvar</Button>
          </Modal.Actions>
        </Modal>
        <Message id="snackbar" success={state.success ? true : false } error={state.success ? false : true } className="message">
        <Icon name={state.success ? "check circle" : "times circle" } />{state.snackMessage}
        </Message>
        
      </div>
    );
  
}


