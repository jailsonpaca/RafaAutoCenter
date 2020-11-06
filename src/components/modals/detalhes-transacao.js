import React from "react";
import { Modal, Button, Table } from "semantic-ui-react";
import axios from "axios";
import { HOST } from '../global.js'
import TransactionDetail from "../TransactionDetail";

export default function DetalhesTransacao({ open, subtract, getsoma, soma, verify, parc, setState, cliente, data }) {

    var { date, estado, devendo, total, items, totalPago, troco, cartao, desconto, garantia, info, _id, onDelete } = data;

    var troca = async (id) => {
        var k = 0;
        delet();
        for (var i = 0; i < items.length; i++) {
            if (items[i].id !== 111) {
                k = 0;


                while (k < items[i].quantity) {

                    await axios.put(HOST + `/api/inventory/product/increment/` + items[i].id)
                        .then(response => { return true; }).catch(err => { console.log(err); return false; });
                    k++;
                }
            }
        }

    }

    var renderItemDetails = items => {
        if (items) {
            return items.map((item, i) => <TransactionDetail onTroca={troca} key={i} {...item} />);
        }
    };

    function delet() {
        var dTransaction = {
            _id: _id
        };
        setState(prevState => ({ ...prevState, transactionModal: false }));
        onDelete(dTransaction);

    }

    var getTotal = items => {
        var sum = 0;

        if (items) {
            for (var i = 0; i < items.length; i++) {
                if (items[i].price) {

                    sum += parseFloat(items[i].price) * items[i].quantity;

                }
            }
        }
        return sum.toFixed(2);
    }

    return (
        <Modal open={open} >
            <Modal.Header>
                Detalhes da Transação
          </Modal.Header>
            <Modal.Content>
                <div className="panel panel-primary">
                    <div className="panel-heading text-center lead">{date}</div>

                    {cartao ? (<Table className="receipt table table-hover">
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
                                <Table.Cell> R$ {soma(total, desconto)} </Table.Cell>
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
                                <Table.Cell> R$ {subtract(getTotal(items), getsoma(items))} </Table.Cell>
                            </Table.Row>
                            <Table.Row className="lead">
                                <Table.Cell />
                                <Table.Cell>Garantia:</Table.Cell>
                                <Table.Cell> {garantia}  </Table.Cell>
                            </Table.Row>
                            <Table.Row className="lead">
                                <Table.Cell />
                                <Table.Cell>Cliente:</Table.Cell>
                                <Table.Cell> {cliente} </Table.Cell>
                            </Table.Row>
                            <Table.Row className="lead">
                                <Table.Cell />
                                <Table.Cell>Informações:</Table.Cell>
                                <Table.Cell> {info} </Table.Cell>
                            </Table.Row>
                        </Table.Body>
                    </Table>) : (
                            <div>
                                {estado === 0 ? (
                                    <Table className="receipt table table-hover">
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
                                                <Table.Cell> R$ {soma(total, desconto)} </Table.Cell>
                                            </Table.Row>
                                            <Table.Row>
                                                <Table.Cell />
                                                <Table.Cell>Pago</Table.Cell>
                                                <Table.Cell> R$ {totalPago} </Table.Cell>
                                            </Table.Row>
                                            <Table.Row negative>
                                                <Table.Cell />
                                                <Table.Cell>Desconto</Table.Cell>
                                                <Table.Cell> R$ {desconto} </Table.Cell>
                                            </Table.Row>
                                            {/*<Table.Row className="lead">
                    <Table.Cell />
                    <Table.Cell>Troco</Table.Cell>
                    <Table.Cell> R$ {troco} </Table.Cell>
                  </Table.Row>*/}
                                            <Table.Row className="lead" positive>
                                                <Table.Cell />
                                                <Table.Cell>Devendo:</Table.Cell>
                                                <Table.Cell> R$ {devendo} </Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="lead" positive>
                                                <Table.Cell />
                                                <Table.Cell>Lucro:</Table.Cell>
                                                <Table.Cell> R$ {subtract(getTotal(items), getsoma(items))} </Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="lead">
                                                <Table.Cell />
                                                <Table.Cell>Garantia:</Table.Cell>
                                                <Table.Cell> {garantia} </Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="lead">
                                                <Table.Cell />
                                                <Table.Cell>Cliente:</Table.Cell>
                                                <Table.Cell> {cliente} </Table.Cell>
                                            </Table.Row>
                                            <Table.Row className="lead">
                                                <Table.Cell />
                                                <Table.Cell>Informações:</Table.Cell>
                                                <Table.Cell> {info} </Table.Cell>
                                            </Table.Row>
                                        </Table.Body>
                                    </Table>
                                ) : (
                                        <Table className="receipt table table-hover">
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
                                                    <Table.Cell> R$ {soma(total, desconto)} </Table.Cell>
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
                                                    <Table.Cell> R$ {subtract(getTotal(items), getsoma(items))} </Table.Cell>
                                                </Table.Row>
                                                <Table.Row className="lead">
                                                    <Table.Cell />
                                                    <Table.Cell>Garantia:</Table.Cell>
                                                    <Table.Cell> {garantia} </Table.Cell>
                                                </Table.Row>
                                                <Table.Row className="lead">
                                                    <Table.Cell />
                                                    <Table.Cell>Cliente:</Table.Cell>
                                                    <Table.Cell> {cliente} </Table.Cell>
                                                </Table.Row>
                                                <Table.Row className="lead">
                                                    <Table.Cell />
                                                    <Table.Cell>Informações:</Table.Cell>
                                                    <Table.Cell> {info} </Table.Cell>
                                                </Table.Row>
                                            </Table.Body>
                                        </Table>
                                    )}
                            </div>
                        )}

                </div>
            </Modal.Content>
            <Modal.Actions>
                <Button onClick={() => setState(prevState => ({ ...prevState, pagarModal: true }))} positive>
                    Pagar
            </Button>
                <Button onClick={() => delet()} negative>
                    Excluir
            </Button>

                <Button onClick={() => setState(prevState => ({ ...prevState, transactionModal: false }))}>
                    Fechar
            </Button>
            </Modal.Actions>
        </Modal>

    )
}