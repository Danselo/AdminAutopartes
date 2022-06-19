import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { buttonBodyTemplate } from "./columnTemplates";

export const TableRoles = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers([{ idRol: 1467, nombre: "Empleado1", fechaCreacion: "12/05/2022"}]);


    }, []);
    

    

    return (
        <DataTable value={users} paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="idRol" sortable header="Id"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column field="fechaCreacion" sortable header="Fecha Creacion"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
        </DataTable>
    );
};
