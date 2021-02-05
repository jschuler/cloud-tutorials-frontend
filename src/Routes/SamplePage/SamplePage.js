import React, { Suspense, lazy, useEffect } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';

import {
  Button,
  StackItem,
  Stack,
  Title,
  Spinner,
} from '@patternfly/react-core';
import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import { addNotification } from '@redhat-cloud-services/frontend-components-notifications/redux';
import TutorialPage from '../../Tutorial/src/pages/tutorial/tutorial';

const SampleComponent = lazy(() =>
  import('../../Components/SampleComponent/sample-component')
);

import './sample-page.scss';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
const SamplePage = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    insights?.chrome?.appAction?.('sample-page');
  }, []);

  const handleAlert = () => {
    dispatch(
      addNotification({
        variant: 'success',
        title: 'Notification title',
        description: 'notification description',
      })
    );
  };

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Sample Insights App" />
        <p> hello world This is page header text </p>
      </PageHeader>
      <Main>
        <TutorialPage />
      </Main>
    </React.Fragment>
  );
};

export default withRouter(SamplePage);
