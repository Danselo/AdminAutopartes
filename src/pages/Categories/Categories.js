import React from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Link } from "react-router-dom";
import { TableCategories } from "../../components/TableCategories/TableCategories";


export default function Categories() {
    return (
        <div>
            <div className="text-center">
                <h3>Categorias Registradas</h3>
            </div>
            <Link to={"/CreateCategories"}>
            <Button label="Registrar Categoria" icon=" pi pi-plus-circle"  className="p-button-raised p-button-info"/>
            </Link>
            <div className="container search-user p-2">
                <div className="row d-flex flex-row-reverse">
                    <div className="col-12 md:col-3 ">
                            <div className="p-inputgroup ">
                                <InputText placeholder="Buscar Categoria"/>
                                <Button icon="pi pi-search" className="p-button-primary"/>
                            </div>
                        </div>
                </div>
                 
            </div>
            
            <TableCategories className="table-products" />
        </div>
    );
}