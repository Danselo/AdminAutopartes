
import { DataTable } from 'primereact/datatable';
import React, { useState, useEffect } from 'react';
import { Column } from 'primereact/column';
import './dataTableProduct.css';
import { imageBodyTemplate, buttonBodyTemplate } from './columnTemplates';

export const TableProducts = () => {

    const [products, setProducts] = useState([])

    useEffect(() => {
        setProducts([{ id: 1, nombre: "Bateria", img: 'bamboo-watch.jpg', categoria: "baterias", marca: "ford", cantidad: 5, iva: 0.19, precio: 120000 }])
    }, [])


    return (
        <DataTable value={products} responsiveLayout="scroll">
            <Column field="id" header="Id"></Column>
            <Column field="nombre" header="Nombre"></Column>
            <Column header="Imagen" body={imageBodyTemplate}></Column>
            <Column field="categoria" header="Categoria"></Column>
            <Column field="marca" header="Marca"></Column>
            <Column field="cantidad" header="Cantidad"></Column>
            <Column field="iva" header="Iva"></Column>
            <Column field="precio" header="Precio"></Column>
            <Column body={buttonBodyTemplate} header="Acciones"></Column>



        </DataTable>
    );

}
