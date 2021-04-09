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
// import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
// import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
// import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
// import TextField from "@data-driven-forms/pf4-component-mapper/text-field";
import { FormMapper } from './FormMapper';
import { Task } from './Task';
import "./asciidoctor-skins/adoc-github.css";
import "./Tasks.css";

declare const QUICKSTARTS_BASE: string;
declare const TUTORIALS_BASE: string;

export const TasksContext = React.createContext<any | null>(null);

const buildTutorialInput = (element: Element | DocumentFragment) => {
  const field: any = {};
  let itemKey: string;
  let itemValue: any;
  const list = element.querySelector(".dlist dl");
  if (list) {
    Array.from(list.children).forEach((c, cIndex) => {
      if (cIndex % 2 === 0) {
        // dt
        if (c.textContent) {
          itemKey = c.textContent.trim();
        }
      } else {
        // dd
        if (c.querySelector(".dlist dl")) {
          // nested list
          itemValue = buildTutorialInput(c);
        } else if (c.textContent) {
          itemValue = c.textContent.trim();
          if (itemValue === "true") {
            itemValue = true;
          } else if (itemValue === "false") {
            itemValue = false;
          }
          field[itemKey as string] = itemValue;
        }
      }
    });
  }
  return field;
};

const removeAllChildNodes = (parent: Element) => {
  if (parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }
};

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
  const { name: taskName, task: taskNumber } = useParams();
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
    fetch(`${TUTORIALS_BASE}/${taskName}.json`)
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
          const wrappedTitle = `<h2>${title}</h2>`;

          const template = document.createElement("template");
          template.innerHTML = task.description?.trim() || "<p></p>";

          const templateComponent = (
            <div key={`template-${index}`} className="tut-template-container">
              {Array.from(template.content.children).map((c, index) => {
                if (c.querySelector(".tutorial-external")) {
                  // parse external app links
                  const node = c.querySelector(".tutorial-external");
                  if (node) {
                    debugger;
                    let url = node.getAttribute("href") || '';
                    url = url.replace('?quickstart=', '?tutorialid=')
                    const fullUrl = `${url}&tutorialpath=${encodeURIComponent(
                      `/${taskName}/${taskNumber}`
                    )}`;
                    return (
                      <div
                        className="tut-app-launch"
                        key={`task-${taskNumber}-${index}`}
                      >
                        <Button
                          component="a"
                          href={fullUrl}
                          variant="primary"
                          target="__blank"
                        >
                          {node.textContent}
                        </Button>
                      </div>
                    );
                  }
                } else if (c.className.includes("tutorial-input")) {
                  let inputSchema: {
                    fields: any[];
                  } = {
                    fields: [],
                  };
                  const field = buildTutorialInput(template.content);
                  inputSchema.fields.push(field);
                  return (
                    <FormMapper schema={inputSchema} />
                  );
                } else if (c.innerHTML.includes("Prerequisites")) {
                  // parse prerequisites block
                  let prereq;
                  const prereqNode = Array.from(c.querySelectorAll("div")).find(
                    (el) => el.textContent === "Prerequisites"
                  );
                  if (prereqNode) {
                    prereq = prereqNode.parentElement?.children[1];
                    prereqNode.parentElement?.remove();
                    const items = prereq
                      ? Array.from(prereq?.querySelectorAll("p")).map(
                          (p, pIndex) => (
                            <TextListItem key={`${index}/${pIndex}`}>
                              <div
                                dangerouslySetInnerHTML={{
                                  __html: p.innerHTML,
                                }}
                              />
                            </TextListItem>
                          )
                        )
                      : [];
                    return (
                      <TextContent key={`task-${taskNumber}-${index}`}>
                        <Text component="h3">Prerequisites</Text>
                        <TextList>{items}</TextList>
                      </TextContent>
                    );
                  }
                } else if (c.innerHTML.includes("Verification")) {
                  let verification;
                  const verificationNode = Array.from(
                    c.querySelectorAll("div")
                  ).find((el) => el.textContent === "Verification");
                  if (verificationNode) {
                    verification = verificationNode.parentElement?.children[1];
                    const reviewBlock = document.createElement("div");
                    verification?.querySelectorAll("p").forEach((p) => {
                      reviewBlock.appendChild(p);
                    });
                    const reviewInstructions =
                      reviewBlock?.innerHTML || "Did you complete the task?";
                    const review = {
                      instructions: reviewInstructions,
                      failedTaskHelp: "Complete the task before continuing on",
                    };
                    const onTaskReview = (status: any) => {};
                    return (
                      <TaskReview
                        key={`task-${taskNumber}-${index}`}
                        review={review}
                        taskStatus={QuickStartTaskStatus.INIT}
                        onTaskReview={onTaskReview}
                      />
                    );
                  }
                }
                return (
                  <div
                    key={`task-${taskNumber}-${index}`}
                    dangerouslySetInnerHTML={{ __html: c.innerHTML }}
                  />
                );
              })}
            </div>
          );

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
                {templateComponent}
              </>
            ),
          });
        }
      );
      taskSteps.push({
        id: taskSteps.length + 1,
        name: "Review",
        component: (
          <div
            dangerouslySetInnerHTML={{
              __html:
                tutorial.spec.conclusion || "You have completed this tutorial.",
            }}
          />
        ),
        isFinishedStep: true,
      });
      setSteps(taskSteps);
    }
  }, [tutorial]);

  return tutorial && steps.length ? (
    <TasksContext.Provider value={{
      tutorial,
      steps
    }}>
      <PageSection variant="light" padding={{ default: "noPadding" }}>
        <Task />
      </PageSection>
    </TasksContext.Provider>
  ) : null;
};
