import React, { useState } from "react";
// import "./dataTableBrands.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableProductsWhereVehicle = ({ products }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
 
    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar producto" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable 
            value={products} 
            header="Productos asociados a la categoria" 
            paginator 
            responsiveLayout="scroll" 
            emptyMessage="No se encontraron datos" 
            className="table-products" 
            showGridlines rows={10}  
            dataKey="id" 
            globalFilter={globalFilter}>
                <Column field="id" sortable header="Id producto"></Column>
                <Column field="name"  header="Nombre"></Column>
                <Column field="amount"  header="Cantidad"></Column>
                <Column field="idBrand"  header="Marca"></Column>
            </DataTable>
        </>
    );
};
