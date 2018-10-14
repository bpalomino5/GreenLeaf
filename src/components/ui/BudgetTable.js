import React, { Component } from "react";
import { Table, Button, Icon, Modal, Form } from "semantic-ui-react";
import { db } from "../../firebase";

const formatCurrency = (amount, currency = "USD", locale = "en-us") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

const DetailModal = ({ billItem, onClose, onChangeInput, detailModalOpen }) => {
  return (
    <Modal
      style={{ height: "auto" }}
      open={detailModalOpen}
      onClose={onClose}
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
                onChange={onChangeInput}
                name="name"
                width={10}
              />
              <Form.Input
                readOnly
                icon="dollar"
                iconPosition="left"
                label="Monthly Payment"
                placeholder="Value"
                name="mPayment"
                value={billItem.mPayment}
                width={6}
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
};

const PaymentModal = ({ modalOpen, onClose, billItem, onChangeInput }) => {
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
};

const TableItem = ({
  openDetails,
  toggleStatus,
  companyName,
  status,
  monthlyPayment,
  openPayModal
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
      <Table.Cell
        selectable
        collapsing
        textAlign="center"
        onClick={openPayModal}
      >
        <h4>{formatCurrency(monthlyPayment)}</h4>
      </Table.Cell>
      <Table.Cell collapsing textAlign="center">
        <Button content="Pay" />
      </Table.Cell>
    </Table.Row>
  );
};

export default class BudgetTable extends Component {
  state = {
    paymentModalOpen: false,
    detailModalOpen: false,
    index: 0,
    billItem: null,
    canUpdate: false
  };

  toggleStatus = async i => {
    const { bills } = this.props;
    bills[i].isPayed = !bills[i].isPayed;
    this.setState({ bills, canUpdate: true });
  };

  openDetailModal = i => {
    const { bills } = this.props;
    this.setState({ detailModalOpen: true, index: i, billItem: bills[i] });
  };

  closeDetailModal = () => {
    const { bills } = this.props;
    const { index, billItem } = this.state;
    bills[index] = billItem;
    this.setState({ detailModalOpen: false });
  };

  formChangeInput = (e, { name, value }) => {
    this.setState(prevState => ({
      billItem: { ...prevState.billItem, [name]: value },
      canUpdate: true
    }));
  };

  openPayModal = i => {
    const { bills } = this.props;
    this.setState({ index: i, billItem: bills[i], paymentModalOpen: true });
  };

  closePayModal = () => {
    const { bills } = this.props;
    const { index, billItem } = this.state;
    bills[index] = billItem;
    this.setState({ paymentModalOpen: false });
  };

  updateBills = async () => {
    const { bills } = this.props;
    const { index } = this.state;
    this.setState({ canUpdate: false });
    await db.updateMasterBill(bills, index);
    await db.updateCurrentBills(bills);
  };

  render() {
    const {
      paymentModalOpen,
      detailModalOpen,
      billItem,
      canUpdate
    } = this.state;
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
              openDetails={() => this.openDetailModal(i)}
              toggleStatus={() => this.toggleStatus(i)}
              openPayModal={() => this.openPayModal(i)}
              companyName={item.name}
              status={item.isPayed}
              monthlyPayment={item.mPayment}
            />
          ))}
        </Table.Body>
        <DetailModal
          detailModalOpen={detailModalOpen}
          billItem={billItem}
          onClose={this.closeDetailModal}
          onChangeInput={this.formChangeInput}
        />
        <PaymentModal
          billItem={billItem}
          modalOpen={paymentModalOpen}
          onClose={this.closePayModal}
          onChangeInput={this.formChangeInput}
        />
        <Table.Footer fullWidth>
          <Table.Row>
            <Table.HeaderCell colSpan="4">
              <Button
                floated="right"
                content="Update"
                disabled={!canUpdate}
                onClick={this.updateBills}
              />
            </Table.HeaderCell>
          </Table.Row>
        </Table.Footer>
      </Table>
    );
  }
}
