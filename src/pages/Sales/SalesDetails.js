import React from "react";
import { TableClientInformation } from "../../components/TablesSaleDetails/TableClientInformation";
import { TableClientInformationSpipping } from "../../components/TablesSaleDetails/TableClientInformationSpipping";
import {TableSalesInformation} from "../../components/TablesSaleDetails/TableSalesInformation";
import {TableProductsInformation} from "../../components/TablesSaleDetails/TableProductsInformation";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./client.css";
import { Link } from "react-router-dom";

export default function SalesDetails() {
    return (
        <div>
            <div className="tittle-product">
                <h3>Detalles venta</h3>
            </div>
            <Link to={"/pages/Client/CreateClient"}>
                <Button label="Agregar cliente" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
            {/* <div className="container-search-product">
                <input label="buscarProducto" name="buscarProducto" placeholder="Buscar producto" className="search-product"></input>
            </div> */}
            <div className="container-search-product">
                <div className="col-12 md:col-3">
                    <div className="p-inputgroup">
                        <InputText placeholder="Buscar cliente" />
                        <Button icon="pi pi-search" className="p-button-info" />
                    </div>
                </div>
            </div>
            <TableClient className="table-products" />
        </div>
    );
}