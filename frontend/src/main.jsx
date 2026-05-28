
import React from "react";
import ReactDOM from "react-dom/client";

import App from "./App";

import "./styles.css";

import {

  AudioProvider

} from "./components/AudioProvider";

ReactDOM.createRoot(

  document.getElementById("root")

).render(

  <React.StrictMode>

    <AudioProvider>

      <App />

    </AudioProvider>

  </React.StrictMode>

);
