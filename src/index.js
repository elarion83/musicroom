import React from "react";
import ReactDOM from "react-dom";
import * as serviceWorkerRegistration from "./serviceWorkerRegistration";
import './services/i18n/i18n';
import AppRoutes from "./AppRoute";
import './assets/css/style.scss';
import { ReactNotifications } from "react-notifications-component";
import 'react-notifications-component/dist/theme.css'
ReactDOM.render(
  <React.StrictMode>
    
      <ReactNotifications />
    <AppRoutes />
  </React.StrictMode>,
  document.getElementById("root")
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://cra.link/PWA
serviceWorkerRegistration.register();
