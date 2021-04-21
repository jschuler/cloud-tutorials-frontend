import React from 'react';
import { BrowserRouter as Router, Route } from 'react-router-dom';
import App from './App';
import { Catalog } from './Catalog';
import { Tutorial } from './Tutorial';
import { Tasks } from './Tasks';
import {
  QuickStart,
  QuickStartContext,
  useLocalStorage,
  useValuesForQuickStartContext,
} from "@cloudmosaic/quickstarts";
import { QsCatalog } from './QsCatalog';
import { loadJSONTutorials } from "./tutorialLoader";

const AppEntry = () => {
  // qs
  const [activeQuickStartID, setActiveQuickStartID] = useLocalStorage(
    "quickstartId",
    ""
  );
  const [allQuickStartStates, setAllQuickStartStates] = useLocalStorage(
    "quickstarts",
    {}
  );
  const checkStates = (a: any) => {
    const asd = setAllQuickStartStates(a);
    debugger;
    // handleClick();
  } 
  const [allQuickStartsLoaded, setAllQuickStartsLoaded] = React.useState<boolean>(false);
  const [tutorials, setTutorials] = React.useState<QuickStart[]>([]);

  React.useEffect(() => {
    const load = async () => {
      const allTutorials = await loadJSONTutorials("/mosaic/cloud-tutorials");
      setTutorials(allTutorials);
    };
    load();
  }, []);

  const valuesForQuickstartContext = useValuesForQuickStartContext({
    activeQuickStartID,
    setActiveQuickStartID,
    allQuickStartStates,
    setAllQuickStartStates/*: checkStates*/,
    allQuickStarts: tutorials,
    useQueryParams: false,
    footer: {
      showAllLink: false
    }
  });
  // qs emd
  return (
    <QuickStartContext.Provider value={valuesForQuickstartContext}>
    <Router basename="/mosaic/cloud-tutorials">
      <Route exact path="/">
        <App>
          <Catalog />
        </App>
      </Route>
      <Route exact path="/:name">
        <App>
          <Tutorial />
        </App>
      </Route>
      <Route exact path="/:name/:task">
        <App>
          <Tasks />
        </App>
      </Route>
    </Router>
    </QuickStartContext.Provider>
)};

export default AppEntry;
