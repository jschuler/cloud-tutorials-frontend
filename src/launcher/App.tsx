import React, { useEffect } from "react";
import {
  Page,
  Nav,
  NavList,
  NavItem,
  PageSidebar,
  PageHeader,
} from "@patternfly/react-core";
import { Link } from 'react-router-dom'

declare global {
  interface Window {
    insights: {
      chrome: {
        init: () => void;
        identifyApp: (name: string) => void;
      };
    };
  }
}

const App = ({ children }: { children: React.ReactNode }) => {
  useEffect(() => {
    window.insights.chrome.init();
    window.insights.chrome.identifyApp("cloud-tutorials");
  }, []);

  const AppNav = (
    <Nav aria-label="Nav">
      <NavList>
        <NavItem>
          <Link to="/">Resources</Link>
        </NavItem>
      </NavList>
    </Nav>
  );

  const AppSidebar = <PageSidebar isNavOpen nav={AppNav} />;

  return (
    <Page sidebar={AppSidebar} isManagedSidebar>
      {children}
    </Page>
  );
};

export default App;
