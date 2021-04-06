import React from "react";
import { Breadcrumb, BreadcrumbItem } from "@patternfly/react-core";

export const TutorialBreadcrumb = ({
  basename,
  crumbs,
}: {
  basename: string;
  crumbs: string[];
}) => {
  return (
    <Breadcrumb>
      {crumbs.map((chunk, index) => {
        console.log(crumbs.slice(0, index + 1).join("/"));
        if (index === 0) {
          return (
            <BreadcrumbItem
              key={`breadcrumb-base`}
              isActive={false}
              to={`${basename}`}
            >
              Resources
            </BreadcrumbItem>
          );
        }
        return (
          <BreadcrumbItem
            key={`breadcrumb-${chunk || "/"}`}
            isActive={index === crumbs.length - 1}
            to={`${basename}#${crumbs.slice(0, index + 1).join("/")}`}
          >
            {chunk}
          </BreadcrumbItem>
        );
      })}
    </Breadcrumb>
  );
};
