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
import { QuickStart } from "@patternfly/quickstarts";
import { loadJSONTutorials } from "./tutorialLoader";
// @ts-ignore
import logo from "./images/illustration_rhel-isometric.svg";
import {
  QuickStartContext,
  useLocalStorage,
  useValuesForQuickStartContext,
  LoadingBox,
  QuickStartsLoader,
} from "@patternfly/quickstarts";
import { QsCatalog } from "./QsCatalog";

export const Catalog: React.FC = () => {
  const history = useHistory();
  const handleClick = (path: string) => history.push(path);

  // const [activeQuickStartID, setActiveQuickStartID] = useLocalStorage(
  //   "quickstartId",
  //   ""
  // );
  // const [allQuickStartStates, setAllQuickStartStates] = useLocalStorage(
  //   "quickstarts",
  //   {}
  // );
  // const checkStates = (a: any) => {
  //   const asd = setAllQuickStartStates(a);
  //   debugger;
  //   // handleClick();
  // }
  // const [allQuickStartsLoaded, setAllQuickStartsLoaded] = React.useState<boolean>(false);
  // const [tutorials, setTutorials] = React.useState<QuickStart[]>([]);

  // React.useEffect(() => {
  //   const load = async () => {
  //     const allTutorials = await loadJSONTutorials("/apps/cloud-tutorials");
  //     setTutorials(allTutorials);
  //   };
  //   load();
  // }, []);

  // const valuesForQuickstartContext = useValuesForQuickStartContext({
  //   activeQuickStartID,
  //   setActiveQuickStartID,
  //   allQuickStartStates,
  //   setAllQuickStartStates: checkStates,
  //   allQuickStarts: tutorials,
  //   useQueryParams: false,
  //   footer: {
  //     showAllLink: false
  //   }
  // });

  return (
    <QuickStartsLoader>
      {(quickStarts: QuickStart[], loaded: boolean) => {
        return loaded && quickStarts.length ? (
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
            <QsCatalog quickStarts={quickStarts} />
          </>
        ) : (
          <LoadingBox />
        );
      }}
    </QuickStartsLoader>
  );
};
