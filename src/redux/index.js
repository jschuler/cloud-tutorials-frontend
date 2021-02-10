import { getRegistry } from '@redhat-cloud-services/frontend-components-utilities/Registry';
import {createStore, applyMiddleware} from 'redux';
import promiseMiddleware from 'redux-promise-middleware';
import { connect } from 'react-redux';
import store from './store';
import thunkMiddleware from 'redux-thunk';
import reduxActions from './actions';
import reduxMiddleware from './middleware';
import reduxReducers from './reducers';
import reduxTypes from './constants';

export { connect, reduxActions, reduxMiddleware, reduxReducers, reduxTypes, store };

