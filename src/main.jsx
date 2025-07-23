import React from "react";
import ReactDOM from "react-dom/client";
import { HashRouter , Routes, Route } from "react-router-dom";

import App from "./App.jsx"; // This is your prediction chart view
import LoginForm from "./components/LoginForm.jsx";
import StartTraining from "./components/StartTraining.jsx";

import './index.css';

ReactDOM.createRoot(document.getElementById("root")).render(
  <React.StrictMode>
    <HashRouter >
      <Routes>
        <Route path="/" element={<LoginForm />} />
        <Route path="/start-training" element={<StartTraining />} />
        <Route path="/predict" element={<App />} />
      </Routes>
    </HashRouter >
  </React.StrictMode>
);
