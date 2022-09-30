import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableBuys = ({ setBuySelected, buys }) => {
    const [globalFilter, setGlobalFilter] = useState(null);

    const [TableBuysSelected, setTableBuysSelected] = useState([]);
    
    useEffect(() => {
        if (TableBuysSelected) {
            setBuySelected(TableBuysSelected);
        }
    }, [TableBuysSelected, setBuySelected]);
    
    return (
        <>
        <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar compra" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

        <DataTable 
        header="Compras" 
        stripedRows 
        showGridlines
        value={buys} 
        paginator 
        responsiveLayout="scroll" 
        dataKey="id" 
        emptyMessage="No se encontraron compras" className="table-product" 
        rows={10}
        globalFilter={globalFilter}
        selection={TableBuysSelected}
        
        onSelectionChange={(e) => setTableBuysSelected(e.value)}
        >
            <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
            <Column field="id" frozen={true} sortable header="Id"></Column>
            <Column field="idProvider"  header="Id proveedor"></Column>
            <Column field="datePurchase" sortable header="Fecha de compra"></Column>
            <Column field="invoiceNumber" className="table-product--column-gray" sortable header="Num factura"></Column>
            <Column field="totalPurchase" className="table-product--column-gray" header="Total compra"></Column>
            <Column field="shippingPrice" className="table-product--column-gray" header="Precio de envio"></Column>
            <Column field="ivaPercentage" className="table-product--column-gray" hidden header="IVA"></Column>
            <Column field="totalIva" className="table-product--column-gray"  header="Total IVA"></Column>
            <Column field="otherTaxesPercentage" className="table-product--column-gray" hidden header="Otros impuestos"></Column>
            <Column field="totalOtherTaxes" className="table-product--column-gray"  header="Total otros impuestos"></Column>
            <Column field="discountsPercentage" className="table-product--column-gray" hidden  header="Descuento"></Column>
            <Column field="totalDiscounts" className="table-product--column-gray" header="Total descuentos"></Column>
            <Column field="invoiceUrl" className="table-product--column-gray"  header="Factura"></Column>
            
        </DataTable>
        </>
    )
    
}
