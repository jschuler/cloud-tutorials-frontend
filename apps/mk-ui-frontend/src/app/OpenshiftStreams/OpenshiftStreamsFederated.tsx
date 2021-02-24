import React from 'react';
import { OpenshiftStreams } from './OpenshiftStreams';
import { AuthContext, IAuthContext } from '@app/auth/AuthContext';
import { KafkaRequest } from '../../openapi';
import { AlertVariant } from '@patternfly/react-core';
import { AlertContext, AlertContextProps } from '@app/components/Alerts/Alerts';
import { ApiContext } from '@app/api/ApiContext';
import { BrowserRouter } from 'react-router-dom';
import '../../i18n/i18n';
import '@cloudmosaic/quickstarts/dist/quickstarts.css';
import './styles.css';
import {
  QuickStartDrawer,
  QuickStartContext,
  useValuesForQuickStartContext,
  useLocalStorage,
} from '@cloudmosaic/quickstarts';
// @ts-ignore
import example from './quickstarts/create-kafka-instance.yaml';

// Version of OpenshiftStreams for federation

export type OpenshiftStreamsFederatedProps = {
  getToken: () => Promise<string>;
  getUsername: () => Promise<string>;
  onConnectToInstance: (data: KafkaRequest) => void;
  addAlert: (message: string, variant?: AlertVariant) => void;
  basePath: string;
  quickstartId?: string;
  quickstartState?: any;
  onQuickstartChange?: (value: any) => void;
  onQuickstartClose?: (value: any) => void;
};

const OpenshiftStreamsFederated = ({
  getUsername,
  getToken,
  onConnectToInstance,
  addAlert,
  basePath,
  quickstartId = '',
  quickstartState = {},
  onQuickstartChange,
  onQuickstartClose
}: OpenshiftStreamsFederatedProps) => {
  const authContext = {
    getToken,
    getUsername,
  } as IAuthContext;

  const alertContext = {
    addAlert,
  } as AlertContextProps;

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
      return onQuickstartClose(activeQuickStartID);
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
    // TODO don't add BrowserRouter here - see  https://github.com/bf2fc6cc711aee1a0c2a/mk-ui-frontend/issues/74
    <BrowserRouter>
      <ApiContext.Provider
        value={{
          basePath: basePath,
        }}
      >
        <AlertContext.Provider value={alertContext}>
          <AuthContext.Provider value={authContext}>
            <QuickStartContext.Provider value={valuesForQuickstartContext}>
              <QuickStartDrawer>
                <OpenshiftStreams onConnectToInstance={onConnectToInstance}></OpenshiftStreams>
              </QuickStartDrawer>
            </QuickStartContext.Provider>
          </AuthContext.Provider>
        </AlertContext.Provider>
      </ApiContext.Provider>
    </BrowserRouter>
  );
};

export default OpenshiftStreamsFederated;
