import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import { Configuration, ConfigurationProps } from "@react-md/layout";
import { BrowserRouter } from "react-router-dom";

import './styles/index.scss';

import Layout from "./Layout";

// the ConfigurationProps are just all the props for the providers
// joined together. The only difference is that onResize has been
// renamed to onAppResize for the AppSizeListener
const overrides: ConfigurationProps = {
  // your configuration overrides
};

const rootElement = document.getElementById('root');
const root = createRoot(rootElement);

root.render(
  <StrictMode>
    <BrowserRouter>
      <Configuration {...overrides}>
        <Layout />
      </Configuration>
    </BrowserRouter>
  </StrictMode>,
);