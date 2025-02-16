import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { NextUIProvider } from "@nextui-org/react";
import { ThemeProvider as NextThemeProvider } from "next-themes";
import App from "./App";
import "@/styles/globals.css";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
      <NextThemeProvider attribute="class" defaultTheme="system">
        <NextUIProvider>
          <App />
        </NextUIProvider>
      </NextThemeProvider>
    </BrowserRouter>
  </React.StrictMode>,
);
