import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableClientInformation.css";
import { buttonBodyTemplate } from "./columnTemplateClientInformation";

export const TableClient = () => {
    const [Client, setClient] = useState([]);

    useEffect(() => {
        setClient([
            {
                id_cliente: 1,
                nombre: "Juan Andres",
                apellido: "Gomez",
                tipo_documento:"Cedula",
                numero_documento:"100639674",
                email: "juangomez639@gmail.com",
                telefono: "+57 304 554 2123",
            },

        ]);
    }, []);

    return (
        <DataTable header="Clientes" value={Client} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_cliente" sortable header="Id cliente"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column field="apellido" sortable header="Apellido"></Column>
            <Column field="tipo_documento" sortable header="Tipo de Documento"></Column>
            <Column field="numero_documento" sortable header="Número Documento"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="telefono" sortable header="Telefono"></Column>
            
        </DataTable>
    );
};