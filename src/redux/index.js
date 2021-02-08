import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import promiseMiddleware from 'redux-promise-middleware';
import notificationsMiddleware from '@redhat-cloud-services/frontend-components-notifications/notificationsMiddleware';
import { connect } from 'react-redux';
import store from './store';
import thunkMiddleware from 'redux-thunk';
import reduxActions from './actions';
import reduxMiddleware from './middleware';
import reduxReducers from './reducers';
import reduxTypes from './constants';

export { connect, reduxActions, reduxMiddleware, reduxReducers, reduxTypes, store };
let registry;

export function init() {
  registry = getRegistry({}, [
    promiseMiddleware,
    notificationsMiddleware({ errorDescriptionKey: ['detail', 'stack'] }),
    thunkMiddleware,
    reduxMiddleware.status(),
    promiseMiddleware
  ]);
  return registry;
}

export function getStore() {
  return registry.getStore();
}

export function register(...args) {
  return registry.register(...args);
}
