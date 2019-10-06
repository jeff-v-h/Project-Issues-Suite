import '@babel/polyfill';
import '../web.config';
import React from 'react';
import ReactDOM from 'react-dom';
import '../semantic/dist/semantic.min.css';
import './styles/web.scss';
import App from './shared/App';
import '../node_modules/toastr/build/toastr.min.css';
import { CookiesProvider } from 'react-cookie';
import { Provider } from 'react-redux';
import { history, store, persistor } from './shared/config/store';
import { BrowserRouter } from 'react-router-dom';
import { PersistGate } from 'redux-persist/integration/react';
import LoadingPage from './shared/LoadingPage';
import { ConnectedRouter } from "connected-react-router";
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render((
  <CookiesProvider>
    <BrowserRouter>
      <Provider store={store}>
        <PersistGate loading={<LoadingPage />} persistor={persistor}>
          <ConnectedRouter history={history}>
            <App />
          </ConnectedRouter>
        </PersistGate>
      </Provider>
    </BrowserRouter>
  </CookiesProvider>
), document.getElementById('root'));
// registerServiceWorker();
