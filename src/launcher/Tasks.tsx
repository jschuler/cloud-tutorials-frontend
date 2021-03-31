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
} from "@patternfly/react-core";
import QuickStartMarkdownView from "../quickstarts/components/QuickStartMarkdownView";
import { QuickStart } from "@cloudmosaic/quickstarts";
import { useHistory } from "react-router-dom";
import "./asciidoctor-skins/adoc-github.css";

declare const QUICKSTARTS_BASE: string;

export const Tasks = ({ path, tutorialPath }: { path: string, tutorialPath: string }) => {
  const history = useHistory();
  const handleClose = () => history.push(tutorialPath);
  const [tutorial, setTutorial] = React.useState<QuickStart>();
  const [steps, setSteps] = React.useState<WizardStep[]>([]);
  React.useEffect(() => {
    fetch(`${QUICKSTARTS_BASE}/${path}`)
      .then((res) => res.json())
      .then((json) => {
        setTutorial(json);
      });
  }, []);
  React.useEffect(() => {
    const taskSteps: WizardStep[] = [];
    if (tutorial) {
      (tutorial?.spec.tasks as string[]).map((task: string, index: number) => {
        const template = document.createElement("template");
        template.innerHTML = task.trim();
        // remove procedure
        template.content
          ?.querySelectorAll(".olist")
          .forEach((node) => node.remove());
        // remove verification
        template.content
          ?.querySelectorAll(".ulist")
          .forEach((node) => node.remove());
        const title =
          template.content.querySelector("h2")?.innerHTML ||
          `Task ${index + 1}`;

        const appLink = document.createElement('a');
        appLink.setAttribute('href', 'https://cloud.redhat.com?quickstart=quarkus-with-s2i');
        appLink.setAttribute('target', '__blank');
        appLink.innerHTML = 'Launch app & follow the quick start';

        template.content.appendChild(appLink);

        taskSteps.push({
          name: <QuickStartMarkdownView content={title} />,
          component: <QuickStartMarkdownView content={template.innerHTML} />,
        });
        setSteps(taskSteps);
      });
    }
  }, [tutorial]);

  return tutorial && steps.length ? (
    <Wizard steps={steps} onClose={handleClose} />
  ) : (
    <div>Loading</div>
  );
};
