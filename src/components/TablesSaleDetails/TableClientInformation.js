import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
// import "./dataTableClientInformation.css";
// import { buttonBodyTemplate } from "./columnTemplateClientInformation";

export const TableClientInformation = () => {
    const [Client, setClient] = useState([]);

    useEffect(() => {
        setClient([
            {
                id_cliente: 1,
                nombre: "Juan Andres",
                apellido: "Gomez",
                tipo_documento: "Cedula",
                numero_documento: "100639674",
                email: "juangomez639@gmail.com",
                telefono: "+57 304 554 2123",
            },
        ]);
    }, []);

    return (
        <DataTable header="Clientes" value={Client} resizableColumns columnResizeMode="expand" stripedRows responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_cliente" header="Id cliente"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column field="apellido" header="Apellido"></Column>
            <Column field="tipo_documento" header="Tipo de Documento"></Column>
            <Column field="numero_documento" header="Número Documento"></Column>
            <Column field="email" header="Email"></Column>
            <Column field="telefono" header="Telefono"></Column>
        </DataTable>
    );
};
