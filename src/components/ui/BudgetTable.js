import React, { Component } from "react";
import PaymentModal from "./PaymentModal";
import DetailModal from "./DetailModal";
import { Table, Button, Icon } from "semantic-ui-react";
import { db } from "../../firebase";

const formatCurrency = (amount, currency = "USD", locale = "en-us") =>
  new Intl.NumberFormat(locale, { style: "currency", currency }).format(amount);

const TableItem = ({
  openDetails,
  toggleStatus,
  companyName,
  status,
  monthlyPayment,
  openPayModal,
  url,
  checkWarning
}) => {
  return (
    <Table.Row positive={status} warning={checkWarning && !status}>
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
        <Button
          as="a"
          content="Pay"
          href={url}
          disabled={url === ""}
          target="_blank"
        />
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
    confirmOpen: false,
    date: 0
  };

  componentDidMount = () => {
    let date = new Date().getDate();
    this.setState({ date });
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
      confirmOpen,
      date
    } = this.state;
    const { bills } = this.props;
    return (
      <Table celled unstackable>
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
              key={item.name}
              openDetails={() => this.openDetailModal(i)}
              toggleStatus={() => this.toggleStatus(i)}
              openPayModal={() => this.openPayModal(i)}
              companyName={item.name}
              status={item.isPayed}
              monthlyPayment={item.mPayment}
              url={item.url}
              checkWarning={date >= item.due - 3}
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
