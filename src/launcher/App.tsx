import React, { useEffect } from "react";
import {
  Page,
  Nav,
  NavList,
  NavItem,
  PageSidebar,
  PageHeader,
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbHeading,
} from "@patternfly/react-core";
import { Link, useLocation } from "react-router-dom";
import './App.css';
import "@patternfly/react-catalog-view-extension/dist/css/react-catalog-view-extension.css";
import "@cloudmosaic/quickstarts/dist/quickstarts.css";

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

  const location = useLocation();
  const locationChunks = location.pathname.split("/");

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

  const PageBreadcrumb = (
    <Breadcrumb className="tut-header__body">
      {locationChunks.map((chunk, index) => {
        if (index === 0) {
          return (
            <BreadcrumbItem
              key={`breadcrumb-base}`}
              isActive={!location.pathname || location.pathname === '/'}
              render={({ className }) => (
                <Link
                  to=""
                  className={className}
                >
                  Resources
                </Link>
              )}
            />
          );
        }
        if (chunk !== "") {
          return (
            <BreadcrumbItem
              key={`breadcrumb-${chunk}`}
              isActive={index === locationChunks.length - 1}
              render={({ className }) => (
                <Link
                  to={locationChunks.slice(0, index + 1).join("/")}
                  className={className}
                >
                  {chunk.charAt(0).toUpperCase() + chunk.slice(1)}
                </Link>
              )}
            />
          );
        }
        return;
      })}
    </Breadcrumb>
  );

  return (
    <Page sidebar={AppSidebar} isManagedSidebar breadcrumb={PageBreadcrumb} className="tut-main">
      {children}
    </Page>
  );
};

export default App;
