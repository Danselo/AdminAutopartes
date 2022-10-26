import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./dataTableProduct.css"

export const TableProducts = ({ setProductSelected, products }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    
    const [TableProductSelected, setTableProductSelected] = useState([]);
   
    
    useEffect(() => {
        if (TableProductSelected) {
            setProductSelected(TableProductSelected);
        }
    }, [TableProductSelected, setProductSelected]);

    const statusBodyTemplate = (rowData) => {
        console.log("producto seleccionado",rowData)
        if (rowData.state === true) {
            return <span className="product-badge-state-active">ACTIVO</span>;
        }else if(rowData.state === false){
            return <span className="product-badge-state-inactive">INACTIVO</span>;
        }else{
            return <span className="product-badge-state-na">NA</span>; 
        }
        
    }

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
        className="table-product"
        paginator 
        responsiveLayout="scroll" 
        dataKey="id" 
        emptyMessage="No se encontraron datos" 
        rows={10}
        globalFilter={globalFilter}
        selection={TableProductSelected}        
        onSelectionChange={(e) => setTableProductSelected(e.value)}
        >
            <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
            <Column field="id" frozen sortable header="Id"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            <Column field="category.name" sortable header="Categoria"></Column>
            <Column field="amount" className="table-product--column-gray" sortable header="Cantidad en stock"></Column>
            <Column field="iva" className="table-product--column-gray" header="Iva"></Column>
            <Column field="price" className="table-product--column-gray" sortable header="Precio"></Column>
            <Column field="state" body={statusBodyTemplate} header="Estado"></Column>
        </DataTable>
        </>
    )
    
}

