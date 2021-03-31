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
  Button
} from "@patternfly/react-core";
import { useHistory } from 'react-router-dom';
import { QuickStart } from "@cloudmosaic/quickstarts";
import QuickStartMarkdownView from "../quickstarts/components/QuickStartMarkdownView";

declare const QUICKSTARTS_BASE: string;

export const Catalog: React.FC = () => {
  const history = useHistory();
  const handleClick = (path: string) => history.push(path);

  const [tutorials, setTutorials] = React.useState<QuickStart[]>([]);

  // TODO: grab all tutorials
  const path = 'quarkus.quickstart.json';
  React.useEffect(() => {
    fetch(`${QUICKSTARTS_BASE}/${path}`)
      .then((res) => res.json())
      .then((json) => {
        setTutorials([json]);
      });
  }, []);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <Text component="h1">Cloud tutorials</Text>
          <Text component="p">
            Follow along with an interactive tutorial
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Gallery hasGutter>
          {tutorials.map((tutorial, i) => (
            <GalleryItem key={i}>
              <Card isHoverable onClick={() => handleClick('/tutorial/quarkus-kafka')}>
                <CardTitle>
                  {tutorial.spec.displayName}
                </CardTitle>
                <CardBody>
                  <QuickStartMarkdownView content={tutorial.spec.description} />
                </CardBody>
                <CardFooter>
                  <Button variant="primary">Start</Button>
                </CardFooter>
            </Card>
            </GalleryItem>
          ))}
        </Gallery>
      </PageSection>
    </>
  );
};
