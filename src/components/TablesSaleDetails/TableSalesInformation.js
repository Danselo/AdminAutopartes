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
                id_Venta: 1,
                id_cliente: 1,
                fecha_Pedido: "12/04/22",
                hora_compra:"5:00 p.m",
                estado_Pago: "Terminado",
                total_compra: "805.000",
            },
           
        ]);
    }, []);

    return (
        <DataTable header="Informacion venta" value={Sales} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_venta" sortable header="Id venta"></Column>
            <Column field="id_cliente" sortable header="Id cliente"></Column>
            <Column field="fecha_pedido" sortable header="Fecha pedido"></Column>
            <Column field="estado_pago" sortable header="Estado pago"></Column>
            <Column field="total_compra" sortable header="Total compra"></Column>
            
        </DataTable>
    );
};