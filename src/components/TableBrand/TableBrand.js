import React, { useState } from "react";
import "./dataTableBrands.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableBrand = ({ setBrandIdSelected, brands, setBrandNameSelected }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedBrand, setSelectedBrand] = useState([]);
    function setBrandId(params) {
        setSelectedBrand(params);
        if (params != null) {
            setBrandIdSelected(params.id);
            setBrandNameSelected(params.name);
        }
    }
    const statusBodyTemplate = (rowData) => {
        if (rowData.status === true) {
            return <span className="brand-badge-status-active">ACTIVO</span>;
        }else if(rowData.status === false){
            return <span className="brand-badge-status-inactive">INACTIVO</span>;
        }else{
            return <span className="brand-badge-status-na">NA</span>; 
        }
        
    }

    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar marca" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable value={brands} header="Marcas" paginator responsiveLayout="scroll" emptyMessage="No se encontraron datos" className="table-brands" showGridlines rows={10} selection={selectedBrand} onSelectionChange={(e) => setBrandId(e.value)} dataKey="id" globalFilter={globalFilter}>
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" sortable header="Id marca"></Column>
                <Column field="name" sortable header="Nombre"></Column>
                <Column field="status" body={statusBodyTemplate} header="Estado"></Column>
            </DataTable>
        </>
    );
};
