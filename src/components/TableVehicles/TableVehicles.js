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

    const statusBodyTemplate = (rowData) => {
        if (rowData.status === true) {
            return <span className="vehicle-badge-status-active">ACTIVO</span>;
        }else if(rowData.status === false){
            return <span className="vehicle-badge-status-inactive">INACTIVO</span>;
        }else{
            return <span className="vehicle-badge-status-na">NA</span>; 
        }
        
    }

    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar vehículo" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

            <DataTable
                value={vehicles}
                header="Vehículos"
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
                <Column field="id" sortable header="Id vehículo"></Column>
                <Column field="name" sortable header="Nombre"></Column>
                <Column field="model" sortable header="Modelo"></Column>
                <Column field="brands_vehicles.name" sortable header="Marca"></Column>
                <Column field="status" body={statusBodyTemplate} header="Estado"></Column>
            </DataTable>
        </>
    );
};
