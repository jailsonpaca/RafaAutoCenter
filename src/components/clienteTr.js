import React, {useState } from "react";
import Cliente from "./cliente";
import { Modal, Button,Icon,Table,Input, Form } from "semantic-ui-react";

export default function ClienteTr(props){
  
  const [state,setState]=useState({clientModal: false,
                                   client:{ _id:props._id,
                                            isAdd:false,
                                            nomeCliente: props.nomeCliente,
                                            date:props.date,
                                            telefone:props.telefone,
                                            cpf:props.cpf,
                                            /*sexo:props.sexo,
                                            estado:props.estado,
                                            cidade:props.cidade,
                                            bairro:props.bairro,
                                            cep:props.cep,
                                            rua:props.rua,
                                            numeroEndereco:props.numeroEndereco,
                                            apartamento:props.apartamento,
                                            nomeApartamento:props.nomeApartamento,
                                            numeroApartamento:props.numeroApartamento,
                                            carros:props.carros*/
                                   } 
                                });                           


     function delet(){
      
      props.onDelete(props._id);
     
    }
    const {
      nomeCliente,
      telefone,
      cpf,
      date,
      _id,
    } = state.client;

   

    return (
        <Table.Row>
        
        <Table.Cell width="4">{nomeCliente}</Table.Cell>
        <Table.Cell width="2">{cpf}</Table.Cell>
        <Table.Cell width="1">{telefone}</Table.Cell>
        <Table.Cell width="1">{date}</Table.Cell>
        <Table.Cell width="1">
          <Button
            icon
            onClick={() => setState(prevState=>({
              ...prevState, 
              clientModal: true }))}
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
        <Modal open={state.clientModal} closeIcon>
          <Modal.Header>
            Ver/Editar Cliente
          </Modal.Header>
          <Modal.Content>
          <Cliente {...state.client}/>
          </Modal.Content>
          {/*<Modal.Actions>
            <Button onClick={() => setState(prevState=>({
              ...prevState,  clientModal: false }))}>
              Fechar
            </Button>
            
          </Modal.Actions>*/}
        </Modal></Table.Row>
    );
}

