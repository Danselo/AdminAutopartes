import React, { useState } from "react";
import "./dataTableBrands.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableVehiclesOfBrandSelected = ({ vehicles }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
 
    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar vehículo" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable 
            value={vehicles} 
            header="Vehiculos asociados a la marca" 
            paginator 
            responsiveLayout="scroll" 
            emptyMessage="No se encontraron datos" 
            className="table-vehicles" 
            showGridlines rows={10}  
            dataKey="id" 
            globalFilter={globalFilter}>
                <Column field="id" sortable header="Id vehículo"></Column>
                <Column field="name"  header="Nombre"></Column>
                <Column field="model"  header="Modelo"></Column>
            </DataTable>
        </>
    );
};
