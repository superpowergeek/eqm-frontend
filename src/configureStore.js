import { applyMiddleware, compose, createStore } from 'redux';
import { routerMiddleware } from 'connected-react-router';
import createReduxWaitForMiddleware from 'redux-wait-for-action';
import createRootReducer from './reducers';
import { localStorageMiddleware } from './localStorage';

const composeEnhancer = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

let store = null;

export const getStore = () => store;

export default function configureStore(preloadedState, history, sagaMiddleware) {
  store = createStore(
    createRootReducer(history), // root reducer with router state
    { app: preloadedState },
    composeEnhancer(
      applyMiddleware(
        routerMiddleware(history),
        createReduxWaitForMiddleware(),
        localStorageMiddleware,
        sagaMiddleware, 
        // for dispatching history actions
        // ... other middlewares ...
      ),
    ),
  )
  return store;
}