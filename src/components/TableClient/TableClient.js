import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableClient.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";

export const TableClient = ({setClientSelected,clients}) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [clientsTableSelected, setClientsSelected] = useState([]);
  
    useEffect(() => {   
        if (clientsTableSelected) {
            setClientSelected(clientsTableSelected)
        }
    }, [clientsTableSelected, setClientSelected])
    const statusBodyTemplate = (rowData) => {
        if (rowData.status === true) {
            return <span className="role-badge-status-active">ACTIVO</span>;
        }else if(rowData.status === false){
            return <span className="role-badge-status-inactive">INACTIVO</span>;
        }else{
            return <span className="role-badge-status-na">NA</span>; 
        }
        
    }




    return (
        <>        
                <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar Cliente" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
        <DataTable value={clients} paginator responsiveLayout="scroll" emptyMessage="No se encontraron datos" className="table-user" showGridlines rows={10} selection={clientsTableSelected} onSelectionChange={(e) => setClientsSelected(e.value)} dataKey="id" globalFilter={globalFilter}>
             <Column selectionMode="single" headerStyle={{width: '3em'}}></Column>
            <Column field="id" sortable header="Id"></Column>
            <Column field="status"  body={statusBodyTemplate}  sortable header="Estado"></Column>
            <Column field="idUser" sortable header="Id Usuario"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            <Column field="lastname" sortable header="Apellido"></Column>
            <Column field="documentType" sortable header="Tipo Documento"></Column>
            <Column field="document" sortable header="Documento"></Column>
            <Column field="telephone" sortable header="Telefono"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="country" sortable header="Pais"></Column>
            <Column field="department" sortable header="Departamento"></Column>
            <Column field="city" sortable header="Ciudad"></Column>
            <Column field="neightboorhood" sortable header="Vecindario "></Column>
            <Column field="address" sortable header="Direccion"></Column>
            <Column field="indications" sortable header="Indicaciones"></Column>
        </DataTable>
        </>

    );
};