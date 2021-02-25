/* eslint-disable no-nested-ternary */
import React from "react";
import ReactDOM from "react-dom";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";
import { translate } from "react-i18next";
import {
  Button,
  Card,
  ClipboardCopy,
  ClipboardCopyVariant,
  Form,
  FormGroup,
  Grid,
  GridItem,
  Page,
  PageSection,
  Radio,
  SkipToContent,
  TextContent,
  Text,
  TextVariants,
  Spinner,
  Split,
  SplitItem,
  Alert
} from "@patternfly/react-core";
import {
  CheckCircleIcon,
  OutlinedCircleIcon,
  TimesCircleIcon,
} from "@patternfly/react-icons";
import get from "lodash.get";
import { connect, reduxActions } from "../../../redux";
import Breadcrumb from "../../../components/breadcrumb/breadcrumb";
import ErrorScreen from "../../../components/errorScreen/errorScreen";
import { RoutedConnectedMasthead } from "../../../components/masthead/masthead";
import WalkthroughResources from "../../../components/walkthroughResources/walkthroughResources";
import {
  prepareCustomWalkthroughNamespace,
  prepareWalkthroughV4,
} from "../../../services/walkthroughServices";
import { getThreadProgress } from "../../../services/threadServices";
import { noop } from "../../../common/helpers";
import {
  getDocsForWalkthrough,
  getDefaultAdocAttrs,
} from "../../../common/docsHelpers";
import {
  parseWalkthroughAdoc,
  WalkthroughVerificationBlock,
  WalkthroughTextBlock,
  WalkthroughStep,
} from "../../../common/walkthroughHelpers";
import ProvisioningScreen from "../../../components/provisioning/provisioningScreen";
import { findServices } from "../../../common/serviceInstanceHelpers";
import { isOpenShift4 } from "../../../common/openshiftHelpers";
import { AppDrawerContext } from "../../../AppDrawerContext";
import { ControlPlanePage } from "../../ManagedKafka/ControlPlanePage";
import { DataPlanePage } from "../../ManagedKafka/DataPlanePage";

class TaskPage extends React.Component {
  constructor(props) {
    super(props);
    this.rootDiv = React.createRef();
    this.subClipboard = this.subClipboard.bind(this);
    this.subApps = this.subApps.bind(this);
    this.subApplaunch = this.subApplaunch.bind(this);
    this.subCopyToDrawer = this.subCopyToDrawer.bind(this);
    this.state = {
      taskStatus: "",
      verifyThroughApp: false
    }
  }

  subClipboard() {
    const codeBlocks = this.rootDiv.current.querySelectorAll(".clipboard pre");
    let sequenceNumber = 1;
    codeBlocks.forEach((block) => {
      ReactDOM.render(
        <ClipboardCopy
          id={`clipboard-copy-${sequenceNumber.toString()}`}
          isReadOnly
          variant={
            block.clientHeight > 40 ? ClipboardCopyVariant.expansion : null
          }
          style={{ whiteSpace: "pre-wrap" }}
        >
          {block.innerText}
        </ClipboardCopy>,
        block.parentNode
      );
      sequenceNumber++;
    });
  }

  subApps() {
    let hasApp = false;
    const hasControlPlane = this.subApplaunch(
      "span.app-launch-control",
      ControlPlanePage,
      "Kafka control plane",
      "create-kafka-instance"
    );
    const hasDataPlane = this.subApplaunch(
      "span.app-launch-data",
      DataPlanePage,
      "Kafka data plane",
      "create-topic"
    );
  }

  subApplaunch(query, FedModule, title, quickstartId) {
    const {
      setDrawerOpen,
      setDrawerContent,
      setDrawerTitle,
      drawerOpen,
      drawerTitle,
    } = this.props.drawerContext;
    const quickstartState = {
      [quickstartId]: {
        status: "Not started",
        taskNumber: -1,
      },
    };
    const onQsStateChange = (taskStatus) => {
      this.setState({
        taskStatus
      });
    }

    const handleClick = () => {
      setDrawerContent(
        <React.Suspense fallback={<Spinner />}>
          <FedModule
            quickstartId={quickstartId}
            quickstartState={quickstartState}
            onQsStateChange={onQsStateChange}
          />
        </React.Suspense>
      );
      setDrawerTitle(
        <Split hasGutter>
          <SplitItem>{title}</SplitItem>
        </Split>
      );
      setDrawerOpen(title === drawerTitle ? !drawerOpen : true);
    };
    const codeBlocks = this.rootDiv.current.querySelectorAll(query);
    let sequenceNumber = 1;
    codeBlocks.forEach((block) => {
      ReactDOM.render(
        <Button
          id={`app-launch-${sequenceNumber.toString()}`}
          variant="primary"
          isInline
          onClick={handleClick}
        >
          {block.innerText}
        </Button>,
        block
      );
      sequenceNumber++;
    });
    return codeBlocks.length > 0;
  }

  subCopyToDrawer() {
    const handleClick = (event) => {
      // this weird looking code sets the input value and triggers a change event
      const el = document.querySelector("#simple-form-name-01");
      const newValue = "kafka-test";
      const valueSetter = Object.getOwnPropertyDescriptor(el, "value").set;
      const prototype = Object.getPrototypeOf(el);
      const prototypeValueSetter = Object.getOwnPropertyDescriptor(
        prototype,
        "value"
      ).set;
      if (valueSetter && valueSetter !== prototypeValueSetter) {
        prototypeValueSetter.call(el, newValue);
      } else {
        valueSetter.call(el, newValue);
      }
      el.dispatchEvent(new Event("input", { bubbles: true }));
    };
    const codeBlocks = this.rootDiv.current.querySelectorAll(
      "span.copy-to-drawer"
    );
    let sequenceNumber = 1;
    codeBlocks.forEach((block) => {
      ReactDOM.render(
        <Button
          id={`copy-to-drawer-${sequenceNumber.toString()}`}
          variant="secondary"
          isInline
          onClick={handleClick}
        >
          {block.innerText}
        </Button>,
        block
      );
      sequenceNumber++;
    });
  }

  componentDidUpdate() {
    if (this.rootDiv.current) {
      this.subClipboard();
      this.subApps();
      // this.subCopyToDrawer();
    }
  }

  componentDidMount() {
    const {
      getWalkthrough,
      prepareCustomWalkthrough,
      provisionWalkthroughV4,
      updateWalkthroughProgress,
      match: {
        params: { id },
      },
    } = this.props;

    this.rootDiv = React.createRef();
    // If this is our current walkthrough and the data we need is available
    // locally then we don't need to kick off a fetch of the walkthroughs.
    if (
      this.props.thread &&
      this.props.thread.id &&
      this.props.thread.id === id &&
      this.props.manifest.fulfilled &&
      this.props.thread.fulfilled
    ) {
      return;
    }
    getWalkthrough(id);
    if (isOpenShift4()) {
      provisionWalkthroughV4(id, this.getDocsAttributes(id));
    } else {
      prepareCustomWalkthrough(id, this.getDocsAttributes(id));
    }
    const currentUsername = localStorage.getItem("currentUserName");
    const currentUserProgress = getThreadProgress(currentUsername);
    updateWalkthroughProgress(currentUsername, currentUserProgress);
  }

  getStoredProgressForCurrentTask = () => {
    const {
      threadProgress: { data },
      match: {
        params: { id, task },
      },
    } = this.props;
    if (!data || !data[id] || !data[id][task]) {
      return {};
    }
    return data[id][task];
  };

  updateStoredProgressForCurrentTask = (verificationState) => {
    const {
      updateWalkthroughProgress,
      threadProgress,
      thread: { data },
      match: {
        params: { id, task },
      },
    } = this.props;
    const currentUsername = window.localStorage.getItem("currentUserName");
    const oldProgress = Object.assign({}, threadProgress.data || {});
    if (!oldProgress[id]) {
      oldProgress[id] = {};
    }
    if (!oldProgress[id][task]) {
      oldProgress[id][task] = {};
    }
    const newCurrentProgress = Object.assign(
      {},
      oldProgress[id][task] || {},
      verificationState
    );
    oldProgress[id][task] = newCurrentProgress;

    // Update progress if the walkthrough has at least one step
    const totalSteps = this.getTotalSteps(data);
    if (totalSteps > 0) {
      const completedSteps = this.getCompletedSteps(oldProgress[id]);
      oldProgress[id].progress = Math.min(
        Math.floor((completedSteps / totalSteps) * 100),
        100
      );
      oldProgress[id].task = task;
    }

    updateWalkthroughProgress(currentUsername, oldProgress);
  };

  getVerificationsForTask = (task) => {
    if (!task || !task.blocks) {
      return [];
    }
    return task.blocks.reduce((acc, b, i) => {
      if (b instanceof WalkthroughStep) {
        return acc.concat(this.getVerificationsForStep(i, b));
      }
      if (b instanceof WalkthroughVerificationBlock) {
        return acc.concat(`${i}`);
      }
      return acc;
    }, []);
  };

  getVerificationsForStep = (stepId, step) => {
    if (!step.blocks) {
      return [];
    }
    const verificationIds = [];
    step.blocks.forEach((block, i) => {
      if (block instanceof WalkthroughVerificationBlock) {
        verificationIds.push(`${stepId}-${i}`);
      }
    });
    return verificationIds;
  };

  // Returns the total steps that a walkthrough has. The number of steps is defined by the
  // number of verifications it has. Because we only parse the actual walkthrough in render
  // we have to rely on a regular expression to get the number of verification annotations
  getTotalSteps = (data) => (data.match(/\[type=verification]/g) || []).length;

  // Iterates through the threadProgress object and count every `true` value on every task
  getCompletedSteps = (threadProgress) => {
    // We need to filter `progress` and `task` because they are appended to the same object
    const stepProgress = Object.keys(threadProgress).filter(
      (s) => s !== "progress" && s !== "task"
    );
    return stepProgress.reduce((acc, step) => {
      const successfulVerifications = Object.values(
        threadProgress[step]
      ).filter((s) => s).length;
      return acc + successfulVerifications;
    }, 0);
  };

  docsAttributesProgress = (attrs) => {
    let found = 0;
    const requirements = {
      1: ["spring-boot-url", "node-js-url"],
      "1A": ["spring-boot-url", "node-js-url"],
    };
    if (!(attrs["walkthrough-id"] in requirements)) {
      return 100;
    }
    for (let i = 0; i < requirements[attrs["walkthrough-id"]].length; i++) {
      if (attrs[requirements[attrs["walkthrough-id"]][i]] !== null) {
        found++;
      }
    }
    if (found === requirements[attrs["walkthrough-id"]].length) {
      return 100;
    }
    if (found === 0) {
      return 0;
    }
    return 100 * (found / requirements[attrs["walkthrough-id"]].length);
  };

  resourcesProgress = () => {
    let progress = 0;

    if (!this.props.thread.pending) {
      progress += 50;
    }

    if (!this.props.manifest.pending) {
      progress += 50;
    }

    return progress;
  };

  totalLoadingProgress = (attrs) =>
    Math.ceil(
      (this.resourcesProgress() + this.docsAttributesProgress(attrs)) / 2
    );

  getDocsAttributes = (walkthroughId) =>
    getDocsForWalkthrough(
      walkthroughId,
      this.props.middlewareServices,
      this.props.walkthroughResources
    );

  getAMQCredential = (middlewareServices, name) => {
    if (
      !middlewareServices ||
      !middlewareServices.amqCredentials ||
      !middlewareServices.amqCredentials[name]
    ) {
      return null;
    }
    return middlewareServices.amqCredentials[name];
  };

  backToIntro = (e) => {
    e.preventDefault();
    const {
      history,
      match: {
        params: { id },
      },
    } = this.props;
    history.push(`/tutorial/${id}`);
  };

  goToTask = (e, next) => {
    e.preventDefault();
    this.setState({
      taskStatus: ""
    });
    const {
      history,
      match: {
        params: { id },
      },
    } = this.props;
    history.push(`/tutorial/${id}/task/${next}`);
  };

  exitTutorial = (e) => {
    e.preventDefault();
    this.setState({
      taskStatus: ""
    });
    const { history } = this.props;
    history.push(`/congratulations/${this.props.thread.data.id}`);
  };

  handleVerificationInput = (e, id, isSuccess) => {
    const o = Object.assign({}, this.getStoredProgressForCurrentTask());
    o[id] = isSuccess;
    this.updateStoredProgressForCurrentTask(o);
  };

  taskVerificationStatus = (verifications, idsToVerify) => {
    if (!idsToVerify || idsToVerify.length === 0) {
      return true;
    }
    // eslint-disable-next-line no-unused-vars
    for (const verificationId of idsToVerify) {
      if (!verifications[verificationId]) {
        return false;
      }
    }
    return true;
  };

  renderVerificationBlock(blockId, block) {
    const { t } = this.props;
    const currentThreadProgress = this.getStoredProgressForCurrentTask();
    const isNoChecked =
      currentThreadProgress[blockId] !== undefined &&
      !currentThreadProgress[blockId];
    const isYesChecked =
      currentThreadProgress[blockId] !== undefined &&
      !!currentThreadProgress[blockId];

    let verificationClasses =
      "pf-c-alert pf-m-info pf-m-inline pf-u-mt-md integr8ly-m-alert";
    let verificationLabel = "Alert";
    let verificationIcon = "fa fa-circle-o";
    if (isYesChecked) {
      verificationClasses =
        "pf-c-alert pf-m-success pf-m-inline pf-u-mt-md integr8ly-m-alert";
      verificationIcon = "fas fa-check-circle";
      verificationLabel = "Alert success";
    }
    if (isNoChecked) {
      verificationClasses =
        "pf-c-alert pf-m-danger pf-m-inline pf-u-mt-md integr8ly-m-alert";
      verificationIcon = "fas fa-times-circle";
      verificationLabel = "Alert fail";
    }
    const verifyThroughApp =  block.html.indexOf("verify-through-app") > -1;
    // this.setState({
    //   verifyThroughApp
    // });
    if (verifyThroughApp) {
      if (this.state.taskStatus === "Success") {
        // this.handleVerificationInput(null, blockId, true);
        return (
          <Alert isInline variant="success" title="Task completed">
            <p>
              You can move onto the next task.
            </p>
          </Alert>
        )
      } else if (this.state.taskStatus === "Failed") {
        // this.handleVerificationInput(null, blockId, false);
        return (
          <Alert isInline variant="danger" title="Task not completed">
            <p>
              Complete the task before moving onto the next task.
            </p>
          </Alert>
        )
      } else {
        return null;
      }
    }
    return (
      <div
        className={verificationClasses}
        key={`verification-${blockId}`}
        aria-label={verificationLabel}
      >
        <div className="pf-c-alert__icon">
          <i className={verificationIcon} aria-hidden="true" />
        </div>
        <h4 className="pf-c-alert__title">
          <span className="pf-screen-reader">
            {t("task.verificationTitle")}
          </span>
          {t("task.verificationTitle")}
        </h4>
        <div className="pf-c-alert__description">
          <span dangerouslySetInnerHTML={{ __html: block.html }} />
          {
            <React.Fragment>
              <Form>
                <FormGroup
                  fieldId="radio"
                  disabled={false}
                  label="Check your work"
                >
                  <Radio
                    id={`${blockId}verificationYes`}
                    name={`${blockId}Yes`}
                    className="integr8ly-task-radio-btn"
                    isChecked={isYesChecked}
                    onChange={(e) => {
                      this.handleVerificationInput(e, blockId, true);
                    }}
                    label="Yes"
                  />
                  <Radio
                    id={`${blockId}verificationNo`}
                    name={`${blockId}No`}
                    className="integr8ly-task-radio-btn"
                    isChecked={isNoChecked}
                    onChange={(e) => {
                      this.handleVerificationInput(e, blockId, false);
                    }}
                    label="No"
                  />
                  {isNoChecked && block.hasFailBlock && (
                    <div
                      dangerouslySetInnerHTML={{ __html: block.failBlock.html }}
                    />
                  )}
                  {isYesChecked && block.hasSuccessBlock && (
                    <div
                      dangerouslySetInnerHTML={{
                        __html: block.successBlock.html,
                      }}
                    />
                  )}
                </FormGroup>
              </Form>
            </React.Fragment>
          }
        </div>
      </div>
    );
  }

  renderStepBlock(id, block) {
    if (block instanceof WalkthroughTextBlock) {
      return (
        <React.Fragment key={id}>
          <div dangerouslySetInnerHTML={{ __html: block.html }} />
        </React.Fragment>
      );
    }
    if (block instanceof WalkthroughVerificationBlock) {
      return this.renderVerificationBlock(`${id}`, block);
    }
    if (block instanceof WalkthroughStep) {
      return (
        <React.Fragment key={id}>
          <h2 className="pf-c-title pf-m-lg">{block.title}</h2>
          {block.blocks.map((b, i) => (
            <React.Fragment key={`${id}-${i}`}>
              {b instanceof WalkthroughTextBlock && (
                <div dangerouslySetInnerHTML={{ __html: b.html }} />
              )}
              {b instanceof WalkthroughVerificationBlock &&
                this.renderVerificationBlock(`${id}-${i}`, b)}
            </React.Fragment>
          ))}
        </React.Fragment>
      );
    }
    return null;
  }

  render() {
    const {
      middlewareServices,
      match: {
        params: { id, task },
      },
    } = this.props;
    const attrs = this.getDocsAttributes(id);
    const { t, thread, manifest } = this.props;
    if (thread.error || manifest.error) {
      return (
        <div>
          <RoutedConnectedMasthead />
          <ErrorScreen
            errorText={thread.errorMessage || manifest.errorMessage}
          />
        </div>
      );
    }
    if (
      thread.fulfilled &&
      manifest.fulfilled &&
      thread.data &&
      thread.id === id
    ) {
      const taskNum = parseInt(task, 10);
      const parsedAttrs = Object.assign({}, getDefaultAdocAttrs(id), attrs);
      const parsedThread = parseWalkthroughAdoc(thread.data, parsedAttrs);
      const threadTask = parsedThread.tasks[taskNum];
      const totalTasks = parsedThread.tasks.filter(
        (parsedTask) => !parsedTask.isVerification
      ).length;
      const taskVerificationComplete = this.taskVerificationStatus(
        this.getStoredProgressForCurrentTask(),
        this.getVerificationsForTask(threadTask)
      );

      const currentThreadProgress = this.getStoredProgressForCurrentTask();
      const combinedResources = parsedThread.resources.concat(
        threadTask.resources
      );
      const { drawerOpen, setDrawerOpen, setFullScreen } = this.props.drawerContext;
      const onTaskClick = () => {
        if (drawerOpen) {
          setDrawerOpen(false);
          // setFullScreen(null, false);
        }
      }
      return (
        <React.Fragment>
          <Page /*className="pf-u-h-100vh"*/>
            <SkipToContent href="#main-content">Skip to content</SkipToContent>
            {/* <RoutedConnectedMasthead /> */}
            <PageSection variant="light" style={{ backgroundColor: 'yellow' }}>
              <Split>
                <SplitItem>
                  <Breadcrumb
                    threadName={parsedThread.title}
                    threadId={id}
                    taskPosition={taskNum + 1}
                    totalTasks={totalTasks}
                    homeClickedCallback={() => {}}
                    isAllSolutionPattern
                    drawerOpen={drawerOpen}
                    onTaskClick={onTaskClick}
                  />
                </SplitItem>
                <SplitItem isFilled></SplitItem>
              </Split>
            </PageSection>
            <PageSection className="integr8ly-landing-page-tutorial-dashboard-section" style={drawerOpen ? { display: 'none' } : { display: 'block'}}>
              <Grid hasGutter>
                <GridItem sm={12} md={drawerOpen ? 12 : 9}>
                  <Card className="integr8ly-c-card--content pf-u-p-lg pf-u-mb-xl">
                    <TextContent>
                      <div className="integr8ly-module-column pf-u-pb-sm">
                        <h1
                          id="main-content"
                          className="pf-c-title pf-m-xl pf-u-mt-0"
                        >
                          {threadTask.title}
                        </h1>
                        <div
                          className="integr8ly-module-column--steps"
                          ref={this.rootDiv}
                        >
                          {threadTask.steps.map((step, i) =>
                            this.renderStepBlock(i, step)
                          )}
                        </div>
                      </div>
                    </TextContent>
                  </Card>
                </GridItem>
                <GridItem
                  sm={12}
                  md={drawerOpen ? 12 : 3}
                  rowSpan={2}
                  className="integr8ly-module-frame pf-u-display-none pf-u-display-block-on-md"
                >
                  {/* <h4 className="integr8ly-helpful-links-heading">Walkthrough Diagram</h4>
                  <img src="/images/st0.png" className="img-responsive" alt="integration" /> */}
                  <WalkthroughResources resources={combinedResources} />
                </GridItem>
              </Grid>
              {/* The div below is needed for automated testing with Nightwatch.js */}
              <div id="pushIntoView" />
            </PageSection>
            <PageSection style={drawerOpen ? { display: 'none' } : { display: 'block'}}>
              {/* Bottom footer */}
              <div className="integr8ly-module-column--footer pf-u-w-100 pf-u-pl-2xl">
                <TextContent>
                  <Text component={TextVariants.h4} className="pf-u-my-md">
                    {t("task.CompleteAndCheck")}
                  </Text>
                  <div className="pf-u-mb-lg">
                    {taskNum === 0 && (
                      <Button
                        id="introReturn"
                        variant="secondary"
                        type="button"
                        onClick={(e) => this.backToIntro(e)}
                      >
                        {t("task.backToIntro")}
                      </Button>
                    )}
                    {taskNum > 0 && (
                      <Button
                        id="previousPartWalkthrough"
                        variant="secondary"
                        type="button"
                        onClick={(e) => this.goToTask(e, taskNum - 1)}
                      >
                        {t("task.previousTask")}
                      </Button>
                    )}
                    <span className="integr8ly-module-column--footer_status pf-u-ml-sm pf-u-mr-lg">
                      {this.getVerificationsForTask(threadTask).map(
                        (verificationId, i) => (
                          <React.Fragment key={i}>
                            {/* Bottom footer icon */}
                            {currentThreadProgress[verificationId] ===
                            undefined ? (
                              <OutlinedCircleIcon
                                className="integr8ly-module-column--footer_status icon pf-u-ml-md pf-u-pr-sm"
                                key={`verification-icon-${verificationId}`}
                              />
                            ) : currentThreadProgress[verificationId] ? (
                              <CheckCircleIcon
                                className={
                                  currentThreadProgress[verificationId]
                                    ? "integr8ly-module-column--footer_status-checked icon pf-u-ml-md pf-u-pr-sm"
                                    : "integr8ly-module-column--footer_status-unchecked icon pf-u-ml-md pf-u-pr-sm"
                                }
                                key={`verification-icon-${verificationId}`}
                              />
                            ) : (
                              <TimesCircleIcon
                                className={
                                  currentThreadProgress[verificationId]
                                    ? "integr8ly-module-column--footer_status-checked icon pf-u-ml-md pf-u-pr-sm"
                                    : "integr8ly-module-column--footer_status-unchecked icon pf-u-ml-md pf-u-pr-sm"
                                }
                                key={`verification-icon-${verificationId}`}
                              />
                            )}
                            {/* Bottom footer number to the right of icon  */}
                            {currentThreadProgress[verificationId] ===
                            undefined ? (
                              <span
                                className="integr8ly-module-column--footer_status"
                                key={`verification-id-${verificationId}`}
                              >
                                {threadTask.steps.length === 1
                                  ? parseInt(task, 10) + 1
                                  : `${parseInt(task, 10) + 1}.${
                                      parseInt(i, 10) + 1
                                    }`}
                              </span>
                            ) : (
                              <span
                                className={
                                  currentThreadProgress[verificationId]
                                    ? "integr8ly-module-column--footer_status-checked"
                                    : "integr8ly-module-column--footer_status-unchecked"
                                }
                                key={`verification-id-${verificationId}`}
                              >
                                {threadTask.steps.length === 1
                                  ? parseInt(task, 10) + 1
                                  : `${parseInt(task, 10) + 1}.${
                                      parseInt(i, 10) + 1
                                    }`}
                              </span>
                            )}
                          </React.Fragment>
                        )
                      )}
                    </span>
                    {taskNum + 1 < totalTasks && (
                      <Button
                        id="nextPartWalkthrough"
                        variant={
                          taskVerificationComplete ? "primary" : "secondary"
                        }
                        type="button"
                        onClick={(e) => this.goToTask(e, taskNum + 1)}
                        isDisabled={this.state.taskStatus ? this.state.taskStatus !== "Success" : !taskVerificationComplete}
                      >
                        {t("task.nextTask")}
                      </Button>
                    )}
                    {taskNum + 1 === totalTasks && (
                      <Button
                        id="nextPartWalkthrough"
                        variant={
                          taskVerificationComplete ? "primary" : "secondary"
                        }
                        type="button"
                        onClick={(e) => this.exitTutorial(e)}
                        isDisabled={this.state.taskStatus ? this.state.taskStatus !== "Success" : !taskVerificationComplete}
                      >
                        {t("task.exitTutorial")}
                      </Button>
                    )}
                  </div>
                </TextContent>
              </div>
            </PageSection>
          </Page>
        </React.Fragment>
      );
    }
    const svcNamesToWatch = get(
      manifest,
      "data.dependencies.managedServices",
      []
    ).map((svc) => svc.name);
    const svcToWatch = findServices(
      svcNamesToWatch,
      Object.values(middlewareServices.data)
    );
    return (
      <ProvisioningScreen
        message="Provisioning additional services."
        provisioningServices={svcToWatch || []}
      />
    );
  }
}

TaskPage.propTypes = {
  // i18n: PropTypes.object,
  t: PropTypes.func.isRequired,
  history: PropTypes.shape({
    push: PropTypes.func.isRequired,
  }),
  match: PropTypes.shape({
    params: PropTypes.object,
  }),
  middlewareServices: PropTypes.object,
  thread: PropTypes.object,
  manifest: PropTypes.object,
  // user: PropTypes.object,
  getWalkthrough: PropTypes.func,
  prepareCustomWalkthrough: PropTypes.func,
  provisionWalkthroughV4: PropTypes.func,
  updateWalkthroughProgress: PropTypes.func,
  threadProgress: PropTypes.object,
  walkthroughResources: PropTypes.object,
  drawerContext: PropTypes.object,
};

TaskPage.defaultProps = {
  // i18n: {
  //   language: 'en'
  // },
  history: {
    push: noop,
  },
  match: {
    params: {},
  },
  middlewareServices: {
    data: {},
    amqCredentials: {},
    enmasseCredentials: {},
  },
  prepareCustomWalkthrough: noop,
  provisionWalkthroughV4: noop,
  thread: null,
  manifest: null,
  // user: null,
  getWalkthrough: noop,
  updateWalkthroughProgress: noop,
  threadProgress: { data: {} },
  walkthroughResources: {},
};

const TaskPageOuter = (props) => {
  const drawerContext = React.useContext(AppDrawerContext);
  return <TaskPage {...props} drawerContext={drawerContext} />;
};

const mapDispatchToProps = (dispatch) => ({
  getThread: (language, id) =>
    dispatch(reduxActions.threadActions.getThread(language, id)),
  getProgress: () => dispatch(reduxActions.userActions.getProgress()),
  prepareCustomWalkthrough: (id, attrs) =>
    prepareCustomWalkthroughNamespace(dispatch, id, attrs),
  provisionWalkthroughV4: (id, attrs) =>
    prepareWalkthroughV4(dispatch, id, attrs),
  setProgress: (progress) =>
    dispatch(reduxActions.userActions.setProgress(progress)),
  getWalkthrough: (id) =>
    dispatch(reduxActions.threadActions.getCustomThread(id)),
  updateWalkthroughProgress: (username, progress) =>
    dispatch(
      reduxActions.threadActions.updateThreadProgress(username, progress)
    ),
});

const mapStateToProps = (state) => ({
  ...state.threadReducers,
  ...state.middlewareReducers,
  ...state.userReducers,
  ...state.walkthroughServiceReducers,
});

const ConnectedTaskPage = withRouter(
  connect(mapStateToProps, mapDispatchToProps)(translate()(TaskPageOuter))
);

export { ConnectedTaskPage as default, ConnectedTaskPage, TaskPageOuter };
