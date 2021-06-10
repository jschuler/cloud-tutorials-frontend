import React from "react";
import { Modal, ModalVariant, Button } from "@patternfly/react-core";

export const QuitModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: any; onConfirm: any; }) => (
  <Modal
    variant={ModalVariant.small}
    title="Return to the tutorial"
    isOpen={isOpen}
    onClose={onClose}
    actions={[
      <Button key="confirm" variant="primary" onClick={onConfirm}>
        Confirm
      </Button>,
      <Button key="cancel" variant="link" onClick={onClose}>
        Cancel
      </Button>,
    ]}
  >
    Would you like to return to the tutorial?
  </Modal>
);

export const ExitTutorialModal = ({ isOpen, onClose, onConfirm }: { isOpen: boolean; onClose: any; onConfirm: any; }) => (
  <Modal
    variant={ModalVariant.small}
    title="Do you want to exit out of the tutorial?"
    isOpen={isOpen}
    onClose={onClose}
    actions={[
      <Button key="confirm" variant="primary" onClick={onConfirm}>
        Confirm
      </Button>,
      <Button key="cancel" variant="link" onClick={onClose}>
        Cancel
      </Button>,
    ]}
  >
    You will exit out of the current tutorial and the application will reload.
  </Modal>
);
