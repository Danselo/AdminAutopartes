import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableSales.css";
import { buttonBodyTemplate } from "./columnTemplatesSales";

export const TableSales = () => {
    const [Sales, setSales] = useState([]);

    useEffect(() => {
        setSales([
            {
                id: 1,
                id_cliente: 1,
                fecha_venta: "12/04/22",
                estado_venta: "Terminado",
            },
            {
                id: 2,
                id_cliente: 2,
                fecha_venta: "16/04/22",
                estado_venta: "Terminado",
            },
        ]);
    }, []);

    return (
        <DataTable header="ventas" value={Sales} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id" sortable header="Id venta"></Column>
            <Column field="id_cliente" sortable header="Id cliente"></Column>
            <Column field="fecha_venta" sortable header="Fecha venta"></Column>
            <Column field="estado_venta" sortable header="Estado venta"></Column>
            <Column body={buttonBodyTemplate} sortable header="Detalle"></Column>
        </DataTable>
    );
};
