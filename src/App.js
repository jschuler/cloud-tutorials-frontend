import PropTypes from "prop-types";
import React, { Fragment, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Routes } from "./Routes";
import {
  Tooltip,
  Button,
  Drawer,
  DrawerContent,
  DrawerContentBody,
  DrawerPanelContent,
  DrawerHead,
  DrawerActions,
  DrawerCloseButton,
} from "@patternfly/react-core";
import { AppDrawerContext } from "./AppDrawerContext";
import "./App.scss";
import ExpandIcon from "@patternfly/react-icons/dist/js/icons/expand-icon";
import { SmallModal } from "./pages/tutorial/task/closeDialog";

const App = (props) => {
  useEffect(() => {
    insights.chrome.init();

    // TODO change this to your appname
    insights.chrome.identifyApp("cloud-tutorials");
    return insights.chrome.on("APP_NAVIGATION", (event) =>
      this.props.history.push(`/${event.navId}`)
    );
  }, []);

  const {
    drawerTitle,
    drawerOpen,
    drawerContent,
    setDrawerOpen,
    setDrawerContent,
    setDrawerTitle,
  } = useContext(AppDrawerContext);

  const [taskDone, setTaskDone] = React.useState(false);
  const [showConfirmDialog, setShowConfirmDialog] = React.useState(false);

  const confirmOnClose = () => {
    if (taskDone) {
      closeDrawer();
    } else {
      setShowConfirmDialog(true);
    }
  };

  const closeDrawer = () => {
    setShowConfirmDialog(false);
    setDrawerContent(null);
    setDrawerTitle("");
    setDrawerOpen(false);
    toggleFullScreen(null, false);
  };

  const [fullScreen, setFullScreen] = React.useState(false);

  const handleEscapePress = React.useCallback((event) => {
    const { key, keyCode } = event;

    if (keyCode === 27 && drawerOpen) {
      confirmOnClose();
    }
  }, []);

  const toggleFullScreen = (event, disable) => {
    const isFullScreen = disable !== undefined ? disable : !fullScreen;
    setFullScreen(isFullScreen);
    if (isFullScreen) {
      document.querySelector(".pf-c-page__sidebar").style.display = "none";
      document.querySelector(".pf-c-page__header").style.display = "none";
      document.querySelector(
        ".pf-c-drawer__body .pf-c-page__main"
      ).style.overflow = "hidden";
    } else {
      document.querySelector(".pf-c-page__sidebar").style.display = "block";
      document.querySelector(".pf-c-page__header").style.display = "block";
      document.querySelector(
        ".pf-c-drawer__body .pf-c-page__main"
      ).style.overflow = "auto";
    }
  };

  const onExpand = (expand, a) => {
    toggleFullScreen(null, true);
  };

  useEffect(() => {
    window.addEventListener("keydown", handleEscapePress);

    return () => {
      window.removeEventListener("keydown", handleEscapePress);
    };
  }, [handleEscapePress]);

  const panelContent = (
    <DrawerPanelContent isResizable={false} defaultSize="100%" minSize="200px">
      <DrawerHead>
        <span>{drawerTitle}</span>
        <DrawerActions>
          <DrawerCloseButton onClick={confirmOnClose} />
          {/* <Tooltip
            content="Toggle fullscreen"
          >
            <Button variant="plain" aria-label="Expand toggle" onClick={toggleFullScreen}>
              <ExpandIcon />
            </Button>
          </Tooltip> */}
        </DrawerActions>
      </DrawerHead>
      <div style={{ padding: "15px" }}>{drawerContent}</div>
    </DrawerPanelContent>
  );

  return (
    <>
      <Drawer isExpanded={drawerOpen} position="bottom" onExpand={onExpand}>
        <DrawerContent
          panelContent={panelContent}
          style={{ marginBottom: "72px" }}
        >
          <DrawerContentBody>
            <Routes childProps={props} />
          </DrawerContentBody>
        </DrawerContent>
      </Drawer>
      {showConfirmDialog ? (
        <SmallModal
          title="Are you sure?"
          content="You are about to close the task window. You have not yet completed the task. Are you sure you wish to exit?"
          onClose={() => setShowConfirmDialog(false)}
          onConfirm={closeDrawer}
        />
      ) : (
        <></>
      )}
    </>
  );
};

App.propTypes = {
  history: PropTypes.object,
};

/**
 * withRouter: https://reacttraining.com/react-router/web/api/withRouter
 * connect: https://github.com/reactjs/react-redux/blob/master/docs/api.md
 *          https://reactjs.org/docs/higher-order-components.html
 */
export default withRouter(connect()(App));
