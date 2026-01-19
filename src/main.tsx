import React from "react";
import { createRoot } from "react-dom/client";
import { Application } from "./components/app/application.js";

// @ts-ignore
createRoot(document.getElementById("root")!).render(<Application />);
