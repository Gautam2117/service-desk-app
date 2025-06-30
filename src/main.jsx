import React from "react";
import ReactDOM from "react-dom/client";
import AppRouter from "./Router";
import "./index.css";
import { AuthProvider } from "./context/AuthContext";
import { Toaster } from "react-hot-toast";

// Create root and render application
const root = ReactDOM.createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <AuthProvider>
      <AppRouter />
      <Toaster
        position="top-right"
        reverseOrder={false}
        toastOptions={{
          style: {
            borderRadius: "8px",
            background: "#333",
            color: "#fff",
            fontWeight: "500",
          },
        }}
      />
    </AuthProvider>
  </React.StrictMode>
);
