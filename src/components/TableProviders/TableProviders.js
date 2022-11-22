import React, { useState, useEffect } from "react";
import "./dataTableProviders.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableProviders = ({ setProviderSelected, providers }) => {
    const [globalFilter, setGlobalFilter] = useState(null);

    const [TableProvidersSelected, setTableProvidersSelected] = useState([]);
    useEffect(() => {
        if (TableProvidersSelected) {
            setProviderSelected(TableProvidersSelected);
        }
    }, [TableProvidersSelected, setProviderSelected]);

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
                <InputText placeholder="Buscar proveedor" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

            <DataTable
                value={providers}
                header="Proveedores"
                paginator
                responsiveLayout="scroll"
                emptyMessage="No se encontraron datos"
                className="table-providers"
                showGridlines
                stripedRows 
                rows={10}
                selection={TableProvidersSelected}
                onSelectionChange={(e) => setTableProvidersSelected(e.value)}
                dataKey="id"
                globalFilter={globalFilter}
            >
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" sortable header="Id proveedor"></Column>
                <Column field="nit" sortable header="Nit o indicador"></Column>
                <Column field="companyName" sortable header="Nombre empresa"></Column>
                <Column field="contactName" sortable header="Persona de contacto"></Column>
                <Column field="telephone" sortable header="Telfono"></Column>
                <Column field="adress" sortable header="Direccion"></Column>
                <Column field="email" sortable header="Email"></Column>
                <Column field="country" sortable header="Pais"></Column>
                <Column field="status"  body={statusBodyTemplate}  sortable header="Estado"></Column>
            </DataTable>
        </>
    );
};
