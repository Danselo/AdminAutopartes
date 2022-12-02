import "react-app-polyfill/ie11";
import React from "react";
import ReactDOM from "react-dom";
import App from "./App";
import { HashRouter } from "react-router-dom";
import ScrollToTop from "./ScrollToTop";
import config from "./config/config";
import { AuthService } from "./service/AuthService";
const baseStoreURL = config.userURL;

const _authService = new AuthService();

document.addEventListener("DOMContentLoaded", (event) => {
    const token = localStorage.getItem("token");
    if (!token) {
        window.location.replace(`${baseStoreURL}`);
    }
    _authService
        .verifyToken(token)
        .then((response) => {
            console.log("logueado");
        })
        .catch((error) => {
            window.location.replace(`${baseStoreURL}`);
        });
});

// onDOMContentLoaded = (event) => { };
ReactDOM.render(
    <HashRouter>
        <ScrollToTop>
            <App></App>
        </ScrollToTop>
    </HashRouter>,
    document.getElementById("root")
);
