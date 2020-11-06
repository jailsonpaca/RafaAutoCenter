import React from "react";
import { Modal, Button, Label } from "semantic-ui-react";
import recibo1 from '../recibos/recibo1';
import recibo2 from '../recibos/recibo2';
import logo from '../../assets/logo.png';

export default function ModalRecibo({ open, setState, setItems, setPag, setCartao, setSuf,
    handleMessage, items, data, pag, cartaos }) {

    var verify = (parcelas) => {
        if (parcelas === 0) { return "Débito" }
        else { return parcelas + " Vezes" }
    }

    return (
        <Modal open={open} closeIcon
            onClose={() => {

                setItems([]);
                setPag({
                    totalPayment: 0,
                    total: 0,
                    desconto: 0,
                    cartao: false,
                    changeDue: 0
                });
                setState({
                    quantity: 1,
                    id: 0,
                    receiptModal: false,
                    addItemModal: false,
                    checkOutModal: false,
                    amountDueModal: false,
                    cartaoModal: false,
                    garantia: "NÃO POSSUI",
                    name: "",
                    price: 0
                });
                setCartao({
                    isUsed: false,
                    debito: true,
                    parcela: false,
                    num: 0
                });
                setSuf(false);
            }}>
            <Modal.Header >
                Recibo
          </Modal.Header>
            <Modal.Content>
                <Button id="useCupom" onClick={async () => {
                    if (await recibo1(logo, items, data, pag, cartaos)) {

                    } else {
                        handleMessage("Algo deu errado", false);
                    }
                }} primary>Cupom</Button>

                <Button id="useFolha" onClick={async () => {
                    if (await recibo2(logo, items, data, pag, cartaos)) {

                    } else {
                        handleMessage("Algo deu errado", false);
                    }
                }} primary>Folha</Button>
                {pag.cartao ? (
                    <div>
                        <Label>
                            Total:
              <Label.Detail>R$ {parseFloat(pag.total).toFixed(2)}</Label.Detail>
                        </Label>
                        <Label>
                            Em: {verify(cartaos.num)}
                            <Label.Detail></Label.Detail>
                        </Label>
                    </div>) : (
                        <div>
                            {data.fiado ? (
                                <div>
                                    <Label size="massive">
                                        Total Pago:
                <Label.Detail>{parseFloat(pag.totalPayment, 10).toFixed(2)}</Label.Detail>
                                    </Label>
                                    <Label size="massive">
                                        Devendo:
                <Label.Detail>{parseFloat(pag.total).toFixed(2)}</Label.Detail>
                                    </Label>
                                    {/*<Label size="massive">
                Troco:
                <Label.Detail>{parseFloat(pag.changeDue).toFixed(2)}</Label.Detail>
              </Label>*/}
                                </div>
                            ) : (
                                    <div>
                                        <Label size="massive">
                                            Total:
                <Label.Detail>{parseFloat(pag.totalPayment, 10).toFixed(2)}</Label.Detail>
                                        </Label>
                                        <Label size="massive">
                                            Troco:
                <Label.Detail>{parseFloat(pag.changeDue).toFixed(2)}</Label.Detail>
                                        </Label>
                                    </div>
                                )}
                        </div>
                    )}

            </Modal.Content>
            <Modal.Actions>
                <Button className="ui button" onClick={() => {
                    setItems([]);
                    setPag({
                        totalPayment: 0,
                        total: 0,
                        desconto: 0,
                        cartao: false,
                        changeDue: 0
                    });
                    setState({
                        quantity: 1,
                        id: 0,
                        receiptModal: false,
                        addItemModal: false,
                        checkOutModal: false,
                        amountDueModal: false,
                        cartaoModal: false,
                        garantia: "NÃO POSSUI",
                        name: "",
                        price: 0
                    });
                    setCartao({
                        isUsed: false,
                        debito: true,
                        parcela: false,
                        num: 0
                    });
                    setSuf(false);

                }}>
                    Fechar
            </Button>
            </Modal.Actions>
        </Modal>
    );
}