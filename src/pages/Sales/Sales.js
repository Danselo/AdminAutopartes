import React from "react";
import { TableSales } from "../../components/TableSales/TableSales";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./sales.css";
import { Link } from "react-router-dom";

export default function Sales() {
    return (
        <div>
            <div className="tittle-product">
                <h3>Mis de ventas</h3>
            </div>
            <Link to={"/pages/Sales/CreateSales"}>
                <Button label="Agregar Venta" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
            {/* <div className="container-search-product">
                <input label="buscarProducto" name="buscarProducto" placeholder="Buscar producto" className="search-product"></input>
            </div> */}
            <div className="container-search-product">
                <div className="col-12 md:col-3">
                    <div className="p-inputgroup">
                        <InputText placeholder="Buscar venta" />
                        <Button icon="pi pi-search" className="p-button-info" />
                    </div>
                </div>
            </div>
            <TableSales className="table-products" />
        </div>
    );
}