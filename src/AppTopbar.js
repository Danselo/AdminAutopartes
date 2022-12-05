import React from "react";
import { Link } from "react-router-dom";
import classNames from "classnames";
import config from "./config/config";

const baseLoginURL = config.userURL + "/login";

export const AppTopbar = (props) => {
    const logOut = () => {
        localStorage.clear();
        console.log(baseLoginURL);
        window.location.replace(baseLoginURL);
    };
    return (
        <div className="layout-topbar">
            <Link to="/" className="layout-topbar-logo">
                <img src={props.layoutColorMode === "light" ? "assets/layout/images/logo-dark.svg" : "assets/layout/images/logo-white.svg"} alt="logo" />
                <span>Mc Partes</span>
            </Link>

            <button type="button" className="p-link  layout-menu-button layout-topbar-button" onClick={props.onToggleMenuClick}>
                <i className="pi pi-bars" />
            </button>

            <button type="button" className="p-link layout-topbar-menu-button layout-topbar-button" onClick={props.onMobileTopbarMenuClick}>
                <i className="pi pi-ellipsis-v" />
            </button>

            <ul className={classNames("layout-topbar-menu lg:flex origin-top", { "layout-topbar-menu-mobile-active": props.mobileTopbarMenuActive })}>
                <li>
                    <Link to="/MyPerfil">
                        <button className="p-link layout-topbar-button">
                            <i className="pi pi-user" />
                            <span>Mi Perfil</span>
                        </button>
                    </Link>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={props.onMobileSubTopbarMenuClick}>
                        <i className="pi pi-question-circle" />
                        <span>Ayuda</span>
                    </button>
                </li>
                <li>
                    <button className="p-link layout-topbar-button" onClick={logOut}>
                        <i className="pi pi-power-off" />
                        <span>Cerrar sesión</span>
                    </button>
                </li>
            </ul>
        </div>
    );
};
