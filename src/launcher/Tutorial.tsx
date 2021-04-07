import React from "react";
import {
  PageSection,
  PageSectionVariants,
  TextContent,
  Text,
  Button,
  TextList,
  TextListItem,
} from "@patternfly/react-core";
import { QuickStart } from "@cloudmosaic/quickstarts";
import { useHistory, useParams } from "react-router-dom";
import { removeParagraphWrap } from "./utils";
import FormRenderer from "@data-driven-forms/react-form-renderer/form-renderer";
import componentTypes from "@data-driven-forms/react-form-renderer/component-types";
import FormTemplate from "@data-driven-forms/pf4-component-mapper/form-template";
import TextField from "@data-driven-forms/pf4-component-mapper/text-field";
import "./asciidoctor-skins/adoc-github.css";

declare const QUICKSTARTS_BASE: string;
declare const TUTORIALS_BASE: string;

export const Tutorial = () => {
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

  let form;
  // @ts-ignore
  if (tutorial && tutorial.spec.form) {
    const componentMapper = {
      [componentTypes.TEXT_FIELD]: TextField,
    };
    form = (
      <FormRenderer
        FormTemplate={FormTemplate}
        componentMapper={componentMapper}
        // @ts-ignore
        schema={tutorial.spec.form}
        onSubmit={console.log}
      />
    );
  }

  return tutorial ? (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">
            {removeParagraphWrap(tutorial.spec.displayName)}
          </Text>
          <div
            dangerouslySetInnerHTML={{ __html: tutorial.spec.description }}
          />
        </TextContent>
      </PageSection>
      <PageSection>
        <div
          dangerouslySetInnerHTML={{ __html: tutorial.spec.introduction || "" }}
        />
      </PageSection>
      {tutorial.spec.prerequisites && (
        <PageSection>
          <TextContent>
            <Text component="h2">Prerequisites</Text>
            <TextList>
              {tutorial.spec.prerequisites.map((prereq, index) => (
                <TextListItem key={index}>
                  {removeParagraphWrap(prereq)}
                </TextListItem>
              ))}
            </TextList>
          </TextContent>
        </PageSection>
      )}
      {form && (
        <PageSection>
          <TextContent>
            <Text component="h2">The following fields are required before we get started</Text>
            {form}
          </TextContent>
        </PageSection>
      )}
      <Button variant="primary" onClick={() => handleClick(`/${name}/1`)}>
        Start tutorial
      </Button>
    </>
  ) : null;
};
