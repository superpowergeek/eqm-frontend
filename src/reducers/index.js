import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';
import error from './error';
import app from './app';
import main from './main';
import global from './global';
import framework from './framework';

const createRootReducer = (history) => combineReducers({
  router: connectRouter(history),
  app,
  main,
  global,
  framework,
  error,
})
export default createRootReducer;