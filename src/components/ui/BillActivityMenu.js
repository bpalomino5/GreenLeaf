import React, { Component } from "react";
import { Card, Modal, Form, Dropdown, Button } from "semantic-ui-react";
import { db } from "../../firebase";
const options = [{ key: 1, text: "Add Bill", value: 1 }];

const AddBillModal = ({
  addModalOpen,
  handleClose,
  handleFormSubmit,
  handleFormChange,
  cName,
  mPayment
}) => {
  return (
    <Modal
      style={{ height: "auto" }}
      open={addModalOpen}
      onClose={handleClose}
      dimmer="blurring"
      size="mini"
      centered
    >
      <Modal.Header>Add Bill</Modal.Header>
      <Modal.Content>
        <Form onSubmit={handleFormSubmit}>
          <Form.Group>
            <Form.Input
              label="Company Name"
              placeholder="Name"
              value={cName}
              name="cName"
              onChange={handleFormChange}
              width={6}
            />
            <Form.Input
              label="Monthly Payment"
              placeholder="Value"
              value={mPayment}
              width={6}
              name="mPayment"
              onChange={handleFormChange}
            />
          </Form.Group>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Submit" onClick={handleFormSubmit} />
      </Modal.Actions>
    </Modal>
  );
};

export default class BillActivityMenu extends Component {
  state = { addModalOpen: false, cName: "", mPayment: "" };

  handleFormChange = (e, { name, value }) => this.setState({ [name]: value });
  handleFormSubmit = () => {
    const { cName, mPayment } = this.state;
    db.addBill(cName, mPayment);
    this.setState({ cName: "", mPayment: "" });
    this.handleClose();
  };
  handleChange = (e, { value }) => {
    if (value === 1) this.setState({ addModalOpen: true });
  };

  handleClose = () => this.setState({ addModalOpen: false });

  render() {
    const { addModalOpen, cName, mPayment } = this.state;
    return (
      <Card raised fluid>
        <Card.Content>
          <Card.Header>Bill Activity</Card.Header>
        </Card.Content>
        <Card.Content>
          <Dropdown
            value={0}
            text="Options"
            selectOnBlur={false}
            onChange={this.handleChange}
            options={options}
          />
          <AddBillModal
            addModalOpen={addModalOpen}
            handleClose={this.handleClose}
            handleFormSubmit={this.handleFormSubmit}
            handleFormChange={this.handleFormChange}
            cName={cName}
            mPayment={mPayment}
          />
        </Card.Content>
      </Card>
    );
  }
}
