import React, { useState, useEffect, useRef } from "react";
import "bootstrap/dist/css/bootstrap.min.css";
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
import "./assets/demo/flags/flags.css";
import "./assets/demo/Demos.scss";
import "./assets/layout/layout.scss";
import "./App.scss";
import Products from "./pages/Products/Products";
import Providers from "./pages/Providers/Providers";
import Client from "./pages/Client/Client";
import CreateClient from "./pages/Client/CreateClient";
import Sales from "./pages/Sales/Sales";
import CreateSales from "./pages/Sales/CreateSales";
import Users from "./pages/Users/Users";
import Roles from "./pages/Roles/Roles";
import Brand from "./pages/Brand/Brand";
import CreateUser from "./pages/Users/CreateUser";
import SalesDetails from "./pages/Sales/SalesDetails";
import Buys from "./pages/Buys/Buys";
import CreatePurchase from "./pages/Buys/CreatePurchase";
import Categories from "./pages/Categories/Categories";
import Vehicles from "./pages/Vehicle/Vehicle";
import ProductsBrands from "./pages/ProductsBrands/ProductsBrands";


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
                    label: "Roles",
                    icon: "pi pi-fw pi-user",
                    to: "/pages/Roles/Roles",
                },
            ],
        },
        {
            label: "Compras",
            items: [
                {
                    label: "Proveedores",
                    icon: "pi pi-fw pi-building",
                    to: "/Providers",
                },
                {
                    label: "Compras",
                    icon: "pi pi-fw pi-shopping-bag",
                    to: "/Buys",
                },
            ],
        },
        {
            label: "Productos",
            items: [
                {
                    label: "Categorias",
                    icon: "pi pi-fw pi-book",
                    to: "/Categories",
                },
                {
                    label: "Marcas vehiculos",
                    icon: "pi pi-fw pi-car",
                    to: "/Brand",
                },
                {
                    label: "Vehiculos",
                    icon: "pi pi-fw pi-car",
                    to: "/Vehicles",
                },
                {
                    label: "Marcas productos",
                    icon: "pi pi-fw pi-car",
                    to: "/ProductsBrands",
                },
                {
                    label: "Productos",
                    icon: "pi pi-fw pi-box",
                    to: "/Products",
                },
                
            ],
        },
        {
            label: "Ventas",
            items: [
                {
                    label: "Clientes",
                    icon: "pi pi-fw pi-users",
                    to: "/pages/Client/Client",
                },
                {
                    label: "Ventas",
                    icon: "pi pi-fw pi-credit-card",
                    to: "/Sales",
                },
                
            ],
        },

        {
            label: "Gestion de Usuarios",
            items: [{ label: "Usuarios", icon: "pi pi-fw pi-users", to: "/pages/Users/Users" }],
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
                    <Route path="/products" exact render={() => <Products />} />
                    <Route path="/Providers" exact render={() => <Providers />} />
                    <Route path="/pages/Client/Client" exact render={() => <Client />} />
                    <Route path="/pages/Client/CreateClient" exact render={() => <CreateClient />} />
                    <Route path="/Sales" exact render={() => <Sales />} />
                    <Route path="/CreateSales" exact render={() => <CreateSales />} />
                    <Route path="/pages/CreateUser/CreateUser" exact render={() => <CreateUser />} />                             
                    <Route path="/pages/Users/Users" exact render={() => <Users />} />
                    <Route path="/pages/Roles/Roles" exact render={() => <Roles />} />
                    <Route path="/Brand" exact render={() => <Brand />} />                
                    <Route path="/SalesDetails" exact render={() => <SalesDetails />} />   
                    <Route path="/Buys" exact render={() => <Buys />} />
                    <Route path="/CreatePurchase" exact render={() => <CreatePurchase />} />
                    <Route path="/Categories" exact render={() => <Categories />} />                  
                    <Route path="/Vehicles" exact render={() => <Vehicles />} />
                    <Route path="/ProductsBrands" exact render={() => <ProductsBrands />} /> 
              
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
