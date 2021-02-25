import React from 'react';
const MkControlPlane = React.lazy(() => import("mkUiFrontend/OpenshiftStreams"));
import { CompleteTaskModal, IncompleteTaskModal } from "../tutorial/task/closeDialog";
import { AppDrawerContext } from "../../AppDrawerContext";

export const ControlPlanePage = (props) => {

  const { quickstartId, onQsStateChange } = props;

  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);
  const [qsState, setQsState] = React.useState("Unknown");

  const drawerContext = React.useContext(AppDrawerContext);

  const onConfirm = () => {
    setShowConfirmDialog(false);
    drawerContext.setDrawerOpen(false);
  };

  const onClose = () => {
    setShowConfirmDialog(false);
  }

  const onQuickstartClose = () => {
    setShowConfirmDialog(true);
  };

  const onQuickstartChange = (value) => {
    let status = "Unknown";
    if (value[quickstartId].status === "Complete") {
      status = "Success";
      let i = 0;
      let key = `taskStatus${i}`;
      while (value[quickstartId][key]) {
        if (value[quickstartId][key] === "Failed") {
          status = "Failed";
          break;
        }
        i += 1;
        key = `taskStatus${i}`;
      }
    }
    setQsState(status);
    onQsStateChange(status);
  };

  const MkControlPlaneProps = {
    getUsername: () => Promise.resolve('user'),
    getToken: () => Promise.resolve('token'),
    onConnectToInstance: () => {},
    addAlert: () => {},
    basePath: 'http://localhost:8000',
    onQuickstartChange,
    onQuickstartClose,
    ...props
  };

  const getDialog = () => {
    if (qsState !== "Success") {
      return <IncompleteTaskModal onConfirm={onConfirm} onClose={onClose} />;
    } else {
      return <CompleteTaskModal onConfirm={onConfirm} onClose={onClose} />;
    }
  }

  return (
    <>
      <MkControlPlane {...MkControlPlaneProps} />
      {showConfirmDialog ? getDialog() : <></>}
    </>
  );
};
