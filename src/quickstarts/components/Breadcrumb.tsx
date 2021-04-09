import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";
import "../../launcher/App.css";

export const TutorialBreadcrumb = ({
  basename,
  crumbs,
}: {
  basename: string;
  crumbs: string[];
}) => {
  return (
    <div className="tut-header">
      <Breadcrumb className="tut-header__body">
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
              {chunk}
            </BreadcrumbItem>
          );
        })}
      </Breadcrumb>
    </div>
  );
};
