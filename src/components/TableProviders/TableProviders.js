import React, { useState, useEffect } from "react";
import "./dataTableProviders.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import axios from  'axios';

const url = 'http://localhost:5000/providers/'

export const TableProviders = ({idProviders}) => {
    const [providers, setProviders] = useState([]);
    function setProvidersId(params) {
        
        idProviders(params.id)       
    }
    useEffect(() => {
        axios.get(url).then((response) => {
            setProviders(response.data);           
        });
    }, []);

    return (
        <DataTable value={providers} 
        paginator responsiveLayout="scroll" 
        emptyMessage="No se encontraron datos" 
        className="table-proveedores"
        showGridlines
        rows={10}  
        onSelectionChange={e => setProvidersId(e.value) } 
        dataKey="id" >
            <Column field="id" sortable header="Id proveedor"></Column>
            <Column field="nit" sortable header="Nit"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column field="nombre_contacto" sortable header="Nombre contacto"></Column>
            <Column field="telefono" sortable header="Telefono"></Column>
            <Column field="direccion" sortable header="Direccion"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="pais" sortable header="Pais"></Column>
        </DataTable>
    );
};
