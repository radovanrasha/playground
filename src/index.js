import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import "./styles/About.css";
import "./styles/primary.css";
import "./styles/secondary.css";
import "./styles/memory.css";
import "./styles/memory-online.css";
import "./styles/home.css";
import "./styles/battleship-online.css";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <Router>
      <App />
    </Router>
  </React.StrictMode>
);
