import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { buttonBodyTemplate } from "./columnTemplates";

export const TablePermissions = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers([{ Modulo: "Compras", Permisos: "Editar"}]);


    }, []);
    

    

    return (
        <DataTable value={users} paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="Modulo" sortable header="Modulo"></Column>
            <Column field="Permisos" sortable header="Permisos"></Column>
            <Column body={buttonBodyTemplate} sortable header="Eliminar"></Column>
        </DataTable>
    );
};
