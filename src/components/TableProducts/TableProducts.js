import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableProducts = ({ setProductSelected, products }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [TableProductsSelected, setTableProductsSelected] = useState([]);
    
    useEffect(() => {
        if (TableProductsSelected) {
            setProductSelected(TableProductsSelected);
        }
    }, [TableProductsSelected, setProductSelected]);
    return (
        <>
        <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar vehiculo" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

        <DataTable 
        header="Productos" 
        stripedRows 
        showGridlines
        value={products} 
        paginator 
        responsiveLayout="scroll" 
        dataKey="id" 
        emptyMessage="No se encontraron datos" className="table-product" 
        rows={10}
        globalFilter={globalFilter}
        selection={TableProductsSelected}
        
        onSelectionChange={(e) => setTableProductsSelected(e.value)}
        >
            <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
            <Column field="id" sortable header="Id"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            {/* <Column field="photo" header="Imagen" body={imageBodyTemplate}></Column> */}
            <Column field="idCategory" sortable header="Categoria"></Column>
            <Column field="amount" sortable header="Cantidad en stock"></Column>
            <Column field="iva" header="Iva"></Column>
            <Column field="price" sortable header="Precio"></Column>
        </DataTable>
        </>
    )
    
}

