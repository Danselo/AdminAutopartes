import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableSales = ({ setSaleSelected, sales }) => {
    const [globalFilter, setGlobalFilter] = useState(null);

    const [TableSalesSelected, setTableSalesSelected] = useState([]);
    
    useEffect(() => {
        if (TableSalesSelected) {
            setSaleSelected(TableSalesSelected);
        }
    }, [TableSalesSelected, setSaleSelected]);
    
    return (
        <>
        <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar venta" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

        <DataTable 
        header="Ventas" 
        stripedRows 
        showGridlines
        value={sales} 
        paginator 
        responsiveLayout="scroll" 
        dataKey="id" 
        emptyMessage="No se encontraron ventas" className="table-product" 
        rows={10}
        globalFilter={globalFilter}
        selection={TableSalesSelected}
        
        onSelectionChange={(e) => setTableSalesSelected(e.value)}
        >
            <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
            <Column field="id" frozen={true} sortable header="Id"></Column>
            <Column field="idClient"  header="Id cliente"></Column>
            <Column field="saleDate" sortable header="Fecha de venta"></Column>
            <Column field="statusSale" className="table-product--column-gray" sortable header="Estado"></Column>
            <Column field="statusPayment" className="table-product--column-gray" header="Esatdo del pago"></Column>
            <Column field="totalPurchase" className="table-product--column-gray" header="Total compra"></Column>
            
        </DataTable>
        </>
    )
    
}