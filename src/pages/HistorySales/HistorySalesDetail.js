import React from "react";
import { TableClientInformation } from "../../components/TablesSaleDetails/TableClientInformation";
import { TableClientInformationShipping } from "../../components/TablesSaleDetails/TableClientInformationShipping";
import { TableSalesInformation } from "../../components/TablesSaleDetails/TableSalesInformation";
import { TableProductsInformation } from "../../components/TablesSaleDetails/TableProductsInformation";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export default function HistorySalesDetails() {
    return (
        <>
            <Link to={"/HistorySales"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div>
                <div className="tittle-product">
                    <h3>Detalles venta</h3>
                </div>

                <h4>Informacion general del pedido</h4>
                <TableSalesInformation className="table-products" />

                <h4>Informacion personal del cliente</h4>
                <TableClientInformation className="table-products" />

                <h4>Informacion de envio del cliente</h4>
                <TableClientInformationShipping className="table-products" />

                <h4>Productos</h4>
                <TableProductsInformation className="table-products" />
            </div>
        </>
    );
}
