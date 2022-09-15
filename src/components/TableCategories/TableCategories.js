import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { buttonBodyTemplate } from "./columnTemplateCategories";
import axios from  'axios';

const url = 'http://localhost:5000/categories/'


export const TableCategories = () => {
    const [categories, setCategories] = useState([]);

    useEffect(() => {
        axios.get(url).then((response) => {
            console.log(response)
            setCategories(response.data);           
        });
    }, []);

    // useEffect(() => {
    //     setCategories([{ id_categoria: 1467, nombre: "Ford", productos_registrados: 13}]);


    // }, []);
    

    

    return (
        <DataTable value={categories} 
        paginator responsiveLayout="scroll" 
        dataKey="id" 
        emptyMessage="No se encontraron datos" 
        className="table-product" 
        rows={10}>
            <Column field="id" sortable header="Id"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            <Column body={buttonBodyTemplate}  header="Acciones"></Column>
            


        </DataTable>
    );
};