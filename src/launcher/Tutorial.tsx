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
import { QuickStart } from "@cloudmosaic/quickstarts";
import QuickStartMarkdownView from "../quickstarts/components/QuickStartMarkdownView";
import { useHistory } from "react-router-dom";
import "./asciidoctor-skins/adoc-github.css";

declare const QUICKSTARTS_BASE: string;

export const Tutorial = ({ path }: { path: string }) => {
  const history = useHistory();
  const handleClick = (path: string) => history.push(path);
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
        taskSteps.push({
          name: <QuickStartMarkdownView content={title} />,
          component: <QuickStartMarkdownView content={template.innerHTML} />,
        });
        setSteps(taskSteps);
      });
    }
  }, [tutorial]);

  return tutorial ? (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{tutorial.spec.displayName}</Text>
          <QuickStartMarkdownView content={tutorial.spec.description} />
        </TextContent>
      </PageSection>
      <PageSection>
        <QuickStartMarkdownView content={tutorial.spec.introduction || ""} />
      </PageSection>
      {tutorial.spec.prerequisites && (
        <PageSection>
          <TextContent>
            <Text component="h2">Prerequisites</Text>
            <TextList>
              {tutorial.spec.prerequisites.map((prereq, index) => (
                <TextListItem key={index}>{prereq}</TextListItem>
              ))}
            </TextList>
          </TextContent>
        </PageSection>
      )}
      <Button
        variant="primary"
        onClick={() => handleClick("/tutorial/quarkus-kafka/tasks")}
      >
        Start tutorial
      </Button>
    </>
  ) : (
    <div>Loading</div>
  );
};
