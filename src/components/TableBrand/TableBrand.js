import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { buttonBodyTemplate } from "./columnTemplates";
import { buttonBodyTemplate2 } from "./columnTemplates2";


export const TableBrand = () => {
    const [users, setUsers] = useState([]);

    useEffect(() => {
        setUsers([{ idMarca: 1467, nombre: "Ford", NroProductosRegistrados: 13}]);


    }, []);
    

    

    return (
        <DataTable value={users} paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="idMarca" sortable header="Id"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column field="NroProductosRegistrados" sortable header="Nro Productos Registrados"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
            <Column body={buttonBodyTemplate2} sortable header="Detalles de productos registrados"></Column>


        </DataTable>
    );
};
