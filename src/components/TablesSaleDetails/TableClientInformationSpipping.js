import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableClientInformation.css";
import { buttonBodyTemplate } from "./columnTemplateClientInformation";

export const TableClient = () => {
    const [Client, setClient] = useState([]);

    useEffect(() => {
        setClient([
            {
                Pais: "Colombia",
                departamento: "Antioquia",
                ciudad: "Envigado",
                barrio:"El trianon",
                direccion:"Cra 24 F #40 sur 163 int 204",
                indicaciones: "",
                
            },

        ]);
    }, []);

    return (
        <DataTable header="Informacion Envio" value={Client} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="pais" sortable header="Pais"></Column>
            <Column field="departamento" sortable header="Departamento"></Column>
            <Column field="ciudad" sortable header="Ciudad"></Column>
            <Column field="barrio" sortable header="Barrio"></Column>
            <Column field="direccion" sortable header="Dirección"></Column>
            <Column field="indicaciones" sortable header="Indicaciones"></Column>
            
            
        </DataTable>
    );
};