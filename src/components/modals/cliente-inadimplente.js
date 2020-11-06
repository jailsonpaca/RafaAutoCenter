import React from "react";
import { Modal, Button,Icon} from "semantic-ui-react";
import Cliente from "../cliente";

export default function ModalClienteInadimplente({ open,setState,ClienteId}) {

  function handleClientClose() {
    setState(prevState => ({
      ...prevState,
      clienteOpen: false
    }))
  }

    return (
      <Modal open={open}
      onClose={() => {
        setState(prevState => ({
          ...prevState,
          clienteOpen: false
        }))
      }}
      trigger={<Button>"O cliente está inadimplente!"<Icon name="external alternate" /></Button>}
      closeIcon>
      <Modal.Header>
        Ver/Editar Cliente
   </Modal.Header>
      <Modal.Content>
        <Cliente _id={ClienteId} closeScreen={handleClientClose} date="" isAdd={false} />
      </Modal.Content>
    </Modal>
    );
}