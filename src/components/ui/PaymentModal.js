import React, { Component } from "react";
import { Modal, Form, Button } from "semantic-ui-react";

export default class PaymentModal extends Component {
  render() {
    const { modalOpen, onClose, billItem, onChangeInput } = this.props;
    return (
      <Modal
        style={{ height: "auto", width: "25vw" }}
        open={modalOpen}
        onClose={onClose}
        dimmer="blurring"
        centered
      >
        <Modal.Header>Payment Details</Modal.Header>
        <Modal.Content>
          <Form>
            {billItem && (
              <Form.Group>
                <Form.Input
                  icon="dollar"
                  iconPosition="left"
                  label="Amount Payed"
                  placeholder="Amount"
                  value={billItem.amountPayed}
                  onChange={onChangeInput}
                  name="amountPayed"
                  width={10}
                />
              </Form.Group>
            )}
          </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button content="Close" onClick={onClose} />
        </Modal.Actions>
      </Modal>
    );
  }
}
