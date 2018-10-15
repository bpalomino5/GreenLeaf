import React, { Component } from "react";
import { Modal, Form, Button, Confirm, Dropdown } from "semantic-ui-react";

const days = Array.from({ length: 31 }, (v, i) => ({
  key: i + 1,
  text: i + 1 + "",
  value: i + 1
}));

const types = [
  { key: 1, text: "Auto", value: 1 },
  { key: 2, text: "Manual", value: 2 }
];

export default class DetailModal extends Component {
  render() {
    const {
      canSubmit,
      onSubmit,
      billItem,
      onClose,
      onChangeInput,
      detailModalOpen,
      onDropdownChange,
      onConfirmRemove,
      confirmCancel,
      confirmOpen,
      onConfirmOpen
    } = this.props;
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
                  icon="dollar"
                  iconPosition="left"
                  label="Monthly Payment"
                  placeholder="Value"
                  name="mPayment"
                  value={billItem.mPayment}
                  onChange={onChangeInput}
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
          {canSubmit ? (
            <div>
              <Button content="Close" onClick={onClose} />
              <Button content="Submit" onClick={onSubmit} />
            </div>
          ) : (
            <div>
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
            </div>
          )}
        </Modal.Actions>
      </Modal>
    );
  }
}
