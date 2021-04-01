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
import { QuickStart, QuickStartTaskStatus, QuickStartTaskReview } from "@cloudmosaic/quickstarts";
import { useHistory, useParams } from "react-router-dom";
import { TaskReview } from "./TaskReview";
import { AppModal } from "./AppModal";
import "./asciidoctor-skins/adoc-github.css";
import "./Tasks.css";

declare const QUICKSTARTS_BASE: string;
declare const TUTORIALS_BASE: string;

export const Tasks = () => {
  const history = useHistory();
  const locationChunks = history.location.pathname.split('/');
  const parentPath = locationChunks.slice(0, locationChunks.length - 1).join('/');
  // @ts-ignore
  const { name } = useParams();
  const handleClose = () => history.push(parentPath);
  const [tutorial, setTutorial] = React.useState<QuickStart>();
  const [steps, setSteps] = React.useState<WizardStep[]>([]);
  React.useEffect(() => {
    fetch(`${TUTORIALS_BASE}/${name}.tutorial.json`)
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

        const review: QuickStartTaskReview = {
          instructions: 'Did you complete the quick start in the launched app?',
          failedTaskHelp: 'Complete the quick start in the launched app'
        }

        const onTaskReview = (status: any) => {}

        taskSteps.push({
          name: <QuickStartMarkdownView content={title} />,
          component: (
            <>
              <QuickStartMarkdownView content={template.innerHTML} />
              <div className="tut-app-launch">
                <Button component="a" href="https://cloud.redhat.com?quickstart=quarkus-with-s2i" target="_blank" variant="primary">
                  Launch app & follow the quick start
                </Button>
              </div>
              <TaskReview review={review} taskStatus={QuickStartTaskStatus.INIT} onTaskReview={() => {}} />
            </>
          ),
        });
        setSteps(taskSteps);
      });
    }
  }, [tutorial]);

  return tutorial && steps.length ? (
    <PageSection variant="light" padding={{ default: 'noPadding' }}><Wizard steps={steps} onClose={handleClose} className="tut-tasks" /></PageSection>
  ) : null;
};
