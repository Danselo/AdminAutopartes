import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
// import { InputText } from "primereact/inputtext";

export default function CreateProduct() {
    return (
        <div>
            <Link to={"/pages/Products/Products"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div>
                <h3>Crear un nuevo producto</h3>
            </div>
            {/* <span className="p-float-label">
                <InputText id="username" value={value2} onChange={(e) => setValue2(e.target.value)} />
                <label htmlFor="username">Username</label>
            </span> */}
        </div>
    );
}
