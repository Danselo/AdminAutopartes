import React, { useState, useEffect, useRef } from "react";
import classNames from "classnames";
import { Route, useLocation } from "react-router-dom";
import { CSSTransition } from "react-transition-group";

import { AppTopbar } from "./AppTopbar";
import { AppFooter } from "./AppFooter";
import { AppMenu } from "./AppMenu";
import { AppConfig } from "./AppConfig";

import Dashboard from "./components/Dashboard";

import PrimeReact from "primereact/api";
import { Tooltip } from "primereact/tooltip";

import "primereact/resources/primereact.css";
import "primeicons/primeicons.css";
import "primeflex/primeflex.css";
import "prismjs/themes/prism-coy.css";
// import "primereact/resources/themes/md-light-indigo/theme.css";
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";
import "./App.scss";
import Products from "./pages/Products";

const App = () => {
    const [layoutMode, setLayoutMode] = useState("static");
    const [layoutColorMode, setLayoutColorMode] = useState("light");
    const [inputStyle, setInputStyle] = useState("outlined");
    const [ripple, setRipple] = useState(true);
    const [staticMenuInactive, setStaticMenuInactive] = useState(false);
    const [overlayMenuActive, setOverlayMenuActive] = useState(false);
    const [mobileMenuActive, setMobileMenuActive] = useState(false);
    const [mobileTopbarMenuActive, setMobileTopbarMenuActive] = useState(false);
    const copyTooltipRef = useRef();
    const location = useLocation();

    PrimeReact.ripple = true;

    let menuClick = false;
    let mobileTopbarMenuClick = false;

    useEffect(() => {
        if (mobileMenuActive) {
            addClass(document.body, "body-overflow-hidden");
        } else {
            removeClass(document.body, "body-overflow-hidden");
        }
    }, [mobileMenuActive]);

    useEffect(() => {
        copyTooltipRef && copyTooltipRef.current && copyTooltipRef.current.updateTargetEvents();
    }, [location]);

    const onInputStyleChange = (inputStyle) => {
        setInputStyle(inputStyle);
    };

    const onRipple = (e) => {
        PrimeReact.ripple = e.value;
        setRipple(e.value);
    };

    const onLayoutModeChange = (mode) => {
        setLayoutMode(mode);
    };

    const onColorModeChange = (mode) => {
        setLayoutColorMode(mode);
    };

    const onWrapperClick = (event) => {
        if (!menuClick) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }

        if (!mobileTopbarMenuClick) {
            setMobileTopbarMenuActive(false);
        }

        mobileTopbarMenuClick = false;
        menuClick = false;
    };

    const onToggleMenuClick = (event) => {
        menuClick = true;

        if (isDesktop()) {
            if (layoutMode === "overlay") {
                if (mobileMenuActive === true) {
                    setOverlayMenuActive(true);
                }

                setOverlayMenuActive((prevState) => !prevState);
                setMobileMenuActive(false);
            } else if (layoutMode === "static") {
                setStaticMenuInactive((prevState) => !prevState);
            }
        } else {
            setMobileMenuActive((prevState) => !prevState);
        }

        event.preventDefault();
    };

    const onSidebarClick = () => {
        menuClick = true;
    };

    const onMobileTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        setMobileTopbarMenuActive((prevState) => !prevState);
        event.preventDefault();
    };

    const onMobileSubTopbarMenuClick = (event) => {
        mobileTopbarMenuClick = true;

        event.preventDefault();
    };

    const onMenuItemClick = (event) => {
        if (!event.item.items) {
            setOverlayMenuActive(false);
            setMobileMenuActive(false);
        }
    };
    const isDesktop = () => {
        return window.innerWidth >= 992;
    };

    const menu = [
        {
            label: "Inicio",
            icon: "pi pi-fw pi-home",
            items: [
                {
                    label: "Dashboard",
                    icon: "pi pi-fw pi-chart-pie",
                    to: "/",
                },
            ],
        },
        {
            label: "Configuracion",
            items: [
                {
                    label: "Permisos",
                    icon: "pi pi-fw pi-cog",
                },
                {
                    label: "Roles",
                    icon: "pi pi-fw pi-user",
                },
            ],
        },
        {
            label: "Compras",
            items: [
                {
                    label: "Proveedores",
                    icon: "pi pi-fw pi-building",
                },
                {
                    label: "Compras",
                    icon: "pi pi-fw pi-shopping-bag",
                },
            ],
        },
        {
            label: "Productos",
            items: [
                {
                    label: "Categorias",
                    icon: "pi pi-fw pi-book",
                },
                {
                    label: "Marcas",
                    icon: "pi pi-fw pi-car",
                },
                {
                    label: "Productos",
                    icon: "pi pi-fw pi-box",
                    to: "/pages/Products",
                },
            ],
        },
        {
            label: "Ventas",
            items: [
                {
                    label: "Clientes",
                    icon: "pi pi-fw pi-users",
                },
                {
                    label: "Ventas",
                    icon: "pi pi-fw pi-credit-card",
                },
                {
                    label: "Historial de ventas",
                    icon: "pi pi-fw pi-book",
                },
            ],
        },

        {
            label: "Gestion de Usuarios",
            items: [{ label: "Usuarios", icon: "pi pi-fw pi-users", to: "/Usuarios" }],
        },
    ];

    const addClass = (element, className) => {
        if (element.classList) element.classList.add(className);
        else element.className += " " + className;
    };

    const removeClass = (element, className) => {
        if (element.classList) element.classList.remove(className);
        else element.className = element.className.replace(new RegExp("(^|\\b)" + className.split(" ").join("|") + "(\\b|$)", "gi"), " ");
    };

    const wrapperClass = classNames("layout-wrapper", {
        "layout-overlay": layoutMode === "overlay",
        "layout-static": layoutMode === "static",
        "layout-static-sidebar-inactive": staticMenuInactive && layoutMode === "static",
        "layout-overlay-sidebar-active": overlayMenuActive && layoutMode === "overlay",
        "layout-mobile-sidebar-active": mobileMenuActive,
        "p-input-filled": inputStyle === "filled",
        "p-ripple-disabled": ripple === false,
        "layout-theme-light": layoutColorMode === "light",
    });

    return (
        <div className={wrapperClass} onClick={onWrapperClick}>
            <Tooltip ref={copyTooltipRef} target=".block-action-copy" position="bottom" content="Copied to clipboard" event="focus" />

            <AppTopbar onToggleMenuClick={onToggleMenuClick} layoutColorMode={layoutColorMode} mobileTopbarMenuActive={mobileTopbarMenuActive} onMobileTopbarMenuClick={onMobileTopbarMenuClick} onMobileSubTopbarMenuClick={onMobileSubTopbarMenuClick} />

            <div className="layout-sidebar" onClick={onSidebarClick}>
                <AppMenu model={menu} onMenuItemClick={onMenuItemClick} layoutColorMode={layoutColorMode} />
            </div>

            <div className="layout-main-container">
                <div className="layout-main">
                    <Route path="/" exact render={() => <Dashboard colorMode={layoutColorMode} location={location} />} />
                    <Route path="/pages/Products" exact render={() => <Products />} />
                </div>

                <AppFooter layoutColorMode={layoutColorMode} />
            </div>

            <AppConfig rippleEffect={ripple} onRippleEffect={onRipple} inputStyle={inputStyle} onInputStyleChange={onInputStyleChange} layoutMode={layoutMode} onLayoutModeChange={onLayoutModeChange} layoutColorMode={layoutColorMode} onColorModeChange={onColorModeChange} />

            <CSSTransition classNames="layout-mask" timeout={{ enter: 200, exit: 200 }} in={mobileMenuActive} unmountOnExit>
                <div className="layout-mask p-component-overlay"></div>
            </CSSTransition>
        </div>
    );
};

export default App;
