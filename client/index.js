import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import "./styles.css";

// Create root (React 18)
const root = ReactDOM.createRoot(
  document.getElementById("root")
);

// Render application
root.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
