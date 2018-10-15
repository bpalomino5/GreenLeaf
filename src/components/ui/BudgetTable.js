import React, { Component } from "react";
import {
  Table,
  Button,
  Icon,
  Modal,
  Form,
  Dropdown,
  Confirm
} from "semantic-ui-react";
import { db } from "../../firebase";

const days = Array.from({ length: 31 }, (v, i) => ({
  key: i + 1,
  text: i + 1 + "",
  value: i + 1
}));

const types = [
  { key: 1, text: "Auto", value: 1 },
  { key: 2, text: "Manual", value: 2 }
];

const formatCurrency = (amount, currency = "USD", locale = "en-us") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

const DetailModal = ({
  billItem,
  onClose,
  onChangeInput,
  detailModalOpen,
  onDropdownChange,
  onConfirmRemove,
  confirmCancel,
  confirmOpen,
  onConfirmOpen
}) => {
  return (
    <Modal
      style={{ height: "auto" }}
      open={detailModalOpen}
      onClose={onClose}
      dimmer="blurring"
      size="small"
      centered
    >
      <Modal.Header>Bill Details</Modal.Header>
      <Modal.Content scrolling>
        {billItem && (
          <Form>
            <Form.Group>
              <Form.Input
                label="Company Name"
                placeholder="Name"
                value={billItem.name}
                onChange={onChangeInput}
                name="name"
                width={6}
              />
              <Form.Input
                readOnly
                icon="dollar"
                iconPosition="left"
                label="Monthly Payment"
                placeholder="Value"
                name="mPayment"
                value={billItem.mPayment}
                width={3}
              />
              <Form.Input label="Due On">
                <Dropdown
                  compact
                  value={billItem.due}
                  onChange={(e, { value }) => onDropdownChange("due", value)}
                  selection
                  options={days}
                />
              </Form.Input>
              <Form.Input label="Payment Type">
                <Dropdown
                  compact
                  value={billItem.paymentType}
                  onChange={(e, { value }) =>
                    onDropdownChange("paymentType", value)
                  }
                  selection
                  options={types}
                />
              </Form.Input>
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="URL"
                placeholder="http://..."
                width={10}
                name="url"
                value={billItem.url}
                onChange={onChangeInput}
              />
            </Form.Group>
            <Form.Group>
              <Form.Input
                label="Username"
                placeholder="email/name"
                name="username"
                value={billItem.username}
                onChange={onChangeInput}
              />
              <Form.Input
                label="Password"
                placeholder="password"
                name="password"
                value={billItem.password}
                onChange={onChangeInput}
              />
            </Form.Group>
            <Form.TextArea
              name="notes"
              value={billItem.notes}
              onChange={onChangeInput}
              label="Notes"
              placeholder="Additional Details"
            />
          </Form>
        )}
      </Modal.Content>
      <Modal.Actions>
        <Button color="red" content="Remove" onClick={onConfirmOpen} />
        <Confirm
          open={confirmOpen}
          onCancel={confirmCancel}
          onConfirm={onConfirmRemove}
          size="tiny"
          confirmButton="Yes"
          style={{ height: "auto" }}
        />
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
    canUpdate: false,
    confirmOpen: false
  };

  openConfirm = () => this.setState({ confirmOpen: true });
  closeConfirm = () => this.setState({ confirmOpen: false });

  removeBill = () => {
    const { bills } = this.props;
    const { index } = this.state;
    bills.splice(index, 1);
    this.setState({ detailModalOpen: false, canUpdate: true });
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

  onDropdownChange = (name, value) => {
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
    const { bills, year, month } = this.props;
    this.setState({ canUpdate: false });
    await db.updateMasterBills(bills);
    await db.updateCurrentBills(bills, year, month);
  };

  render() {
    const {
      paymentModalOpen,
      detailModalOpen,
      billItem,
      canUpdate,
      confirmOpen
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
          onConfirmRemove={this.removeBill}
          confirmCancel={this.closeConfirm}
          confirmOpen={confirmOpen}
          onConfirmOpen={this.openConfirm}
          detailModalOpen={detailModalOpen}
          billItem={billItem}
          onClose={this.closeDetailModal}
          onChangeInput={this.formChangeInput}
          onDropdownChange={(n, v) => this.onDropdownChange(n, v)}
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
