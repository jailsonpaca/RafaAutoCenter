import React from "react";
import { Modal, Button, Form, Input } from "semantic-ui-react";

export default function ModalEditProduct({ open, data, setState, handleProduct }) {

    function handle_id(e) {

        e.persist();
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            new_id: e.target.value
        }));

    };


    function handleName(e) {

        e.persist();
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            newName: e.target.value
        }));
    };

    function handlePrice(e) {
        e.persist();
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            newPrice: e.target.value
        }));
    };
    function handleQuantity(e) {
        e.persist();
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            newQuantity: e.target.value
        }));
    };
    function handlePrecofabrica(e) {
        e.persist();
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            newPrecofabrica: e.target.value
        }));
    };
    function handleFornecedor(e) {
        e.persist();
        e.preventDefault();
        setState(prevState => ({
            ...prevState,
            newFornecedor: e.target.value
        }));
    };

    function handleEnter(event) {
        if (event.keyCode === 13) {
            const form = event.target.form;
            const index = Array.prototype.indexOf.call(form, event.target);
            form.elements[index + 1].focus();
            event.preventDefault();
        }
    }



    const {
        newName,
        newPrice,
        newQuantity,
        newPrecofabrica,
        new_id,
        newFornecedor
    } = data;

    return (
        <Modal open={open}>
            <Modal.Header>
                Editar Produto
          </Modal.Header>
            <Modal.Content><Form name="newProductForm">
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
                            onChange={e => handleName(e)}
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
                            onChange={e => handlePrice(e)}
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
                            onChange={e => handlePrecofabrica(e)}
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
                            onChange={e => handleQuantity(e)}
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
                            onChange={e => handleFornecedor(e)}
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
                <Button onClick={() => setState(prevState => ({
                    ...prevState, productModal: false
                }))}>
                    Fechar
            </Button>
                <Button onClick={() => handleProduct()}>Atualizar</Button>
            </Modal.Actions>
        </Modal>
    )
}