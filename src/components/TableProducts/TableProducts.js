import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableProduct.css";
import { imageBodyTemplate, buttonBodyTemplate } from "./columnTemplates";
import axios from 'axios'
const url = 'http://localhost:5000/products/'

export const TableProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        axios.get(url).then((response) => {
            setProducts(response.data);    
            console.log(response);       
        });
    }, []);
    // useEffect(() => {
    //     setProducts([{ id: 1, nombre: "Bateria", img: "bamboo-watch.jpg", categoria: "baterias", marca: "ford", cantidad: 5, iva: 0.19, precio: 120000 }]);
    // }, []);

    return (
        <DataTable header="Productos" 
        stripedRows 
        value={products}
         paginator 
         responsiveLayout="scroll" 
         dataKey="id" 
         emptyMessage="No se encontraron datos" 
         className="table-product" rows={10}>
            <Column field="id" sortable header="Id"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            <Column field="photo" header="Imagen"  body={imageBodyTemplate}></Column>
            <Column field="idCategory" sortable header="Categoria"></Column>
            <Column field="amount" sortable header="Cantidad"></Column>
            <Column field="iva"  header="Iva"></Column>
            <Column field="price" sortable header="Precio"></Column>
            <Column body={buttonBodyTemplate} header="Acciones"></Column>
        </DataTable>
    );
};
