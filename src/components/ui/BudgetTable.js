import React, { Component } from "react";
import { Table, Button, Icon, Modal, Form } from "semantic-ui-react";
import { db } from "../../firebase";

const formatCurrency = (amount, currency = "USD", locale = "en-us") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

const DetailModal = ({
  billItem,
  handleClose,
  handleFormChange,
  handleFormSubmit,
  detailModalOpen
}) => {
  return (
    <Modal
      style={{ height: "auto" }}
      open={detailModalOpen}
      onClose={handleClose}
      dimmer="blurring"
      size="mini"
      centered
    >
      <Modal.Header>Bill Details</Modal.Header>
      <Modal.Content>
        <Form>
          {billItem && (
            <Form.Group>
              <Form.Input
                label="Company Name"
                placeholder="Name"
                value={billItem.name}
                onChange={handleFormChange}
                name="name"
                width={10}
              />
              <Form.Input
                label="Monthly Payment"
                placeholder="Value"
                name="mPayment"
                value={billItem.mPayment}
                width={6}
                onChange={handleFormChange}
              />
            </Form.Group>
          )}
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button content="Close" onClick={handleClose} />
        <Button content="Submit" onClick={handleFormSubmit} />
      </Modal.Actions>
    </Modal>
  );
};

const TableItem = ({
  openDetails,
  toggleStatus,
  companyName,
  status,
  monthlyPayment
}) => {
  return (
    <Table.Row positive={status}>
      <Table.Cell selectable style={{ paddingLeft: 10 }} onClick={openDetails}>
        <h4>{companyName}</h4>
      </Table.Cell>
      <Table.Cell
        collapsing
        negative={!status}
        textAlign="center"
        selectable
        onClick={toggleStatus}
      >
        {status ? <Icon name="checkmark" /> : <Icon name="close" />}
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        {formatCurrency(monthlyPayment)}
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <Button content="Pay" />
      </Table.Cell>
    </Table.Row>
  );
};

export default class BudgetTable extends Component {
  state = {
    detailModalOpen: false,
    index: 0,
    billItem: null
  };

  toggleStatus = i => {
    const { bills } = this.props;
    bills[i].isPayed = !bills[i].isPayed;
    this.setState({ bills });
  };

  openDetails = i => {
    const { bills } = this.props;
    this.setState({ detailModalOpen: true, index: i, billItem: bills[i] });
  };

  handleClose = () => this.setState({ detailModalOpen: false });

  handleFormChange = (e, { name, value }) =>
    this.setState(prevState => ({
      billItem: { ...prevState.billItem, [name]: value }
    }));

  handleFormSubmit = async () => {
    const { bills } = this.props;
    const { index, billItem } = this.state;
    bills[index] = billItem;
    await db.editBill(bills[index].ref, billItem);
    this.handleClose();
  };

  render() {
    const { detailModalOpen, billItem } = this.state;
    const { bills } = this.props;
    return (
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>Bill</Table.HeaderCell>
            <Table.HeaderCell>Status</Table.HeaderCell>
            <Table.HeaderCell>Monthly Payment</Table.HeaderCell>
            <Table.HeaderCell>Make Payment</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>
          {bills.map((item, i) => (
            <TableItem
              openDetails={() => this.openDetails(i)}
              toggleStatus={() => this.toggleStatus(i)}
              companyName={item.name}
              status={item.isPayed}
              monthlyPayment={item.mPayment}
            />
          ))}
        </Table.Body>
        <DetailModal
          detailModalOpen={detailModalOpen}
          billItem={billItem}
          handleClose={this.handleClose}
          handleFormChange={this.handleFormChange}
          handleFormSubmit={this.handleFormSubmit}
        />
        {/* <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <Button floated="right" content="Update" />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer> */}
      </Table>
    );
  }
}
