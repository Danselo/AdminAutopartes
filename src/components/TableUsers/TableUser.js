import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
// import { buttonBodyTemplate } from "./columnTemplates";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";


export const TableUser = ({setUserSelected,users}) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [usersSelected, setUsersSelected] = useState([]);
// console.log(usersSelected)
    useEffect(() => {
        if (usersSelected) {
            setUserSelected(usersSelected)
        }
    }, [usersSelected, setUserSelected])
    

    return (
        <>
        <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar usuario" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable value={users} paginator responsiveLayout="scroll" emptyMessage="No se encontraron datos" className="table-user" showGridlines rows={10} selection={usersSelected} onSelectionChange={(e) => setUsersSelected(e.value)} dataKey="id" globalFilter={globalFilter}>
            <Column selectionMode="single" headerStyle={{width: '3em'}}></Column>
            <Column field="id" sortable header="Id"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            <Column field="lastname" sortable header="Apellido"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="idRol" sortable header="Rol"></Column>

        </DataTable>
        </>
        
    );
};
