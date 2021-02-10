import { Redirect, Route, Switch } from 'react-router-dom';

import PropTypes from 'prop-types';
import React, { Suspense, lazy } from 'react';
import { Bullseye, Spinner } from '@patternfly/react-core';

const SamplePage = lazy(() => import('./pages/SamplePage/SamplePage'));
const TutorialPage = lazy(() => import('./pages/tutorial/tutorial'));
const TaskPage = lazy(() => import('./pages/tutorial/task/task'));

export const Routes = () => (
  <Suspense
    fallback={
      <Bullseye>
        <Spinner />
      </Bullseye>
    }
  >
    <Switch>
      <Route path="/sample" component={SamplePage} />
      <Route path="/tutorial/:id" exact component={TutorialPage} />
      <Route path="/tutorial/:id/task/:task/:step?" component={TaskPage} />
      {/* Finally, catch all unmatched routes */}
      <Route>
        <Redirect to="/sample" />
      </Route>
    </Switch>
  </Suspense>
);

Routes.propTypes = {
  childProps: PropTypes.shape({
    history: PropTypes.shape({
      push: PropTypes.func,
    }),
  }),
};
