import React, { useEffect } from "react";
import { AuthService } from "./../service/AuthService";
import config from "../config/config";

const baseDashboardURL = config.adminURL + "/#/";
const _authService = new AuthService();

export default function Guard({ token }) {
    useEffect(() => {
        _authService
            .getModules(token)
            .then((response) => {
                localStorage.setItem("modules", JSON.stringify(response));
                window.location.replace(`${baseDashboardURL}`);
            })
            .catch((error) => {
                console.log("get permissions fallo cuando se llamo desde el admin", error);
            });
    }, [token]);

    return <div></div>;
}
