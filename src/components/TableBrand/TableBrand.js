import React, { useState, useEffect } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { buttonBodyTemplate } from "./columnTemplates";
import axios from 'axios'

const url = 'http://localhost:5000/brands/'

export const TableBrand = () => {
    const [brands, setBrands] = useState([]);
  

   useEffect(() => {
    axios.get(url).then((response) => {
        console.log(response)
        setBrands(response.data);           
    });
}, []);





// useEffect(() => {
//     // setBrands([{ idMarca: 1467, nombre: "Ford", NroProductosRegistrados: 13}]);
//     setBrands(data)
// }, []);


    

    return (
        <DataTable value={brands}
        stripedRows
        paginator
        responsiveLayout="scroll" 
        dataKey="id" 
        emptyMessage="No se encontraron datos" 
        className="table-product" 
        rows={10}
        size="small">
            <Column field="id" sortable header="Id"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            {/* <Column field="NroProductosRegistrados" sortable header="Nro Productos Registrados"></Column> */}
            <Column body={buttonBodyTemplate}  header="Acciones"></Column>
        </DataTable>
    );
};
