import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import { TableBrand } from "../../components/TableBrand/TableBrand";


export default function Brand() {
    return (
        <div>
            <div className="text-center">
                <h3>Marcas Registradas</h3>
            </div>
            <Link to={"/pages/CreateBrand/CreateBrand"}>
            <Button label="Registrar Marca" icon=" pi pi-plus-circle"  className="p-button-raised p-button-info"/>
            </Link>
            <div className="container search-user p-2">
                <div className="row d-flex flex-row-reverse">
                    <div className="col-12 md:col-3 ">
                            <div className="p-inputgroup ">
                                <InputText placeholder="Buscar Marca"/>
                                <Button icon="pi pi-search" className="p-button-primary"/>
                            </div>
                        </div>
                </div>
                 
            </div>
            
            <TableBrand className="table-products" />
        </div>
    );
}