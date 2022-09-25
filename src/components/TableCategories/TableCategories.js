import React, { useState } from "react";
import "./dataTableCategories.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableCategories = ({ setCategoryIdSelected, categories, setCategoryNameSelected }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState([]);
    function setCategoryId(params) {
        setSelectedCategory(params);
        if (params != null) {
            setCategoryIdSelected(params.id);
            setCategoryNameSelected(params.name);
        }
    }

    return (
        <>
            <div className="p-inputgroup create-category__table">
                <InputText placeholder="Buscar categoria" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable value={categories} paginator responsiveLayout="scroll" emptyMessage="No se encontraron datos" className="table-categories" showGridlines rows={10} selection={selectedCategory} onSelectionChange={(e) => setCategoryId(e.value)} dataKey="id" globalFilter={globalFilter}>
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" sortable header="Id categoria"></Column>
                <Column field="name" sortable header="Nombre"></Column>
            </DataTable>
        </>
    );
};
