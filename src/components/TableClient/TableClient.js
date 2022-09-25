import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableClient.css";
import { buttonBodyTemplate } from "./columnTemplateClient";
import axios from 'axios'
const url = 'http://localhost:5000/clients/'
export const TableClient = () => {
    const [clients, setClients] = useState([]);
  

   useEffect(() => {
    axios.get(url).then((response) => {
        console.log(response)
        setClients(response.data);           
    });
}, []);


    return (
        <DataTable header="Clientes" value={clients} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id" sortable header="Id"></Column>
            <Column field="idUser" sortable header="Id Usuario"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            <Column field="lastname" sortable header="Apellido"></Column>
            <Column field="documentType" sortable header="Tipo Documento"></Column>
            <Column field="document" sortable header="Documento"></Column>
            <Column field="telephone" sortable header="Telefono"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="country" sortable header="Pais"></Column>
            <Column field="department" sortable header="Departamento"></Column>
            <Column field="city" sortable header="Departamento"></Column>
            <Column field="neightboorhood" sortable header="Departamento"></Column>
            <Column field="address" sortable header="Departamento"></Column>

            
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
        </DataTable>
    );
};