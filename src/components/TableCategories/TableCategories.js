import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { buttonBodyTemplate } from "./columnTemplateCategories";
import { buttonBodyTemplate2 } from "./columnTemplateProducts";




export const TableCategories = () => {
    const [Categories, setCategories] = useState([]);

    useEffect(() => {
        setCategories([{ id_categoria: 1467, nombre: "Ford", productos_registrados: 13}]);


    }, []);
    

    

    return (
        <DataTable value={Categories} paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_categoria" sortable header="Id"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column field="productos_registrados" sortable header="Nro Productos Registrados"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
            <Column body={buttonBodyTemplate2} sortable header="Detalles de productos registrados"></Column>
            


        </DataTable>
    );
};