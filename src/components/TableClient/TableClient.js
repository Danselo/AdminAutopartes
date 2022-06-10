import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableClient.css";
import { buttonBodyTemplate } from "./columnTemplateClient";

export const TableClient = () => {
    const [Client, setClient] = useState([]);

    useEffect(() => {
        setClient([
            {
                id_cliente: 1,
                nombre: "Juan Andres",
                apellido: "Gomez",
                numero_documento:"100639674",
                direccion: "Cra 24 F #40 sur 163 int 204",
                telefono: "+57 304 554 2123",
            },
            {
                id_cliente: 2,
                nombre: "Julian Andres",
                apellido: "Gomez",
                numero_documento:"1020656790",
                direccion: "Cra 24 F #40 sur 163 int 204",
                telefono: "+57 304 554 2123",
            },
        ]);
    }, []);

    return (
        <DataTable header="Clientes" value={Client} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_cliente" sortable header="Id cliente"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column field="apellido" sortable header="Apellido"></Column>
            <Column field="numero_documento" sortable header="Número Documento"></Column>
            <Column field="direccion" sortable header="Direccion"></Column>
            <Column field="telefono" sortable header="Telefono"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
        </DataTable>
    );
};