import React from "react";
import { TableUser } from "../../components/TableUsers/TableUser";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";

import "./users.css";


export default function Users() {
    return (
        <div>
            <div className="text-center">
                <h3>Gestión de Usuarios</h3>
            </div>
            <Link to={"/pages/CreateUser/CreateUser"}>
            <Button label="Agregar Usuario" icon=" pi pi-user-plus"  className="p-button-raised p-button-info"/>
            </Link>
            <div className="container search-user p-2">
                <div className="row d-flex flex-row-reverse">
                    <div className="col-12 md:col-3 ">
                            <div className="p-inputgroup ">
                                <InputText placeholder="Buscar Usuario"/>
                                <Button icon="pi pi-search" className="p-button-primary"/>
                            </div>
                        </div>
                </div>
                 
            </div>
            
            <TableUser className="table-products" />
        </div>
    );
}