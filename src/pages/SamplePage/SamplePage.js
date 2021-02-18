import React, { useEffect } from 'react';
import { withRouter } from 'react-router-dom';

import { Main } from '@redhat-cloud-services/frontend-components/Main';
import {
  PageHeader,
  PageHeaderTitle,
} from '@redhat-cloud-services/frontend-components/PageHeader';
import LandingPage from '../../pages/landing/landingPage';
import { MkUi } from '../tutorial/task/MkUi';

import './sample-page.scss';

/**
 * A smart component that handles all the api calls and data needed by the dumb components.
 * Smart components are usually classes.
 *
 * https://reactjs.org/docs/components-and-props.html
 * https://medium.com/@thejasonfile/dumb-components-and-smart-components-e7b33a698d43
 */
const SamplePage = () => {
  useEffect(() => {
    insights?.chrome?.appAction?.('sample-page');
  }, []);

  return (
    <React.Fragment>
      <PageHeader>
        <PageHeaderTitle title="Sample Insights App" />
        <p>This is page header text </p>
      </PageHeader>
      <Main style={{ height: '100%'}}>
        {/* <LandingPage /> */}
        <MkUi />
      </Main>
    </React.Fragment>
  );
};

export default withRouter(SamplePage);
