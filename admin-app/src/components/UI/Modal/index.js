import React from "react";
//import { Modal, Button, Form } from "react-bootstrap";
import { Modal} from "antd"
/**
 * @author
 * @function Modal
 **/

const NewModal = (props) => {
  return (
    //   <Modal size={props.size} show={props.show} onHide={props.handleClose}>
    //     <Modal.Header closeButton>
    //       <Modal.Title>{props.modalTitle}</Modal.Title>
    //     </Modal.Header>
    //     <Modal.Body>{props.children}</Modal.Body>
    //     <Modal.Footer>
    //       <Button variant="primary" onClick={props.handleClose}>
    //         Save Changes
    //       </Button>
    //     </Modal.Footer>
    //   </Modal>
    <Modal
      title={props.title}
      centered
      visible={props.visible}
      width={props.size}
      onCancel={props.cancel}
      onOk={props.ok}
    >
      {props.children}
    </Modal>
  );
};

export default NewModal;
