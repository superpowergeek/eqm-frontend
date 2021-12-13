import throttle from 'lodash/throttle';

export const loadState = () => {
  try {
    const serializedState = localStorage.getItem('state');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    console.error('loadState error :', err);
    return undefined;
  }
};

export const saveState = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('state', serializedState);
  } catch (err) {
    console.error('saveState error :', err);
  }
};

const delaySave = throttle((store) => {
  const appState = store.getState().app;
  console.log('saving');
  const rememberMe = appState.persistence.rememberMe;
  if (rememberMe) {
    const {
      persistence,
      session,
    } = appState;
    saveState({
      persistence,
      session,
    });
  } else {
    // removeState();
    localStorage.clear();
  }
}, 300);

export const localStorageMiddleware = store => next => (action) => {
  setTimeout(() => {
    delaySave(store);
  }, 0);
  return next(action);
};