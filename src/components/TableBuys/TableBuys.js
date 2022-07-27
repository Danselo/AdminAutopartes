import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableSales.css";
import { buttonBodyTemplate } from "./columnTemplatesBuys";

export const TableBuys = () => {
    const [Purchase, setPurchase] = useState([]);

    useEffect(() => {
        setPurchase([
            {
                id: 1,
                id_proveedor: 10545,
                nro_factura: "H-676",
                fecha_compra: "27/07/2022",
                total: "560.000",
                total_iva: "50.000",
                monto_total: "610.000",
            },
            {
                id: 2,
                id_proveedor: 4668,
                nro_factura: "H-677",
                fecha_compra: "28/07/2022",
                total: "890.000",
                total_iva: "50.000",
                monto_total: "940.000",
            },
        ]);
    }, []);

    return (
        <DataTable header="Compras" value={Purchase} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id" sortable header="Id compra"></Column>
            <Column field="id_proveedor" sortable header="Proveedor"></Column>
            <Column field="nro_factura" sortable header="Nro factura"></Column>
            <Column field="fecha_compra" sortable header="Fecha"></Column>
            <Column field="total" sortable header="Total compra"></Column>
            <Column field="total_iva" sortable header="Total iva"></Column>
            <Column field="monto_total" sortable header="Monto total"></Column>
            <Column body={buttonBodyTemplate} sortable header="Detalle"></Column>
        </DataTable>
    );
};
