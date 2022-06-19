import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import "./roles.css";
import { TableRoles } from "../../components/TableRoles/TableRoles";


export default function Roles() {
    return (
        <div>
            <div className="text-center">
                <h3>Roles</h3>
            </div>
            <Link to={"/pages/CreateRol/CreateRol"}>
            <Button label="Registrar Rol" icon=" pi pi-plus-circle"  className="p-button-raised p-button-info"/>
            </Link>
            <div className="container search-user p-2">
                <div className="row d-flex flex-row-reverse">
                    <div className="col-12 md:col-3 ">
                            <div className="p-inputgroup ">
                                <InputText placeholder="Buscar Rol"/>
                                <Button icon="pi pi-search" className="p-button-primary"/>
                            </div>
                        </div>
                </div>
                 
            </div>
            
            <TableRoles className="table-products" />
        </div>
    );
}