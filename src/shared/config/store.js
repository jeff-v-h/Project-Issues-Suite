import { createStore, compose, applyMiddleware } from 'redux';
import thunk from 'redux-thunk';
import logger from 'redux-logger';
import { persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage';
import { routerMiddleware } from 'connected-react-router';
import { createBrowserHistory } from 'history';

import rootReducer from '../reducers/rootReducer';

const persistConfig = {
  key: 'root',
  storage,
  blacklist: ['tickets'] // tickets change too often to persist
};
export const history = createBrowserHistory();

const persistedReducer = persistReducer(persistConfig, rootReducer(history));

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const middlewares = [routerMiddleware(history), thunk, logger];
const enhancers = [applyMiddleware(...middlewares)];

export const store = createStore(
  persistedReducer,
  {},
  composeEnhancers(...enhancers)
);

export const persistor = persistStore(store);
