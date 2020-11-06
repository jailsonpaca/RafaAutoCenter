import React, { useEffect, useState } from "react";
import "../assets/App.css";
import Product from "./Product";
import axios from "axios";
import { Button, Icon, Table, Input, Grid, Message } from "semantic-ui-react";
import _ from 'lodash';
import { HOST } from './global.js'
import ModalAddProduct from "./modals/adicionar-produto";

export default function Inventory() {

  const [state, setState] = useState({
    productFormModal: false,
    _id: 0,
    name: "",
    type:0,
    duration: 0,
    snackMessage: "",
    success: true,
    quantity: 1,
    price: 0,
    precofabrica: 0,
    fornecedor: ""
  });

  const [products, setProducts] = useState([]);
  const [source, setSource] = useState([]);

  useEffect(() => {
    let isSubscribed = true;
    async function loadProducts() {
      var url = HOST + `/api/inventory/products`;
      const response = await axios.get(url);
      const NewRes = response.data.map(function (row) {

        return { title: row.name, code: row._id, price: row.price }
      });
      if (isSubscribed) {
        setSource(NewRes);
        setProducts(response.data);

      }

    }

    loadProducts();
    return () => isSubscribed = false;
  }, [state.productFormModal]);



  async function handleEditProduct(editProduct) {


    await axios
      .put(HOST + `/api/inventory/product`, editProduct)
      .then(response => {
        setState(prevState => ({
          ...prevState,
          snackMessage: "Produto atualizado com sucesso!"
        }));
        handleSnackbar();
        return true;
      })
      .catch(err => {
        console.log(err);
        setState(prevState => ({
          ...prevState,
          success: false,
          snackMessage: "Atualização de produto falhou..."
        }));
        handleSnackbar();
        return false;
      });
  };





  async function handleSnackbar() {
    var bar = document.getElementById("snackbar");
    bar.className = "show";
    setTimeout(function () {
      bar.className = bar.className.replace("show", "");
    }, 3000);
  };

  async function delet(dProduct) {

    await axios
      .delete(HOST + `/api/inventory/product/` + dProduct._id)
      .then(async response => {
        setState(prevState => ({
          ...prevState,
          snackMessage: "Produto excluido com sucesso!"
        }));
        handleSnackbar();
        var url = HOST + `/api/inventory/products`;
        const respon = await axios.get(url);
        setProducts(respon.data);


        return true;
      })
      .catch(err => {
        console.log(err);
        setState(prevState => ({
          ...prevState,
          snackMessage: "Falha ao excluir produto..."
        }));
        handleSnackbar();
        return false;
      });
  }

  var renderProducts = () => {

    if (products.length === 0) {
      return //<tr><td><p>{products}</p></td></tr>;
    } else {
      var ar = products;
      ar.sort(function (a, b) { return a.quantity - b.quantity });
      if (sear.title) {

        var re = new RegExp(_.escapeRegExp(sear.title), 'i');
        var isMatch = (products) => re.test(products.name);
        ar = _.filter(products, isMatch);


      }

      return ar.map((product, i) => (


        <Product {...product} key={product._id} onDelete={delet} onEditProduct={handleEditProduct} />
      ));
    }
  };



  const initialState = { isLoading: false, results: source, value: '', code: "0" };
  const [sear, setSear] = useState(initialState);


  function handleSear(e) {


    e.persist();
    e.preventDefault();
    setSear(prevState => ({
      ...prevState,
      title: e.target.value
    }));
  };

  return (
    <div>
      <div className="container" >

        <Grid columns={1} className="grid">
          <Grid.Row>
            <Grid.Column width={14}   >
              <Table celled striped size="small" columns="6">
                <Table.Header>
                  <Table.Row>
                    <Table.HeaderCell colSpan="4" >

                      <Button onClick={() => setState(prevState => ({
                        ...prevState,
                        productFormModal: true
                      }))}
                        primary
                        size="huge">
                        <Icon name="plus" /> Adicionar novo item
                  </Button>
                    </Table.HeaderCell>
                    <Table.HeaderCell colSpan="2" >
                      <Input defaultValue={sear.title}
                        name="name"
                        type="text"
                        onChange={e => handleSear(e)}
                        autoFocus />
                    </Table.HeaderCell>
                  </Table.Row>
                  <Table.Row>
                    <Table.HeaderCell >Nome/Codigo de Barras</Table.HeaderCell>
                    <Table.HeaderCell style={{ padding: '.78571429em .2em', textAlign: 'center' }}>Preço/Preço de Fábrica</Table.HeaderCell>
                    <Table.HeaderCell style={{ padding: '.78571429em .2em', textAlign: 'center' }}>Qtd.em Estoque</Table.HeaderCell>
                    <Table.HeaderCell style={{ padding: '.78571429em .2em', textAlign: 'center' }}>Fornecedor</Table.HeaderCell>
                    <Table.HeaderCell style={{ padding: '.78571429em .2em', textAlign: 'center' }}><Icon name="edit" /></Table.HeaderCell>
                    <Table.HeaderCell style={{ padding: '.78571429em .2em', textAlign: 'center' }}><Icon name="trash" /></Table.HeaderCell>
                  </Table.Row>
                </Table.Header>
                <Table.Body>{renderProducts()}</Table.Body>
              </Table>
            </Grid.Column>
          </Grid.Row>
        </Grid>

      </div>

      <ModalAddProduct open={state.productFormModal} data={state} setState={setState} products={products}
        setProducts={setProducts} handleSnackbar={handleSnackbar} />
      <Message id="snackbar" success={state.success ? true : false} error={state.success ? false : true} className="message">
        <Icon name={state.success ? "check circle" : "times circle"} />{state.snackMessage}
      </Message>

    </div>
  );

}


