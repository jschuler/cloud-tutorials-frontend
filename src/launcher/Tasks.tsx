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
  BackgroundImage,
  Bullseye,
  Alert,
} from "@patternfly/react-core";
import ConnectDevelopIcon from "@patternfly/react-icons/dist/js/icons/connectdevelop-icon";
import {
  QuickStart,
  QuickStartTaskStatus,
  QuickStartTaskReview,
  QuickStartTask,
  QuickStartContextValues,
  QuickStartContext,
} from "@patternfly/quickstarts";
import { useHistory, useParams, useLocation } from "react-router-dom";
import { TaskReview } from "./TaskReview";
// import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
// import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
// import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
// import TextField from "@data-driven-forms/pf4-component-mapper/text-field";
import { FormMapper } from "./FormMapper";
import { Task } from "./Task";
import { AppModal } from "./AppModal";
import "./asciidoctor-skins/adoc-github.css";
import "./Tasks.css";
import { YoutubeEmbed } from "./YoutubeEmbed";
import { loadJSONQuickstarts } from './quickstartsLoader';

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
  const {
    activeQuickStartID,
    allQuickStartStates,
    activeQuickStartState,
    setQuickStartTaskStatus,
    setActiveQuickStart,
    setQuickStartTaskNumber,
    nextStep,
    previousStep,
    allQuickStarts,
  } = React.useContext<QuickStartContextValues>(QuickStartContext);
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
  const [quickstarts, setQuickstarts] = React.useState<QuickStart[]>();
  const [steps, setSteps] = React.useState<WizardStep[]>([]);
  React.useEffect(() => {
    const load = async () => {
      const allQuickstarts = await loadJSONQuickstarts("/mosaic/cloud-tutorials");
      // debugger;
      setQuickstarts(allQuickstarts);
    };
    load();
  }, []);
  React.useEffect(() => {
    fetch(`${TUTORIALS_BASE}/${taskName}.json`)
      .then((res) => res.json())
      .then((json) => {
        setTutorial(json);
      });

    if (!activeQuickStartID) {
      setActiveQuickStart && setActiveQuickStart(taskName);
    }
  }, []);
  React.useEffect(() => {
    const taskSteps: WizardStep[] = [];
    if (tutorial && quickstarts) {
      (tutorial.spec.tasks as QuickStartTask[]).forEach(
        (task: QuickStartTask, taskIndex: number) => {
          let hasVerificationBlock = false;
          const title = task.title || `Task ${taskIndex + 1}`;
          const wrappedTitle = `<h2>${title}</h2>`;

          const template = document.createElement("template");
          template.innerHTML = task.description?.trim() || "<p></p>";

          const templateComponent = (
            <div
              key={`template-${taskIndex}`}
              className="tut-template-container"
            >
              {Array.from(template.content.children).map((c, index) => {
                const returnArray = [];
                if (c.querySelector(".tutorial-youtube")) {
                  Array.from(c.querySelectorAll(".tutorial-youtube")).forEach(
                    (node, nIndex) => {
                      const url = node.getAttribute("href") || "";
                      returnArray.push(
                        <div
                          className="tut-app-launch"
                          key={`task-${taskNumber}-${index}-${nIndex}-tutorial-youtube`}
                        >
                          <YoutubeEmbed url={url} />
                        </div>
                      );
                    }
                  );
                }
                if (c.querySelector(".tutorial-external")) {
                  // parse external app links
                  Array.from(c.querySelectorAll(".tutorial-external")).forEach(
                    (node, nIndex) => {
                      let url = node.getAttribute("href") || "";
                      url = url.replace("quickstart=", "tutorialid=");
                      let fullUrl = `${url}${url.includes('?') ? '&' : '?'}tutorialpath=${encodeURIComponent(
                        `/${taskName}/${taskIndex + 1}`
                      )}`;
                      // fullUrl = `${fullUrl}?tutorialdesc=${encodeURIComponent(task.description || '')}`;
                      returnArray.push(
                        <div
                          className="tut-app-launch"
                          key={`task-${taskNumber}-${index}-${nIndex}-tutorial-external`}
                        >
                          <Alert
                            customIcon={<ConnectDevelopIcon />}
                            variant="info"
                            title="Connect to the following application before proceeding to the next step"
                          >
                            <Bullseye>
                              <Button
                                component="a"
                                href={fullUrl}
                                variant="primary"
                                isLarge
                                className="tut-cta"
                                onClick={(e) => {
                                  e.preventDefault();
                                  console.log(`nav to ${fullUrl}`);
                                  localStorage.setItem('quickStartCrossDomain', JSON.stringify({
                                    host: `${window.location.origin}/mosaic/cloud-tutorials`,
                                    // the current tutorial name
                                    tutorial: taskName,
                                    // the current task step
                                    step: taskIndex + 1,
                                    // the quick start id we want to load in the target app
                                    // quickstartId: 'add-healthchecks', // 'add-healthchecks', 'sample-application'
                                    // or the quickstart content we want to inject and use in the target app
                                    quickstartContent: quickstarts?.find((qs: QuickStart) => qs.metadata.name === 'host-provided')
                                  }));
                                  window.location.replace(`${fullUrl}${fullUrl.includes('?') ? '&' : '?'}learning=true`);
                                }}
                              >
                                {node.textContent}
                              </Button>
                            </Bullseye>
                          </Alert>
                        </div>
                      );
                    }
                  );
                }
                if (c.querySelector(".tutorial-iframe")) {
                  // parse iframe app links
                  Array.from(c.querySelectorAll(".tutorial-iframe")).forEach(
                    (node, nIndex) => {
                      let url = node.getAttribute("href") || "";
                      url = url.replace("?quickstart=", "?tutorialid=");
                      const fullUrl = `${url}&tutorialpath=${encodeURIComponent(
                        `/${taskName}/${taskIndex + 1}`
                      )}`;
                      returnArray.push(
                        <div
                          className="tut-app-launch"
                          key={`task-${taskNumber}-${index}-${nIndex}-tutorial-iframe`}
                        >
                          <AppModal
                            text={node.textContent as string}
                            url={fullUrl}
                          />
                        </div>
                      );
                    }
                  );
                }
                if (c.className.includes("tutorial-input")) {
                  let inputSchema: {
                    fields: any[];
                  } = {
                    fields: [],
                  };
                  const field = buildTutorialInput(template.content);
                  inputSchema.fields.push(field);
                  returnArray.push(
                    <FormMapper
                      schema={inputSchema}
                      key={`task-${taskNumber}-${index}-tutorial-input`}
                    />
                  );
                }
                if (c.innerHTML.includes("Prerequisites")) {
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
                    returnArray.push(
                      <TextContent
                        key={`task-${taskNumber}-${index}-tutorial-prerequisites`}
                      >
                        <Text component="h3">Prerequisites</Text>
                        <TextList>{items}</TextList>
                      </TextContent>
                    );
                  }
                }
                if (c.innerHTML.includes("Verification")) {
                  hasVerificationBlock = true;
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
                    returnArray.push(
                      <TaskReview
                        key={`task-${taskNumber}-${index}-tutorial-verification`}
                        review={review}
                        taskStatus={QuickStartTaskStatus.INIT}
                        onTaskReview={onTaskReview}
                      />
                    );
                  }
                }
                if (returnArray.length === 0) {
                  returnArray.push(
                    <div
                      key={`task-${taskNumber}-${index}-tutorial-general`}
                      dangerouslySetInnerHTML={{ __html: c.innerHTML }}
                    />
                  );
                }
                return returnArray;
              })}
            </div>
          );

          let nextButtonText = "Next";
          if (
            tutorial.spec.tasks &&
            taskIndex === tutorial.spec.tasks.length - 1
          ) {
            nextButtonText = "Review";
          }

          taskSteps.push({
            id: taskIndex + 1,
            name: <div dangerouslySetInnerHTML={{ __html: title }} />,
            nextButtonText,
            component: (
              <>
                <div dangerouslySetInnerHTML={{ __html: wrappedTitle }} />
                {templateComponent}
              </>
            ),
            enableNext: hasVerificationBlock ? false : true
          });
        }
      );
      taskSteps.push({
        id: taskSteps.length + 1,
        name: "Review",
        nextButtonText: "Close",
        component: (
          <div
            dangerouslySetInnerHTML={{
              __html:
                tutorial.spec.conclusion || "You have completed this tutorial.",
            }}
          />
        )
      });
      setSteps(taskSteps);
    }
  }, [tutorial, quickstarts]);

  return tutorial && quickstarts && steps.length ? (
    <TasksContext.Provider
      value={{
        tutorial,
        steps,
      }}
    >
      <PageSection variant="light" padding={{ default: "noPadding" }}>
        <Task />
      </PageSection>
    </TasksContext.Provider>
  ) : null;
};
