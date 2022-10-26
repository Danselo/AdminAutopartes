import React, { useState } from "react";
import "./dataTableProductsBrands.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableProductsBrands = ({ setProductsBrandsIdSelected, productsbrands, setProductsBrandsNameSelected }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedProductsBrands, setSelectedProductsBrands] = useState([]);
    
    function setProductsBrandsId(params) {
        setSelectedProductsBrands(params);
        if (params != null) {
            setProductsBrandsIdSelected(params.id);
            setProductsBrandsNameSelected(params.name);
        }
    }

    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar marca de productos" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable value={productsbrands} header="Marcas de productos" paginator responsiveLayout="scroll" emptyMessage="No se encontraron datos" className="table-productsbrands" showGridlines rows={10} selection={selectedProductsBrands} onSelectionChange={(e) => setProductsBrandsId(e.value)} dataKey="id" globalFilter={globalFilter}>
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" sortable header="Id marca"></Column>
                <Column field="name" sortable header="Nombre"></Column>
            </DataTable>
        </>
    );
};
