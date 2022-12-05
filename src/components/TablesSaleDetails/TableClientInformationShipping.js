import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
// import "./dataTableClientInformation.css";

export const TableClientInformationShipping = () => {
    const [Client, setClient] = useState([]);

    useEffect(() => {
        setClient([
            {
                pais: "Colombia",
                departamento: "Antioquia",
                ciudad: "Envigado",
                barrio: "El trianon",
                direccion: "Cra 24 F #40 sur 163 int 204",
                indicaciones: "",
            },
        ]);
    }, []);

    return (
        <DataTable header="Información Envio" value={Client} resizableColumns columnResizeMode="expand" stripedRows responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="pais" header="Pais"></Column>
            <Column field="departamento" header="Departamento"></Column>
            <Column field="ciudad" header="Ciudad"></Column>
            <Column field="barrio" header="Barrio"></Column>
            <Column field="direccion" header="Dirección"></Column>
            <Column field="indicaciones" header="Indicaciones"></Column>
        </DataTable>
    );
};
