import React from "react";
import { TableHistorySales } from "../../components/TableHistorySales/TableHistorySales";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./historySales.css";

export default function HistorySales() {
    return (
        <div>
            <div className="tittle-product">
                <h3>Historial de ventas</h3>
            </div>
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
            <TableHistorySales className="table-products" />
        </div>
    );
}