import React from "react";
import { Modal, ModalVariant, Button } from "@patternfly/react-core";

class SmallModal extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isModalOpen: true,
    };
    this.handleModalClose = () => {
      //   this.setState({
      //     isModalOpen: false,
      //   });
      this.props.onClose && this.props.onClose();
    };
    this.handleModalConfirm = () => {
      this.props.onConfirm && this.props.onConfirm();
    };
  }

  render() {
    const { isModalOpen } = this.state;
    const { title, content } = this.props;

    return (
      <Modal
        variant={ModalVariant.small}
        title={title || "Task complete"}
        isOpen={isModalOpen}
        onClose={this.handleModalClose}
        disableFocusTrap
        actions={[
          <Button
            key="confirm"
            variant={this.props.confirmPrimary ? "primary" : "link"}
            onClick={this.handleModalConfirm}
          >
            Confirm
          </Button>,
          <Button
            key="cancel"
            variant={this.props.confirmPrimary ? "link" : "primary"}
            onClick={this.handleModalClose}
          >
            Cancel
          </Button>,
        ]}
      >
        {content || (
          <span>
            You have completed the task and can close it now. Do you wish to
            return to the solution pattern?
          </span>
        )}
      </Modal>
    );
  }
}

export const CompleteTaskModal = (props) => (
  <SmallModal confirmPrimary {...props} />
);
export const IncompleteTaskModal = (props) => (
  <SmallModal
    title="Are you sure?"
    content="You are about to close the task window. You have not yet completed the task. Are you sure you wish to exit?"
    {...props}
  />
);

export { SmallModal };
