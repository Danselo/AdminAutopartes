import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./tableRoles.css"

export const TableRoles = ({ setRolSelected, roles }) => {
    const [globalFilter, setGlobalFilter] = useState(null);   
    const [TableRolSelected, setTableRolSelected] = useState([]);
      
    useEffect(() => {
        if (TableRolSelected) {
            setRolSelected(TableRolSelected);
        }
    }, [TableRolSelected, setRolSelected]);
    
    const statusBodyTemplate = (rowData) => {
        if (rowData.status === true) {
            return <span className="role-badge-status-active">ACTIVO</span>;
        }else if(rowData.status === false){
            return <span className="role-badge-status-inactive">INACTIVO</span>;
        }else{
            return <span className="role-badge-status-na">NA</span>; 
        }
        
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => (rowData)} aria-label="Detail" />
            </React.Fragment>
        );
    };
    return (
        <>
        <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar rol" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

        <DataTable 
        header="Roles registrados" 
        stripedRows 
        showGridlines
        value={roles} 
        paginator 
        responsiveLayout="scroll" 
        dataKey="id" 
        emptyMessage="No se encontraron datos" className="table-rol" 
        rows={10}
        globalFilter={globalFilter}
        selection={TableRolSelected}        
        onSelectionChange={(e) => setTableRolSelected(e.value)}
        >
            <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
            <Column field="id" frozen  header="Id rol"></Column>
            <Column field="name"  header="Nombre del rol"></Column>
            <Column field="createdAt" className="table-rol--column-gray" sortable header="Fecha de creacion"></Column>
            <Column field="status" body={statusBodyTemplate}  header="Estado"></Column>
            <Column field="permissions"  header="Ver permisos" body={actionBodyTemplate}></Column>
        </DataTable>
        </>
    )
    
}
