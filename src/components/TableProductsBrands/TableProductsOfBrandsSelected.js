import React, { useState } from "react";
import "./dataTableProductsBrands.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableProductsOfBrandSelected = ({ products }) => {
    const [globalFilter, setGlobalFilter] = useState(null);

    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar producto" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
            <DataTable
                value={products}
                header="Productos asociados a la marca"
                paginator
                responsiveLayout="scroll"
                emptyMessage="No se encontraron datos"
                className="table-products"
                showGridlines rows={10}
                dataKey="id"
                globalFilter={globalFilter}>
                <Column field="id" sortable header="Id Producto"></Column>
                <Column field="name" sortable header="Nombre"></Column>
                <Column field="category.name" sortable header="Categoria"></Column>
                <Column field="amount" className="table-product--column-gray" sortable header="Cantidad en stock"></Column>
                <Column field="iva" className="table-product--column-gray" header="Iva"></Column>
                <Column field="price" className="table-product--column-gray" sortable header="Precio"></Column>

            </DataTable>
        </>
    );
};
