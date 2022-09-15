import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableVehicle.css";
import { buttonBodyTemplate } from "./columnTemplateVehicle";

export const TableVehicle = () => {
    const [Vehicle, setVehicle] = useState([]);

    useEffect(() => {
        setVehicle([
            {
                id_vehiculo: 1,
                nombre: "2012",
            },
        ]);
    }, []);

    return (
        <DataTable header="Vehiculos" value={Vehicle} resizableColumns columnResizeMode="expand" stripedRows paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-product" rows={10}>
            <Column field="id_vehiculo" sortable header="Id vehiculo"></Column>
            <Column field="nombre" sortable header="Nombre"></Column>
            <Column body={buttonBodyTemplate} sortable header="Acciones"></Column>
        </DataTable>
    );
};