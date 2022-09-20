import React from "react";
import { TableProducts } from "../../components/TableProducts/TableProducts";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./products.css";
import { Link } from "react-router-dom";

export default function Products() {
    return (
        <div>
            <div className="tittle-product">
                <h3>Gestión de productos</h3>
            </div>
            <Link to={"/pages/Products/CreateProduct"}>
                <Button label="Agregar producto" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
           
            <div className="container-search-product">
                <div className="col-12 md:col-3">
                    <div className="p-inputgroup">
                        <InputText placeholder="Buscar producto" />
                        <Button icon="pi pi-search" className="p-button-info" />
                    </div>
                </div>
            </div>
            <TableProducts className="table-products" />
        </div>
    );
}
