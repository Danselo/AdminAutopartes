import React, { useState, useEffect } from "react";
import "./dataTableCategories.css"
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import axios from  'axios';


const url = 'http://localhost:5000/categories/'


export const TableCategories = ({idCategory}) => {
    const [categories, setCategories] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState([]);
    function setCategoryId(params) {
        setSelectedProduct(params)
        idCategory(params.id)       
    }
    useEffect(() => {
        axios.get(url).then((response) => {
            setCategories(response.data);           
        });
    }, []);
    return (
        <DataTable value={categories} 
        paginator responsiveLayout="scroll" 
        emptyMessage="No se encontraron datos" 
        className="table-categories" 
        showGridlines
        rows={10} 
        selection={selectedProduct}
        onSelectionChange={e => setCategoryId(e.value) } 
        dataKey="id" 

         
       >
            <Column selectionMode="single" headerStyle={{width: '3em'}} onClick = {() => setCategoryId()}></Column>
            <Column field="id" sortable header="Id categoria" ></Column>
            <Column field="name" sortable header="Nombre"></Column>
        </DataTable>
    );
};