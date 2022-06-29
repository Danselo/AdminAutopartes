import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableProduct.css";
import { imageBodyTemplate, buttonBodyTemplate } from "./columnTemplates";

export const TableProducts = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts([{ 
        id_producto: 1,
        nombre_producto: "Bateria",  
        categoria: "baterias", 
        marca: "ford", 
        cantidad: 5, 
        precio_unitario:120000,
        iva: 0.19, 
        subtotal: 714000 }]);
    }, []);

    return (
        <DataTable header="Productos" stripedRows value={products} paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_producto" sortable header="Id"></Column>
            <Column field="nombre_producto" sortable header="Nombre"></Column>
            <Column field="categoria" sortable header="Categoria"></Column>
            <Column field="marca" sortable header="Marca"></Column>
            <Column field="cantidad" sortable header="Cantidad"></Column>
            <Column field="precio_unitario" sortable header="Precio"></Column>
            <Column field="iva" sortable header="Iva"></Column>
            <Column field="subtotal" sortable header="Precio"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
        </DataTable>
    );
};
