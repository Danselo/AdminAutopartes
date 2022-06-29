import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
// import "./dataTableSales.css";

export const TableSalesInformation = () => {
    const [Sales, setSales] = useState([]);

    useEffect(() => {
        setSales([
            {
                id_venta: 1,
                id_cliente: 1,
                fecha_pedido: "12/04/22",
                hora_compra: "5:00 p.m",
                estado_pago: "Terminado",
                total_compra: "805.000",
            },
        ]);
    }, []);

    return (
        <DataTable header="Informacion venta" value={Sales} resizableColumns columnResizeMode="expand" stripedRows responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_venta" header="Id venta "></Column>
            <Column field="id_cliente" header="Id cliente"></Column>
            <Column field="fecha_pedido" header="Fecha pedido"></Column>
            <Column field="hora_compra" header="Hora de compra"></Column>
            <Column field="estado_pago" header="Estado de pago"></Column>
            <Column field="total_compra" header="Total compra"></Column>
        </DataTable>
    );
};
