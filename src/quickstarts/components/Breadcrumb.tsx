import React from "react";
import { Breadcrumb, BreadcrumbItem, Button, Popover } from "@patternfly/react-core";
import OutlinedQuestionCircleIcon from '@patternfly/react-icons/dist/js/icons/outlined-question-circle-icon';
import { ExitTutorialModal } from './QuitModal';
import "../../App.css";

export const TutorialBreadcrumb = ({
  basename,
  crumbs,
}: {
  basename: string;
  crumbs: string[];
}) => {
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const exitTutorial = () => {
    setIsModalOpen(true);
  };
  const handleModalToggle = () => {
    setIsModalOpen(false);
  }
  const handleModalConfirm = () => {
    // const removeParam = (name: string, url: string) => {
    //   return url.replace('/((&)*' + name + '=([^&]*))/g','');
    // }
    localStorage.removeItem('tutorialId');
    localStorage.removeItem('tutorialPath');
    let url = window.location.href;
    // url = removeParam('tutorialid', url);
    // url = removeParam('tutorialpath', url);

    var urlParts = url.split('?');
    var params = new URLSearchParams(urlParts[1]);
    params.delete('tutorialid');
    params.delete('tutorialpath')
    var newUrl = urlParts[0] + '?' + params.toString()

    window.location.href = newUrl;
  }
  return (
    <div className="tut-header">
      <div className="tut-header__body">
        <Breadcrumb>
          {crumbs.map((chunk, index) => {
            console.log(crumbs.slice(0, index + 1).join("/"));
            if (index === 0) {
              return (
                <BreadcrumbItem
                  key={`breadcrumb-base`}
                  isActive={false}
                  to={`${basename}`}
                  className="tut-home"
                >
                  <img
                    src="https://www.redhat.com/cms/managed-files/illustration_rhel-isometric.svg"
                    alt="Red Hat Enterprise Linux isometric illustration"
                    className="tut-img-fluid"
                  />
                  <span>Resources</span>
                </BreadcrumbItem>
              );
            }
            return (
              <BreadcrumbItem
                key={`breadcrumb-${chunk || "/"}`}
                // isActive={index === crumbs.length - 1}
                to={`${basename}${crumbs.slice(0, index + 1).join("/")}`}
              >
                {chunk.charAt(0).toUpperCase() + chunk.slice(1)}
              </BreadcrumbItem>
            );
          })}
        </Breadcrumb>
      </div>
      <Button variant="link" style={{ color: 'white' }} onClick={ () => window.location.replace(`${basename}${crumbs.join("/")}`) }>
        Return to tutorial
      </Button>
      <Button variant="link" style={{ color: 'white' }} onClick={ exitTutorial }>
        Exit tutorial
      </Button>
      <ExitTutorialModal isOpen={isModalOpen} onClose={handleModalToggle} onConfirm={handleModalConfirm} />
      {}
      {/* <Popover
        aria-label="Basic popover"
        bodyContent={<div>Return to the main tutorial after completing the in-app instructions</div>}
        position="left"
        enableFlip={false}
      >
        <Button variant="plain" className="info-popover">
          <OutlinedQuestionCircleIcon color="white" title="Tutorial info" />
        </Button>
      </Popover> */}
    </div>
  );
};
