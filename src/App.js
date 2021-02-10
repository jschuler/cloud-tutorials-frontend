import PropTypes from "prop-types";
import React, { Fragment, useEffect, useContext } from "react";
import { withRouter } from "react-router-dom";
import { connect } from "react-redux";
import { Routes } from "./Routes";
import { Drawer, DrawerContent, DrawerContentBody, DrawerPanelContent, DrawerHead, DrawerActions, DrawerCloseButton } from "@patternfly/react-core";
import { AppDrawerContext } from './AppDrawerContext';
import "./App.scss";

const App = (props) => {
  useEffect(() => {
    insights.chrome.init();

    // TODO change this to your appname
    insights.chrome.identifyApp("cloud-tutorials");
    return insights.chrome.on("APP_NAVIGATION", (event) =>
      this.props.history.push(`/${event.navId}`)
    );
  }, []);

  const { drawerTitle, drawerOpen, drawerContent, setDrawerOpen, setDrawerContent, setDrawerTitle } = useContext(AppDrawerContext);

  const closeDrawer = () => {
    setDrawerContent(null);
    setDrawerTitle('');
    setDrawerOpen(false);
  }

  const panelContent = (
    <DrawerPanelContent>
      <DrawerHead>
        <span>
          {drawerTitle}
        </span>
        <DrawerActions>
          <DrawerCloseButton onClick={closeDrawer} />
        </DrawerActions>
      </DrawerHead>
      <div style={{ padding: '15px' }}>
        {drawerContent}
      </div>
    </DrawerPanelContent>
  );

  return (
    <Drawer isExpanded={drawerOpen} isInline>
      <DrawerContent panelContent={panelContent}>
        <DrawerContentBody>
          <Routes childProps={props} />
        </DrawerContentBody>
      </DrawerContent>
    </Drawer>
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
