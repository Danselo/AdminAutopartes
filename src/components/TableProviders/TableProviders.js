import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableProviders.css";
import { buttonBodyTemplate } from "./columnTemplateProviders";

export const TableProviders = () => {
    const [providers, setProviders] = useState([]);

    useEffect(() => {
        setProviders([
            {
                id: 1,
                nit: 32323434,
                nombre: "U.S Cars",
                nombre_contacto: "Juan Andres Gomez",
                telefono: "+58 304 554 2123",
                direccion: "Cra 24 F #40 sur 163 int 204",
                email: "juan.andres.gomez@gmail.com",
                pais: "Colombia",
            },
            {
                id: 2,
                nit: 32323434,
                nombre: "U.S Cars",
                nombre_contacto: "Juan Andres Gomez",
                telefono: "+58 304 554 2123",
                direccion: "Cra 24 F #40 sur 163 int 204",
                email: "juan.andres.gomez@gmail.com",
                pais: "Colombia",
            },
        ]);
    }, []);

    return (
        <DataTable header="Proveedores" value={providers} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id" sortable header="Id proveedor"></Column>
            <Column field="nit" sortable header="Nit"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column field="nombre_contacto" sortable header="Nombre contacto"></Column>
            <Column field="telefono" sortable header="Telefono"></Column>
            <Column field="direccion" sortable header="Direccion"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="pais" sortable header="Pais"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
        </DataTable>
    );
};
