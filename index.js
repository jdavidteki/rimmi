import React from "react";
import ReactDOM from "react-dom";
import App from "./src/App";
import { BrowserRouter } from "react-router-dom";

let app = (
  <BrowserRouter>
  <App />
</BrowserRouter>
);

window.__MUI_USE_NEXT_TYPOGRAPHY_VARIANTS__ = true;

ReactDOM.render(app, document.getElementById("root"));


//persistence after page refresh

// https://stackoverflow.com/questions/39097440/on-react-router-how-to-stay-logged-in-state-even-page-refresh