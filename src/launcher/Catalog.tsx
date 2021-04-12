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
  Label,
} from "@patternfly/react-core";
import { OutlinedClockIcon } from "@patternfly/react-icons";
import { useHistory } from "react-router-dom";
import { QuickStart } from "@cloudmosaic/quickstarts";
import { loadJSONTutorials } from "./tutorialLoader";
// @ts-ignore
import logo from "../images/illustration_rhel-isometric.svg";

export const Catalog: React.FC = () => {
  const history = useHistory();
  const handleClick = (path: string) => history.push(path);

  const [tutorials, setTutorials] = React.useState<QuickStart[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const allTutorials = await loadJSONTutorials("/mosaic/cloud-tutorials");
      setTutorials(allTutorials);
    };
    load();
  }, []);

  return (
    <>
      <PageSection variant={PageSectionVariants.light}>
        <TextContent>
          <img
            src={logo}
            alt="Red Hat Enterprise Linux isometric illustration"
            className="tut-img-fluid"
          />
          <Text component="h1" className="tut-main-title">
            Cloud tutorials
          </Text>
          <Text component="p" className="tut-main-intro">
            Follow along with an interactive tutorial
          </Text>
        </TextContent>
      </PageSection>
      <PageSection>
        <Gallery hasGutter>
          {tutorials.map((tutorial, i) => (
            <GalleryItem key={i}>
              <Card
                isHoverable
                onClick={() => handleClick(`/${tutorial.metadata.name}`)}
                style={{ height: "100%" }}
              >
                <CardTitle>
                  <div>{tutorial.spec.displayName}</div>
                  <div>
                    <Label
                      variant="outline"
                      icon={<OutlinedClockIcon />}
                      style={{
                        marginTop: '8px',
                        marginLeft: '-5px'
                      }}
                    >
                      {tutorial.spec.durationMinutes} minutes
                    </Label>
                  </div>
                </CardTitle>
                <CardBody>
                  <div
                    dangerouslySetInnerHTML={{
                      __html: tutorial.spec.description,
                    }}
                  />
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
