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
import { loadJSONTutorials } from './tutorialLoader';
import { removeParagraphWrap } from './utils';

export const Catalog: React.FC = () => {
  const history = useHistory();
  const handleClick = (path: string) => history.push(path);

  const [tutorials, setTutorials] = React.useState<QuickStart[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const allTutorials = await loadJSONTutorials("/apps/cloud-tutorials/");
      setTutorials(allTutorials);
    };
    load();
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
              <Card isHoverable onClick={() => handleClick(`/${tutorial.metadata.name}`)}>
                <CardTitle>
                  {removeParagraphWrap(tutorial.spec.displayName)}
                </CardTitle>
                <CardBody>
                  <div dangerouslySetInnerHTML={{ __html: tutorial.spec.description }} />
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
