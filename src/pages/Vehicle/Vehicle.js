import React from "react";
import { TableVehicle } from "../../components/TableVehicle/TableVehicle";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./vehicle.css";
import { Link } from "react-router-dom";

export default function Vehicles() {
    return (
        <div>
            <div className="tittle-product">
                <h3>Gestión de Vehiculos</h3>
            </div>
            <Link to={"/Vehicles/create"}>
                <Button label="Agregar vehiculo" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
        
            <div className="container-search-product">
                <div className="col-12 md:col-3">
                    <div className="p-inputgroup">
                        <InputText placeholder="Buscar cliente" />
                        <Button icon="pi pi-search" className="p-button-info" />
                    </div>
                </div>
            </div>
            <TableVehicle className="table-products" />
        </div>
    );
}