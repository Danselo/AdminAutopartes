import React from "react";
import { TableProviders } from "../../components/TableProviders/TableProviders";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./providers.css";
import { Link } from "react-router-dom";

export default function Providers() {
    return (
        <div>
            <div className="tittle-product">
                <h3>Gestión de proveedores</h3>
            </div>
            <Link to={"/pages/Providers/CreateProvider"}>
                <Button label="Agregar proveedor" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
            {/* <div className="container-search-product">
                <input label="buscarProducto" name="buscarProducto" placeholder="Buscar producto" className="search-product"></input>
            </div> */}
            <div className="container-search-product">
                <div className="col-12 md:col-3">
                    <div className="p-inputgroup">
                        <InputText placeholder="Buscar proveedor" />
                        <Button icon="pi pi-search" className="p-button-info" />
                    </div>
                </div>
            </div>
            <TableProviders className="table-products" />
        </div>
    );
}
