import React from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Gallery,
  GalleryItem,
  Card,
  CardTitle,
  CardBody,
  CardFooter,
  Button,
  TextList,
  TextListItem,
  Wizard,
  WizardStep,
  Modal,
} from "@patternfly/react-core";
import { QuickStart } from "@cloudmosaic/quickstarts";
import QuickStartMarkdownView from "../quickstarts/components/QuickStartMarkdownView";
import { useHistory } from "react-router-dom";
import "./asciidoctor-skins/adoc-github.css";

declare const QUICKSTARTS_BASE: string;

export type AppModalProps = {
  href: string;
  isOpen: boolean;
  onClose?: () => void;
};

export const AppModal = ({ href, isOpen, onClose }: AppModalProps) => {
  return (
    <Modal
      width={"100%"}
      title="Modal header for set width example"
      isOpen={isOpen}
      onClose={onClose}
      actions={[
        <Button key="confirm" variant="primary" onClick={onClose}>
          Confirm
        </Button>,
        <Button key="cancel" variant="link" onClick={onClose}>
          Cancel
        </Button>,
      ]}
    >
      <iframe src={href} />
    </Modal>
  );
};
