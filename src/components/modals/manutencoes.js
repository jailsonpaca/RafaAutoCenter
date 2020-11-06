import React, { useState, useEffect } from "react";
import { Modal, Button, Table } from "semantic-ui-react";
import history from '../../history';
import { HOST } from '../global.js'
import axios from "axios";

export default function Maintenance({ open, handleModal }) {

    const [maintenances, setMaintenances] = useState([]);

    useEffect(() => {
        let isSubscribed = true;
        async function loadMaintenances() {
            var url = HOST + `/api/manutencao`;
            const response = await axios.get(url);
            const NewRes = response.data;
            if (isSubscribed) {
                setMaintenances(NewRes);
            }
        }
        loadMaintenances();
        return () => isSubscribed = false;
    }, []);

    function openWhatsApp(phone, service, car) {
        if (phone) {
            let message = `https://api.whatsapp.com/send?phone=55${phone}&text=Ol%C3%A1%2C%20j%C3%A1%20faz%20um%20tempo%20desde%20da%20%C3%BAltima%20${service}%20do%20seu%20${car}%20aqui%20no%20RAFA%20AUTO%20CENTER%2C%20gostaria%20de%20agendar%20uma%20manuten%C3%A7%C3%A3o%3F`
            require('electron').shell.openExternal(message);
        }
    }

    return (
        <Modal open={open} onClose={() => handleModal(false)}>
            <Modal.Header>
                Manutenções
          </Modal.Header>
            <Modal.Content>
                <Table celled striped size="small" columns="4">
                    <Table.Header>
                        <Table.Row>
                            <Table.HeaderCell>Tipo</Table.HeaderCell>
                            <Table.HeaderCell>Data</Table.HeaderCell>
                            <Table.HeaderCell>KM</Table.HeaderCell>
                            <Table.HeaderCell>Cliente</Table.HeaderCell>
                            <Table.HeaderCell>WhatsApp</Table.HeaderCell>
                        </Table.Row>
                    </Table.Header>
                    <Table.Body>
                        {maintenances.map((e, i) => (
                            <Table.Row key={i}>
                                <Table.Cell width="4"> {e.product.name}</Table.Cell>
                                <Table.Cell width="4"> {e.date}</Table.Cell>
                                <Table.Cell width="1"> {e.carro ? (e.carro.text) : ''}/<br />{e.carro ? (e.carro.value) : ''} </Table.Cell>
                                <Table.Cell width="1"
                                    onClick={() => {
                                        if (e.clienteName && e.clienteName !== '') {
                                            history.push('/clientes', { data: e.clienteName })
                                        }
                                    }} style={{ textDecoration: 'underline', color: 'blue', cursor: 'pointer' }}>
                                    {e.clienteName}</Table.Cell>
                                <Table.Cell width="1">
                                    <Button id="BtnWhats" onClick={() =>
                                        openWhatsApp(e.clientePhone, e.product.name, e.carro ? (e.carro.text) : 'veículo')}
                                        color='green'>Enviar Mensagem</Button>
                                </Table.Cell>
                            </Table.Row>
                        ))}
                    </Table.Body>
                </Table>
            </Modal.Content>
        </Modal>
    );
}