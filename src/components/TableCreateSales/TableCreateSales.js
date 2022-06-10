import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableCreateSales.css";
import { buttonBodyTemplate } from "./columnTemplateCreateSales";

export const TableCreateSales = () => {
    const [createSales, setCreateSales] = useState([]);

    useEffect(() => {
        setCreateSales([
            {
                nombre_producto: "Bateria",
                cantidad: 1,
                precio_unitario: "500.000",
                sub_total_sin_impuestos: "500.000",
                iva: "19%",
                otros_impuestos: "0%",
                total_impuestos: "95.000",
                sub_total_con_impuestos: "595.000",
            },
            {
                nombre_producto: "Bateria",
                cantidad: 2,
                precio_unitario: "500.000",
                sub_total_sin_impuestos: "1'000.000",
                iva: "19%",
                otros_impuestos: "0%",
                total_impuestos: "190.000",
                sub_total_con_impuestos: "1'190.000",
            },
        ]);
    }, []);

    return (
        <DataTable header="Agregarproducto a la venta" value={createSales} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="nombre_producto" sortable header="Nombre producto"></Column>
            <Column field="cantidad" sortable header="Cantidad"></Column>
            <Column field="precio_unitario" sortable header="Precio_unitario"></Column>
            <Column field="sub_total_sin_impuestos" sortable header="Sub total sin impuestos"></Column>
            <Column field="iva" sortable header="% iva"></Column>
            <Column field="otros_impuestos" sortable header="%otros impuestos"></Column>
            <Column field="total_impuestos" sortable header="Total_impuestos"></Column>
            <Column field="sub_total_con_impuestos" sortable header="Sub total con impuestos"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
        </DataTable>
    );
};