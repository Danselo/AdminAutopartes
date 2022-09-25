import React, { useState } from "react";
import "./dataTableCategories.css"
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";





export const TableCategories = ({setCategoryIdSelected, categories, setCategoryNameSelected}) => {
    const [selectedCategory, setSelectedCategory] = useState([]);
    function setCategoryId(params) {
        setSelectedCategory(params)
        if (params != null) {
            setCategoryIdSelected(params.id)
            setCategoryNameSelected(params.name)      

        }
    }
    
    return (
        <DataTable value={categories} 
        paginator responsiveLayout="scroll" 
        emptyMessage="No se encontraron datos" 
        className="table-categories" 
        showGridlines
        rows={10} 
        selection={selectedCategory}
        onSelectionChange={e => setCategoryId(e.value) } 
        dataKey="id" 

         
       >
            <Column selectionMode="single" headerStyle={{width: '3em'}}></Column>
            <Column field="id" sortable header="Id categoria" ></Column>
            <Column field="name" sortable header="Nombre"></Column>
        </DataTable>
    );
};