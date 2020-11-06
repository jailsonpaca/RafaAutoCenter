import { atom } from 'recoil';

export const statePos = atom({
    key: 'statePos', // unique ID (with respect to other atoms/selectors)
    default: {
        quantity: 1,
        id: 0,
        receiptModal: false,
        addItemModal: false,
        checkOutModal: false,
        amountDueModal: false,
        cartaoModal: false,
        garantia: "NÃO POSSUI",
        name: "",
        price: 0,
        type: 0,
        carro: 0,
        publicInfo: false,
        clienteOpen: false
    }, // default value (aka initial value)
});

export const pagPos = atom({
    key: 'pagPos', // unique ID (with respect to other atoms/selectors)
    default: {
        totalPayment: 0,
        total: 0,
        desconto: 0,
        cartao: false,
        changeDue: 0
    }, // default value (aka initial value)
});

export const itemsPos = atom({
    key: 'itemsPos', // unique ID (with respect to other atoms/selectors)
    default: [], // default value (aka initial value)
});

export const clientePos = atom({
    key: 'clientePos', // unique ID (with respect to other atoms/selectors)
    default: {}, // default value (aka initial value)
});

export const cartaosPos = atom({
    key: 'cartaosPos', // unique ID (with respect to other atoms/selectors)
    default: {
        isUsed: false,
        debito: true,
        parcela: false,
        num: 0
    }, // default value (aka initial value)
});