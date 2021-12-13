import React from 'react';
import ReactDOM from 'react-dom';
import { ThemeProvider } from '@material-ui/styles';
import { createBrowserHistory } from 'history';
import createSagaMiddleware from 'redux-saga';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import configureStore from './configureStore';
import sagas from './sagas';
import theme from './styles/theme';
import App from './App';
import { loadState } from './localStorage';
import * as Selectors from './selectors';
import * as serviceWorker from './serviceWorker';
import types from '@constants/actions';

const initialState = loadState();
const history = createBrowserHistory();
const sagaMiddleware = createSagaMiddleware();
const store = configureStore(initialState, history, sagaMiddleware);
sagaMiddleware.run(sagas);

const session = Selectors.selectSession(store.getState());
if (session) {
  const userId = Selectors.selectUserId(store.getState());
  store.dispatch({ type: types.GET_USER, data: { userId, token: session.token } });
}

function WrapReduxAndTheme() {
  return (
    <ThemeProvider theme={theme}>
      <Provider store={store}>
        <ConnectedRouter history={history}>
          <App />
        </ConnectedRouter>
      </Provider>
    </ThemeProvider>
  );
}
ReactDOM.render(
  <WrapReduxAndTheme />,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
