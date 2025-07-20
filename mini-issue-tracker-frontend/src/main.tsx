import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import { ApolloProvider } from "@apollo/client";
import App from "./App";
import "./index.css";
import { Provider } from "react-redux";
import { store } from "./store/store"
import { client } from "./apollo/client";
import { AuthProvider } from "./context/AuthContext";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <Provider store={store}> 
        <BrowserRouter>
        <AuthProvider>
        <App />
      </AuthProvider>
        </BrowserRouter>
      </Provider>
    </ApolloProvider>
  </React.StrictMode>
);
