import React from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Button,
  TextList,
  TextListItem,
  Bullseye,
  Alert,
} from "@patternfly/react-core";
import StreamIcon from "@patternfly/react-icons/dist/js/icons/stream-icon";
import { useHistory, useParams } from "react-router-dom";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import TextField from "@data-driven-forms/pf4-component-mapper/text-field";
import "./asciidoctor-skins/adoc-github.css";
import {
  QuickStart,
  QuickStartTaskStatus,
  QuickStartTaskReview,
  QuickStartTask,
  QuickStartContextValues,
  QuickStartContext,
} from "@cloudmosaic/quickstarts";

declare const QUICKSTARTS_BASE: string;
declare const TUTORIALS_BASE: string;

export const Tutorial = () => {
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
    startQuickStart,
  } = React.useContext<QuickStartContextValues>(QuickStartContext);
  const history = useHistory();
  // @ts-ignore
  const { name } = useParams();
  const handleClick = (path: string) => history.push(path);
  const [tutorial, setTutorial] = React.useState<QuickStart>();
  React.useEffect(() => {
    fetch(`${TUTORIALS_BASE}/${name}.json`)
      .then((res) => res.json())
      .then((json) => {
        setTutorial(json);
      });
  }, []);

  // @ts-ignore
  const onFormSubmit = (values, formApi) => {
    console.log(values);
    if (allQuickStarts) {
      const qs = allQuickStarts.find((qs) => qs.metadata.name === name);
      if (qs) {
        startQuickStart && startQuickStart(name, qs?.spec?.tasks?.length);
      }
    }
    handleClick(`/${name}/1`);
  };
  let form;
  // @ts-ignore
  if (tutorial && tutorial.spec.form) {
    const componentMapper = {
      [componentTypes.TEXT_FIELD]: (props: any) => <TextField {...props} />,
      description: ({ component, name, label, text, ...props }: any) => {
        return (
          <h3 id={name} {...props}>
            {text}
          </h3>
        );
      },
    };
    form = (
      <FormRenderer
        FormTemplate={(props) => (
          <FormTemplate
            {...props}
            buttonsProps={{
              submit: {
                isLarge: true,
                label: "Start tutorial",
              },
            }}
            disableSubmit={["hasValidationErrors"]}
          />
        )}
        componentMapper={componentMapper}
        // @ts-ignore
        schema={tutorial.spec.form.schema}
        onSubmit={onFormSubmit}
      />
    );
  }

  return tutorial ? (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">{tutorial.spec.displayName}</Text>
          <Text
            component="h2"
            dangerouslySetInnerHTML={{ __html: tutorial.spec.description }}
          />
          <Text
            component="h3"
            dangerouslySetInnerHTML={{
              __html: tutorial.spec.introduction || "",
            }}
          />
        </TextContent>
      </PageSection>
      {tutorial.spec.prerequisites && (
        <PageSection variant={PageSectionVariants.light}>
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
      {form && (
        <PageSection variant={PageSectionVariants.light}>
          <TextContent>
            <Text component="h2">
              {/* @ts-ignore */}
              {tutorial.spec.form.title}
            </Text>
            {form}
          </TextContent>
        </PageSection>
      )}
      {!form && (
        <PageSection variant={PageSectionVariants.light}>
          <Alert
            customIcon={<StreamIcon />}
            variant="info"
            title="Launch the tutorial"
          >
            <Bullseye>
              <Button
                variant="primary"
                isLarge
                onClick={() => handleClick(`/${name}/1`)}
                className="tut-cta"
              >
                Start tutorial
              </Button>
            </Bullseye>
          </Alert>
        </PageSection>
      )}
    </>
  ) : null;
};
