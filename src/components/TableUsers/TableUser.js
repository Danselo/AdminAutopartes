import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { buttonBodyTemplate } from "./columnTemplates";

export const TableUser = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers([{ id: 1, nombre: "Armando", apellido: "Puertas", telefono: "300215548", direccion: "Calle 39 D# 40 sur 145 int 294 barrio cruz", email: "armando@gmail.com", fechaRegistro: "12/05/2022", nroCompras: 5 }]);
    }, []);

    return (
        <DataTable value={users} paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id" sortable header="Id"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column header="apellido" sortable body="Apellido"></Column>
            <Column field="telefono" sortable header="Telefono"></Column>
            <Column field="direccion" sortable header="Direccion"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="fechaRegistro" sortable header="Fecha Registro"></Column>
            <Column field="nroCompras" sortable header="Nro Compras"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
        </DataTable>
    );
};
