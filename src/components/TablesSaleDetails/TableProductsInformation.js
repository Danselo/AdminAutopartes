import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
// import "./dataTableProduct.css";

export const TableProductsInformation = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        setProducts([
            {
                id_producto: 1,
                nombre_producto: "Bateria",
                categoria: "baterias",
                marca: "ford",
                cantidad: 5,
                precio_unitario: 120000,
                iva: 0.19,
                subtotal: 714000,
            },
        ]);
    }, []);

    return (
        <DataTable header="Productos" stripedRows value={products} paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_producto" header="Id"></Column>
            <Column field="nombre_producto" header="Nombre"></Column>
            <Column field="categoria" header="Categoria"></Column>
            <Column field="marca" header="Marca"></Column>
            <Column field="cantidad" header="Cantidad"></Column>
            <Column field="precio_unitario" header="Precio"></Column>
            <Column field="iva" header="Iva"></Column>
            <Column field="subtotal" header="Precio"></Column>
        </DataTable>
    );
};
