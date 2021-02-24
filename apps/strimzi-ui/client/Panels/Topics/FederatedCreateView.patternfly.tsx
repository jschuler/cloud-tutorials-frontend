/*
 * Copyright Strimzi authors.
 * License: Apache License 2.0 (see the file LICENSE or http://apache.org/licenses/LICENSE-2.0.html).
 */
import React, { FunctionComponent } from 'react';
import './style.scss';
import { LoggingProvider } from '../../Contexts/Logging';
import {
  ConfigFeatureFlagProvider,
  FeatureFlag,
} from '../../Contexts/ConfigFeatureFlag';
import { ApolloProvider } from '@apollo/client';
import { getApolloClient } from '../../Bootstrap/GraphQLClient/GraphQLClient';
import { PageSection, PageSectionVariants } from '@patternfly/react-core';
import { setContext } from '@apollo/client/link/context';
import { CreateTopicWizard } from '../../Elements/Components/CreateTopic/CreateTopicWizard.patternfly';
import '@cloudmosaic/quickstarts/dist/quickstarts.css';
import './styles.css';
import {
  QuickStartDrawer,
  QuickStartContext,
  useValuesForQuickStartContext,
  useLocalStorage,
} from '@cloudmosaic/quickstarts';
// @ts-ignore
import example from './quickstarts/create-topic.yaml';

export type FederatedCreateTopicProps = {
  getApiOpenshiftComToken: () => Promise<string>;
  getToken: () => Promise<string>;
  id: string;
  apiBasePath: string;
  onCloseCreateTopic: () => void;
  quickstartId?: string;
  quickstartState?: any;
  onQuickstartChange?: (value: any) => void;
  onQuickstartClose?: (value: any) => void;
  onSaveTopic?: any;
};

const FederatedCreateTopic: FunctionComponent<FederatedCreateTopicProps> = ({
  id,
  getApiOpenshiftComToken,
  getToken,
  apiBasePath,
  onCloseCreateTopic,
  quickstartId = '',
  quickstartState = {},
  onQuickstartChange,
  onQuickstartClose,
  onSaveTopic
}) => {
  const authLink = setContext(async () => {
    return {
      headers: {
        authorization: await getToken(),
        'X-Api-Openshift-Com-Token': await getApiOpenshiftComToken(),
        'X-Kafka-Id': id,
      },
    };
  });

  const setIsCreateTopic = (b: boolean) => {
    if (!b) {
      onCloseCreateTopic();
    }
  };

  const allQuickStarts = [example];
  const [activeQuickStartID, setActiveQuickStartID] = React.useState(quickstartId);
  const [allQuickStartStates, setAllQuickStartStates] = React.useState(quickstartState);
  const onChangeQuickStartState = (valueFnc) => {
    setAllQuickStartStates(valueFnc(allQuickStartStates));
    onQuickstartChange && onQuickstartChange(valueFnc(allQuickStartStates));
  }
  // setActiveQuickStartID((id) => (id !== quickStartId ? quickStartId : ""));
  const fedOnQuickstartClose = (valueFnc) => {
    if (!valueFnc(activeQuickStartID)) {
      // User pressed close button
      return onQuickstartClose ? onQuickstartClose(activeQuickStartID) : null;
    }
    return setActiveQuickStartID(valueFnc(activeQuickStartID));
  }
  const valuesForQuickstartContext = useValuesForQuickStartContext({
    allQuickStarts,
    activeQuickStartID,
    setActiveQuickStartID: fedOnQuickstartClose,
    allQuickStartStates,
    setAllQuickStartStates: onChangeQuickStartState,
  });

  return (
    <ApolloProvider
      client={getApolloClient({
        middlewares: [authLink],
        basePath: apiBasePath,
      })}
    >
      {/* <ConfigFeatureFlagProvider> */}
        <LoggingProvider>
          {/* <FeatureFlag flag={'client.Pages.PlaceholderHome'}> */}
            <QuickStartContext.Provider value={valuesForQuickstartContext}>
              <QuickStartDrawer>
                <PageSection variant={PageSectionVariants.light}>
                  <CreateTopicWizard setIsCreateTopic={setIsCreateTopic} onSaveTopic={onSaveTopic} />
                </PageSection>
              </QuickStartDrawer>
            </QuickStartContext.Provider>
          {/* </FeatureFlag> */}
        </LoggingProvider>
      {/* </ConfigFeatureFlagProvider> */}
    </ApolloProvider>
  );
};

export { FederatedCreateTopic };

export default FederatedCreateTopic;
