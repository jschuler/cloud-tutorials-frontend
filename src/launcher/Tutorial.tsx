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
import { useHistory, useParams } from "react-router-dom";
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
    fetch(`${TUTORIALS_BASE}/${name}.tutorial.json`)
      .then((res) => res.json())
      .then((json) => {
        setTutorial(json);
      });
  }, []);

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
        onClick={() => handleClick(`/tutorials/${name}/tasks`)}
      >
        Start tutorial
      </Button>
    </>
  ) : null;
};
