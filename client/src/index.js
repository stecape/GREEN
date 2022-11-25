import { render } from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { Configuration, ConfigurationProps } from "@react-md/layout";

import './index.scss';

import Layout from "./Layout";

// the ConfigurationProps are just all the props for the providers
// joined together. The only difference is that onResize has been
// renamed to onAppResize for the AppSizeListener
const overrides: ConfigurationProps = {
  // your configuration overrides
};

render(
  <BrowserRouter>
    <Configuration {...overrides}>
      <Layout />
    </Configuration>
  </BrowserRouter>,
  document.getElementById("root")
);