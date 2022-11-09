import React, { useState, useEffect } from "react";
import "./dataTableCategories.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableCategories = ({ setCategoryIdSelected, categories, setCategoryNameSelected, setCategorySelected }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState([]);
    const [TableCategorySelected, setTableCategorySelected] = useState([]);
    
    function setCategoryId(params) {
        setTableCategorySelected(params)
        setSelectedCategory(params);
        if (params != null) {
            setCategoryIdSelected(params.id);
            setCategoryNameSelected(params.name);
        }
    }

    useEffect(() => {
        if (TableCategorySelected) {
            setCategorySelected(TableCategorySelected);
        }
    }, [TableCategorySelected, setCategorySelected]);

    const statusBodyTemplate = (rowData) => {
        if (rowData.status === true) {
            return <span className="category-badge-status-active">ACTIVO</span>;
        }else if(rowData.status === false){
            return <span className="category-badge-status-inactive">INACTIVO</span>;
        }else{
            return <span className="category-badge-status-na">NA</span>; 
        }
        
    }

    return (
        <>
            <div className="p-inputgroup create-category__table">
                <InputText placeholder="Buscar categoría" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable 
            value={categories} 
            header="Categorías"
            paginator 
            responsiveLayout="scroll" 
            emptyMessage="No se encontraron datos" 
            className="table-categories" 
            showGridlines 
            rows={10} 
            selection={selectedCategory} 
            onSelectionChange={(e) => setCategoryId(e.value)} 
            dataKey="id" 
            globalFilter={globalFilter}>
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" sortable header="Id categoría"></Column>
                <Column field="name" sortable header="Nombre"></Column>
                <Column field="status" body={statusBodyTemplate} header="Estado"></Column>
            </DataTable>
        </>
    );
};
