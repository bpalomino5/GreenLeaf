import React, { Component } from "react";
import { Card, Dropdown } from "semantic-ui-react";
import DetailModal from "./DetailModal";
import { db } from "../../firebase";

const options = [{ key: 1, text: "Add Bill", value: 1 }];

const years = Array.from({ length: 10 }, (v, i) => ({
  key: i + 2018,
  text: i + 2018 + "",
  value: i + 2018 + ""
}));

const months = [
  { key: "jan", text: "January", value: "January" },
  { key: "feb", text: "February", value: "February" },
  { key: "mar", text: "March", value: "March" },
  { key: "apr", text: "April", value: "April" },
  { key: "may", text: "May", value: "May" },
  { key: "jun", text: "June", value: "June" },
  { key: "jul", text: "July", value: "July" },
  { key: "aug", text: "August", value: "August" },
  { key: "sep", text: "September", value: "September" },
  { key: "oct", text: "October", value: "October" },
  { key: "nov", text: "November", value: "November" },
  { key: "dec", text: "December", value: "December" }
];

export default class BillActivityMenu extends Component {
  state = {
    billItem: {
      name: "",
      mPayment: "0",
      due: 0,
      notes: "",
      username: "",
      password: "",
      paymentType: 0,
      url: ""
    },
    addModalOpen: false
  };

  onDropdownChange = (name, value) => {
    this.setState(prevState => ({
      billItem: { ...prevState.billItem, [name]: value }
    }));
  };

  formChangeInput = (e, { name, value }) => {
    this.setState(prevState => ({
      billItem: { ...prevState.billItem, [name]: value }
    }));
  };

  formSubmit = async () => {
    const { billItem } = this.state;
    const { year, month } = this.props;

    await db.addBill(billItem, year, month);
    this.setState({
      billItem: {
        name: "",
        mPayment: "0",
        due: 0,
        notes: "",
        username: "",
        password: "",
        paymentType: 0,
        url: ""
      }
    });

    this.props.addedBill();
    this.handleClose();
  };

  handleChange = (e, { value }) => {
    if (value === 1) this.setState({ addModalOpen: true });
  };

  handleClose = () => this.setState({ addModalOpen: false });

  render() {
    const { year, month } = this.props;
    const { addModalOpen, billItem } = this.state;
    return (
      <Card raised fluid>
        <Card.Content>
          <Card.Header>Bill Activity</Card.Header>
        </Card.Content>
        <Card.Content>
          <div
            style={{
              display: "flex",
              flex: 1,
              justifyContent: "space-between"
            }}
          >
            <div>
              <Dropdown
                selectOnNavigation={false}
                style={{ marginRight: 5 }}
                compact
                wrapSelection
                placeholder="Year"
                selection
                value={year}
                selectOnBlur={false}
                options={years}
                onChange={this.props.changeYear}
              />
              <Dropdown
                selectOnNavigation={false}
                compact
                wrapSelection
                placeholder="Month"
                selection
                value={month}
                selectOnBlur={false}
                options={months}
                onChange={this.props.changeMonth}
              />
            </div>
            <Dropdown
              compact
              selection
              value={0}
              text="Options"
              selectOnBlur={false}
              onChange={this.handleChange}
              options={options}
            />
          </div>
          <DetailModal
            canSubmit
            detailModalOpen={addModalOpen}
            onClose={this.handleClose}
            onSubmit={this.formSubmit}
            onChangeInput={this.formChangeInput}
            billItem={billItem}
            onDropdownChange={(n, v) => this.onDropdownChange(n, v)}
          />
        </Card.Content>
      </Card>
    );
  }
}
