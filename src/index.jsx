import React from 'react';
import { createRoot } from 'react-dom/client';
import { BrowserRouter } from 'react-router-dom';

// assets
import 'assets/scss/style.scss';

// third party
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';

// project import
import App from 'layout/App';
import reducer from 'store/reducer';
import * as serviceWorker from 'serviceWorker';
import { Toaster } from 'react-hot-toast';

const store = configureStore({ reducer });

const root = createRoot(document.getElementById('root'));

// ==============================|| MAIN - REACT DOM RENDER  ||==============

root.render(
  <Provider store={store}>
     <Toaster position="top-center" />
    <BrowserRouter basename={import.meta.env.VITE_APP_BASE_NAME}>
      <App />
    </BrowserRouter>
  </Provider>
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
