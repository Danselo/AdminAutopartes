import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./buys.css";
import { Link } from "react-router-dom";
import { TableBuys } from "../../components/TableBuys/TableBuys";

export default function Buys() {
    return (
        <div>
            <div className="tittle-product">
                <h3>Gestión de compras</h3>
            </div>
            <Link to={"/CreatePurchase"}>
                <Button label="Crear compra" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
            {/* <div className="container-search-product">
                <input label="buscarProducto" name="buscarProducto" placeholder="Buscar producto" className="search-product"></input>
            </div> */}
            <div className="container-search-product">
                <div className="col-12 md:col-3">
                    <div className="p-inputgroup">
                        <InputText placeholder="Buscar compra" />
                        <Button icon="pi pi-search" className="p-button-info" />
                    </div>
                </div>
            </div>
            <TableBuys className="table-products" />
        </div>
    );
}
