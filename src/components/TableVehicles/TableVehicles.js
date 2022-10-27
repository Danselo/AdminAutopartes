import React, { useState, useEffect } from "react";
import "./dataTableVehicle.css";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";

export const TableVehicles = ({ setVehicleSelected, vehicles }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [TableVehiclesSelected, setTableVehiclesSelected] = useState([]);
    useEffect(() => {
        if (TableVehiclesSelected) {
            setVehicleSelected(TableVehiclesSelected);
        }
    }, [TableVehiclesSelected, setVehicleSelected]);

    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar vehiculo" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

            <DataTable
                value={vehicles}
                header="Vehiculos"
                paginator
                responsiveLayout="scroll"
                emptyMessage="No se encontraron datos"
                className="table-vehicles"
                showGridlines
                stripedRows 
                rows={10}
                selection={TableVehiclesSelected}
                onSelectionChange={(e) => setTableVehiclesSelected(e.value)}
                dataKey="id"
                globalFilter={globalFilter}
            >
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" sortable header="Id vehiculo"></Column>
                <Column field="name" sortable header="Nombre"></Column>
                <Column field="model" sortable header="Modelo"></Column>
                <Column field="brands_vehicles.name" sortable header="Marca"></Column>
                <Column field="status" sortable header="Estado"></Column>
            </DataTable>
        </>
    );
};
