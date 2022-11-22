import React, { useState, useEffect } from "react";
import "./dataTableProductsBrands.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableProductsBrands = ({ setProductsBrandsIdSelected, productsbrands, setProductsBrandsNameSelected,setBrandSelected }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedProductsBrands, setSelectedProductsBrands] = useState([]);
    const [TableBrandSelected, setTableBrandSelected] = useState([]);
    
    function setproductbrandSelectedFromtable(params) {
        setTableBrandSelected(params)
        setSelectedProductsBrands(params);
        if (params != null) {
            setProductsBrandsIdSelected(params.id);
            setProductsBrandsNameSelected(params.name);
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
    useEffect(() => {
        if (TableBrandSelected) {
            setBrandSelected(TableBrandSelected);
        }
    }, [TableBrandSelected, setBrandSelected]);

    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar marca de productos" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable value={productsbrands} 
            header="Marcas de productos" 
            paginator 
            responsiveLayout="scroll" 
            emptyMessage="No se encontraron datos" 
            className="table-productsbrands" 
            showGridlines rows={10} 
            selection={selectedProductsBrands} 
            onSelectionChange={(e) => setproductbrandSelectedFromtable(e.value)} 
            dataKey="id" 
            globalFilter={globalFilter}>
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" sortable header="Id marca"></Column>
                <Column field="name" sortable header="Nombre"></Column>
                <Column field="status" body={statusBodyTemplate} header="Estado"></Column>
            </DataTable>
        </>
    );
};
