import React from "react";
import {
  PageSection,
  Button,
  Wizard,
  WizardStep,
  TextContent,
  Text,
  TextList,
  TextListItem,
} from "@patternfly/react-core";
import {
  QuickStart,
  QuickStartTaskStatus,
  QuickStartTaskReview,
  QuickStartTask,
} from "@cloudmosaic/quickstarts";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { TaskReview } from "./TaskReview";
import { removeParagraphWrap } from "./utils";
import "./asciidoctor-skins/adoc-github.css";
import "./Tasks.css";

declare const QUICKSTARTS_BASE: string;
declare const TUTORIALS_BASE: string;

export const Tasks = () => {
  const history = useHistory();
  const location = useLocation();
  const locationChunks = location.pathname.split("/");
  const parentPath = locationChunks
    .slice(0, locationChunks.length - 1)
    .join("/");
  const tasksPath = locationChunks
    .slice(0, locationChunks.length - 1)
    .join("/");
  // @ts-ignore
  const { name, task } = useParams();
  const handleClose = () => history.push(parentPath);
  const handleNext = ({ id, name }: WizardStep) => {
    history.push(`${tasksPath}/${id}`);
  };
  const handleBack = ({ id, name }: WizardStep) => {
    history.push(`${tasksPath}/${id}`);
  };
  const handleGoToStep = ({ id, name }: WizardStep) => {
    history.push(`${tasksPath}/${id}`);
  };
  const [tutorial, setTutorial] = React.useState<QuickStart>();
  const [steps, setSteps] = React.useState<WizardStep[]>([]);
  React.useEffect(() => {
    fetch(`${TUTORIALS_BASE}/${name}.json`)
      .then((res) => res.json())
      .then((json) => {
        setTutorial(json);
      });
  }, []);
  React.useEffect(() => {
    const taskSteps: WizardStep[] = [];
    if (tutorial) {
      (tutorial.spec.tasks as QuickStartTask[]).forEach(
        (task: QuickStartTask, index: number) => {
          const title = task.title || `Task ${index + 1}`;
          const wrappedTitle = `<h2>${removeParagraphWrap(title)}</h2>`;

          const template = document.createElement("template");
          template.innerHTML = task.description?.trim() || "<p></p>";

          const externalLinkNode = template.content.querySelector(
            ".tutorial-external"
          );
          let externalLinkComponent;
          if (externalLinkNode) {
            externalLinkComponent = (
              <Button
                component="a"
                href={`${externalLinkNode.getAttribute(
                  "href"
                )}?quickstart=kafkacat&tutorial=${encodeURIComponent(
                  location.pathname
                )}`}
                variant="primary"
                target="__blank"
              >
                {externalLinkNode.textContent}
              </Button>
            );
            externalLinkNode.parentElement?.parentElement?.remove();
          }

          let prereq;
          const prereqNode = Array.from(
            template.content.querySelectorAll("div")
          ).find((el) => el.textContent === "Prerequisites");
          let prereqComponent;
          if (prereqNode) {
            prereq = prereqNode.parentElement?.children[1];
            prereqNode.parentElement?.remove();

            const items = prereq
              ? Array.from(prereq?.querySelectorAll("p")).map((p, pIndex) => (
                  <TextListItem key={`${index}/${pIndex}`}>
                    <div dangerouslySetInnerHTML={{ __html: p.innerHTML }} />
                  </TextListItem>
                ))
              : [];

            prereqComponent = (
              <TextContent>
                <Text component="h3">Prerequisites</Text>
                <TextList>{items}</TextList>
              </TextContent>
            );
          }

          let review: QuickStartTaskReview = task.review as QuickStartTaskReview;
          if (!review) {
            let verification;
            const verificationNode = Array.from(
              template.content.querySelectorAll("div")
            ).find((el) => el.textContent === "Verification");
            if (verificationNode) {
              verification = verificationNode.parentElement?.children[1];
              verificationNode.parentElement?.remove();
            }

            const reviewBlock = document.createElement("div");
            verification?.querySelectorAll("p").forEach((p) => {
              reviewBlock.appendChild(p);
            });
            const reviewInstructions =
              reviewBlock?.innerHTML || "Did you complete the task?";

            review = {
              instructions: reviewInstructions,
              failedTaskHelp: "Complete the task before continuing on",
            };
          }

          const onTaskReview = (status: any) => {};

          let nextButtonText = "Next";
          if (tutorial.spec.tasks && index === tutorial.spec.tasks.length - 1) {
            nextButtonText = "Review";
          }
          taskSteps.push({
            id: index + 1,
            name: <div dangerouslySetInnerHTML={{ __html: title }} />,
            nextButtonText,
            component: (
              <>
                <div dangerouslySetInnerHTML={{ __html: wrappedTitle }} />
                <div
                  dangerouslySetInnerHTML={{ __html: template.innerHTML || "" }}
                />
                {prereqComponent}
                <div className="tut-app-launch">{externalLinkComponent}</div>
                <TaskReview
                  review={review}
                  taskStatus={QuickStartTaskStatus.INIT}
                  onTaskReview={onTaskReview}
                />
              </>
            ),
          });
        }
      );
      taskSteps.push({
        id: taskSteps.length + 1,
        name: "Review",
        component: (
          <div>
            <div
              dangerouslySetInnerHTML={{
                __html:
                  tutorial.spec.conclusion ||
                  "You have completed this tutorial.",
              }}
            />
          </div>
        ),
        isFinishedStep: true,
      });
      setSteps(taskSteps);
    }
  }, [tutorial]);

  return tutorial && steps.length ? (
    <PageSection variant="light" padding={{ default: "noPadding" }}>
      <Wizard
        steps={steps}
        onClose={handleClose}
        onNext={handleNext}
        onBack={handleBack}
        onGoToStep={handleGoToStep}
        className="tut-tasks"
        startAtStep={Number.parseInt(task)}
      />
    </PageSection>
  ) : null;
};
