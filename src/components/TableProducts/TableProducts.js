import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { ProductService } from "../../service/ProductService";

const _productService = new ProductService();
export const TableProducts = ({ setProductSelected, products }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [vehiclesOfProducts,setVehiclesOfProducts] = useState({});
    const [TableProductsSelected, setTableProductsSelected] = useState([]);
    
    useEffect(() => {
        if (TableProductsSelected) {
            setProductSelected(TableProductsSelected);
        }
    }, [TableProductsSelected, setProductSelected]);
    
    useEffect(() => {
        _productService.getVehiclesOfProducts().then((response) =>{
            setVehiclesOfProducts(response)
        })
    }, []); 
    
    console.log(vehiclesOfProducts);
    const getVehiclesOfProductTemplate = (RowProductData) =>{
        
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
            <Column field="id" frozen sortable header="Id"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            {/* <Column field="photo" header="Imagen" body={imageBodyTemplate}></Column> */}
            <Column field="category.name" sortable header="Categoria"></Column>
            <Column field="amount" className="table-product--column-gray" sortable header="Cantidad en stock"></Column>
            <Column field="iva" className="table-product--column-gray" header="Iva"></Column>
            <Column field="price" className="table-product--column-gray" sortable header="Precio"></Column>
            <Column body={getVehiclesOfProductTemplate} exportable={false} style={{ minWidth: '8rem' }}></Column>
        </DataTable>
        </>
    )
    
}

