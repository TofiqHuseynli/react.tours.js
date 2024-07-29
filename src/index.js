import React from "react";
import ReactDOM from "react-dom";
import { BrowserRouter } from "react-router-dom";
import { AppProvider } from "fogito-core-ui";
import "fogito-core-ui/build/style.css";
import "antd/dist/antd.css";
import "./assets/index.scss";
import { App } from "./layouts/App";
   
 

 

ReactDOM.render(
  <BrowserRouter basename={process.env.publicPath}>
    <AppProvider>
      <App/>
    </AppProvider>
  </BrowserRouter>,
  document.getElementById("root")
);
