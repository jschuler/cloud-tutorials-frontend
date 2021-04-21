import React from "react";
import ReactDOM from "react-dom";
import { Modal, Button, Spinner, Bullseye } from "@patternfly/react-core";
import { TutorialBreadcrumb } from "../quickstarts/components/Breadcrumb";
import QuickStartDrawer from "../quickstarts/components/QuickStartDrawer";
import {
  QuickStart,
  QuickStartTaskStatus,
  QuickStartTaskReview,
  QuickStartTask,
  QuickStartContextValues,
  QuickStartContext,
} from "@cloudmosaic/quickstarts";
import "./AppModal.css";

declare const APP_BASE: string;
declare const QUICKSTARTS_BASE: string;

export const AppModal = ({ text, url }: { text: string; url: string }) => {
  const fullUrl = new URL(url);
  const queryParams = new URLSearchParams(fullUrl.search);
  const tutorialIdQuery = queryParams.get("tutorialid");
  const tutorialPathQuery = queryParams.get("tutorialpath");
  const [tutorial, setTutorial] = React.useState<QuickStart>();
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const handleModalToggle = () => {
    setIsModalOpen(!isModalOpen);
  };
  const onConfirm = () => {
    setIsModalOpen(false);
  };
  const withProxy = false;
  React.useEffect(() => {
    if (withProxy && isModalOpen) {
      var x = new XMLHttpRequest();
      const server = "http://localhost:8084";
      //   const server = "https://cors.bridged.cc";
      const url = "https://www.google.com";
      const splitUrl = url.split("/");
      const baseUrl =
        splitUrl.length > 3 ? splitUrl.slice(0, 3).join("/") : url;
      x.open("GET", `${server}/${url}`);
      // I put "XMLHttpRequest" here, but you can use anything you want.
      x.setRequestHeader("X-Requested-With", "XMLHttpRequest");
      x.setRequestHeader("Access-Control-Allow-Origin", "*");
      x.onload = function () {
        const iframe = document.getElementById(
          "tut-app-frame"
        ) as HTMLIFrameElement;
        let modifiedResponse = x.responseText;
        // let modifiedResponse = x.responseText.replace(/<head>/, `<head>${mutationObserver}`);
        if (modifiedResponse.indexOf("base href") > -1) {
          modifiedResponse = modifiedResponse.replace(
            'base href="/"',
            `base href="${server}/${baseUrl}/"`
          );
        } else {
          modifiedResponse = modifiedResponse.replace(
            /<head>/,
            `<head><base href="${server}/${baseUrl}/">`
          );
        }
        //     modifiedResponse = modifiedResponse.replace(
        //     /<head>/,
        //     `<head><script>
        //     document.domain = "www.google.com";
        //     window.parent.fetch = window.fetch.bind(window);
        //   </script>`
        //     );
        modifiedResponse = modifiedResponse.replace(
          /src="\//gm,
          `src="${server}/${baseUrl}/`
        );
        modifiedResponse = modifiedResponse.replace(
          /url\(\//gm,
          `url(${server}/${baseUrl}/`
        );
        modifiedResponse = modifiedResponse.replace(
          /href="\//gm,
          `href="${server}/${baseUrl}/`
        );
        console.log(modifiedResponse);
        // iframe && iframe.contentDocument && iframe.contentDocument.write(x.responseText.replace(/<head>/i, '<head><base href="' + url + '">'));
        // iframe &&
        //   iframe.contentDocument &&
        //   iframe.contentDocument.write(modifiedResponse);
        if (iframe && iframe.contentWindow) {
          // iframe.srcdoc = modifiedResponse;
          // iframe.src = "data:text/html;charset=utf-8," + escape(modifiedResponse);
          iframe.contentWindow.document.open();
          iframe.contentWindow.document.write(modifiedResponse);
          iframe.contentWindow.document.close();
        }
      };
      x.send();
    }
  }, [isModalOpen]);
  React.useEffect(() => {
    fetch(`${QUICKSTARTS_BASE}/${tutorialIdQuery}.json`)
      .then((res) => res.json())
      .then((json) => {
        setTutorial(json);
      })
      .catch((error) => {
        console.error("Could not fetch quickstart:", tutorialIdQuery);
      });
  }, []);

  return (
    <React.Fragment>
      <Button onClick={handleModalToggle} isLarge>
        {text}
      </Button>
      {isModalOpen &&
        tutorial &&
        ReactDOM.createPortal(
          <div className="tut-modal">
            <div className="tut-main">
              <TutorialBreadcrumb
                basename={APP_BASE}
                crumbs={tutorialPathQuery?.split("/") || []}
              />
            </div>
            <div className="tut-drawer">
              <QuickStartDrawer
                tutorial={tutorial}
                search={fullUrl.search}
                onConfirm={onConfirm}
              >
                <>
                  <Bullseye className="tut-bullseye">
                    <Spinner isSVG />
                  </Bullseye>
                  {withProxy ? (
                    <iframe
                      id="tut-app-frame"
                      className="tut-app-frame"
                      title="app frame"
                    ></iframe>
                  ) : (
                    <iframe
                      id="tut-app-frame"
                      className="tut-app-frame"
                      src={url}
                      title="app frame"
                    ></iframe>
                  )}
                </>
              </QuickStartDrawer>
            </div>
          </div>,
          document.body
        )}
      {/* <Modal
        aria-label="app modal"
        width="100%"
        isOpen={isModalOpen}
        onClose={handleModalToggle}
        showClose={false}
        hasNoBodyWrapper={true}
      >
        <div className="tut-main">
          <TutorialBreadcrumb
            basename={APP_BASE}
            crumbs={tutorialPathQuery?.split("/") || []}
          />
        </div>
        <div className="tut-drawer">
          {tutorial && (
            <QuickStartDrawer tutorial={tutorial} search={fullUrl.search}>
              <iframe
                id="task-app-frame"
                src={url}
                title="app frame"
                width="100%"
                style={{
                  height: "600px",
                }}
              ></iframe>
            </QuickStartDrawer>
          )}
        </div>
      </Modal> */}
    </React.Fragment>
  );
};
