import React, { useEffect } from "react";
import { Modal, Button, Form, Input, Checkbox } from "semantic-ui-react";
import { useRecoilState } from 'recoil';
import { isInventory } from '../utils/global';
import axios from "axios";
import { HOST } from '../global.js';

export default function ModalAddProduct({ open, setState, handleSnackbar, data, products, setProducts }) {
    useEffect(() => {
        let isCancelled = false;
        if (data._id !== 0) {
            async function refreshClients() {
                var url = `https://www.googleapis.com/customsearch/v1?key=AIzaSyDQpv0bZ9rk-MCz-bWy5ilQfcMlRGGGta8&cx=3a15b8f7e6b662dd9&q=${data._id}&lr=Portuguese`;
                const response = await axios.get(url);
                if (response.data.searchInformation.totalResults > 0) {

                    if (!isCancelled) {
                        setState(prevState => ({
                            ...prevState,
                            name: response.data.items[0].title
                        }));
                    }
                }
            }
            refreshClients();
            return () => {
                isCancelled = true;
            };
        }
    }, [data._id, setState])

    const [isInventoryState, setInventory] = useRecoilState(isInventory);

    useEffect(() => {
        if (open) {
            setInventory(true);
        }
    }, [open, setInventory]);

    function handle_id(e) {
        e.persist();

        setState(prevState => ({
            ...prevState,
            _id: e.target.value
        }));
    };

    function handleName(e) {
        e.persist();

        setState(prevState => ({
            ...prevState,
            name: e.target.value
        }));
    };

    function handleType() {
        let val = 1;

        if (data.type !== 0) {
            val = 0;
        }
        setState(prevState => ({
            ...prevState,
            type: val,
        }));
    };

    function handleDuration(e) {
        e.persist();

        setState(prevState => ({
            ...prevState,
            duration: e.target.value
        }));
    };

    function handlePrice(e) {
        e.persist();

        setState(prevState => ({
            ...prevState,
            price: e.target.value
        }));
    };

    function handlePrecofabrica(e) {
        e.persist();

        setState(prevState => ({
            ...prevState,
            precofabrica: e.target.value
        }));
    };

    function handlePrecoQTDfabrica(e) {
        e.persist();
        setState(prevState => ({
            ...prevState,
            precofabrica: e.target.value / data.quantity
        }));
    }

    function handleQuantity(e) {
        e.persist();

        setState(prevState => ({
            ...prevState,
            quantity: e.target.value
        }));
    };

    function handleFornecedor(e) {
        e.persist();

        setState(prevState => ({
            ...prevState,
            fornecedor: e.target.value
        }));
    };

    async function handleNewProduct() {
        var newProduct;
        setState(prevState => ({
            ...prevState,
            productFormModal: false
        }));

        if (data._id === 0) {
            var unique = (new Date()).getTime();

            newProduct = {
                name: data.name,
                type:data.type,
                quantity: data.quantity,
                price: parseFloat(data.price).toFixed(2),
                precofabrica: parseFloat(data.precofabrica).toFixed(2),
                fornecedor: data.fornecedor,
                _id: String(unique),
            };
        } else {
            newProduct = {
                name: data.name,
                type:data.type,
                quantity: data.quantity,
                price: parseFloat(data.price).toFixed(2),
                precofabrica: parseFloat(data.precofabrica).toFixed(2),
                fornecedor: data.fornecedor,
                _id: data._id.toString()
            };
        }
        if (data.type === 1) {

            newProduct.quantity= 1000000;
            newProduct.duration= data.duration;

        }
        await axios
            .post(HOST + `/api/inventory/product`, newProduct)
            .then(response => {
                setState(prevState => ({
                    ...prevState,
                    snackMessage: "Produto adicionado com Sucesso!"
                }));
                handleSnackbar();
                var p = products;
                p.push(newProduct);
                setProducts(p);
            })
            .catch(err => {
                console.log(err);
                setState(prevState => ({
                    ...prevState,
                    success: false,
                    snackMessage: "Falha ao salvar o produto..."
                }));
                handleSnackbar();
            });
        setInventory(false);
    };

    function handleEnter(event) {
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            if (form.elements[index + 1]) {
                form.elements[index + 1].focus();
            }
            event.preventDefault();
        }
    }

    return (
        <Modal open={open}
            onClose={() => {
                setState(prevState => ({
                    ...prevState,
                    productFormModal: false
                }));
                setInventory(false);
            }}>
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
                                onChange={e => handle_id(e)}
                                className="form-control"
                                // value={data._id}
                                onKeyDown={handleEnter}
                                autoFocus
                            />
                        </div>
                    </Form.Field>

                    <Form.Group inline>
                        <Form.Field>
                            <label className="col-md-4 control-label" htmlFor="name">
                                Nome
                </label>
                            <div className="col-md-4">
                                <Input
                                    name="name"
                                    placeholder="Nome"
                                    className="form-control"
                                    onChange={e => handleName(e)}
                                    value={data.name}
                                    onKeyDown={handleEnter}
                                />
                            </div>
                        </Form.Field>
                        <Form.Field>
                            <label className="col-md-4 control-label" htmlFor="type">
                                Manutenção?</label>
                            <Checkbox name="type" toggle checked={data.type === 1}
                                onChange={e => handleType(e)}
                            />
                        </Form.Field>
                    </Form.Group>
                    {data.type === 1 && (
                        <Form.Group inline>
                            <Form.Field>
                                <label className="col-md-4 control-label" htmlFor="duration">
                                    Duração em dias</label>
                                <div className="col-md-4">
                                    <Input
                                        name="duracao"
                                        placeholder="Nome"
                                        className="form-control"
                                        onChange={e => handleDuration(e)}
                                        value={data.duration}
                                        onKeyDown={handleEnter}
                                        type="number" />
                                </div>
                            </Form.Field>
                        </Form.Group>
                    )}
                    <Form.Field>
                        <label className="col-md-4 control-label" >
                            Preço
                </label>
                        <div className="col-md-4">
                            <Input
                                name="price"
                                placeholder="Preço"
                                className="form-control"
                                onChange={e => handlePrice(e)}
                                value={data.price}
                                //type="number"
                                //step="any"
                                //min="0"
                                onKeyDown={handleEnter}
                            />
                        </div>
                    </Form.Field>
                    <Form.Field>
                        <Form.Field disabled={data.type === 1}>
                            <label className="col-md-4 control-label">
                                Quantidade em estoque
                </label>
                            <div className="col-md-4">
                                <Input

                                    min="0"
                                    type="number"
                                    name="quantity_on_hand"
                                    placeholder="Quantidade em Estoque"
                                    onChange={e => handleQuantity(e)}
                                    value={data.quantity}
                                    className="form-control"
                                    onKeyDown={handleEnter}
                                />
                            </div>
                            <div>
                                <div className="col-md-4" style={{ display: 'inline-block', width: '50%' }}>
                                    <label className="col-md-4 control-label" >
                                        Preço em quantidade
                </label>
                                    <Input
                                        disabled={data.type === 1}
                                        //name="price"
                                        placeholder="Preço em quantidade"
                                        className="form-control"
                                        onChange={e => handlePrecoQTDfabrica(e)}
                                        //value={data.precofabrica}
                                        //type="number"
                                        step="any"
                                        // min="0"
                                        onKeyDown={handleEnter}
                                    />
                                </div>

                                <div className="col-md-4" style={{ display: 'inline-block', width: '50%' }}>
                                    <label className="col-md-4 control-label" >
                                        Preço de Fábrica
                </label>
                                    <Input
                                        disabled={data.type === 1}
                                        //name="price"
                                        placeholder="Preço"
                                        className="form-control"
                                        onChange={e => handlePrecofabrica(e)}
                                        value={data.precofabrica}
                                        //type="number"
                                        step="any"
                                        // min="0"
                                        onKeyDown={handleEnter}
                                    />
                                </div>

                            </div>
                        </Form.Field>

                    </Form.Field>
                    <Form.Field disabled={data.type === 1}>
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
                                onChange={e => handleFornecedor(e)}
                                value={data.fornecedor}
                                className="form-control"
                                onKeyDown={handleEnter}
                            />
                        </div>
                    </Form.Field>

                    <br /> <br /> <br />
                </Form>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => {
                    setState(prevState => ({
                        ...prevState,
                        productFormModal: false
                    }));
                    setInventory(false);
                }
                }>
                    Fechar
            </Button>
                <Button onClick={() => handleNewProduct()} positive>Salvar</Button>
            </Modal.Actions>
        </Modal>

    );
}