import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createProvider.css";

export default function CreateProvider() {
    const accept = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Proveedor creado exitosamente", life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const confirm1 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear este proveedor?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            accept,
            reject,
        });
    };

    const confirm2 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept,
            reject,
        });
    };

    const toast = useRef(null);
    const [value1, setValue1] = useState("");
    const [value2, setValue2] = useState("");
    const [value3, setValue3] = useState("");
    const [value4, setValue4] = useState("");
    const [value5, setValue5] = useState("");
    const [value6, setValue6] = useState("");
    const [value7, setValue7] = useState("");
    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/pages/Providers/Provider"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-product-tittle">
                <h3>Crear un nuevo proveedor</h3>
            </div>

            <div className="create-product-form">
                <span className="p-float-label">
                    <InputText className="jjj" id="nit" value={value1} onChange={(e) => setValue1(e.target.value)} />
                    <label htmlFor="nit">Nit empresa</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="company_name" value={value2} onChange={(e) => setValue2(e.target.value)} />
                    <label htmlFor="company_name">Nombre empresa</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="contact_name" value={value3} onChange={(e) => setValue3(e.target.value)} />
                    <label htmlFor="contact_name">Nombre contacto directo</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="telephone" value={value4} onChange={(e) => setValue4(e.target.value)} />
                    <label htmlFor="telephone">Telefono</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="addres" value={value5} onChange={(e) => setValue5(e.target.value)} />
                    <label htmlFor="addres">Direccion</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="email" value={value6} onChange={(e) => setValue6(e.target.value)} />
                    <label htmlFor="email">Email</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="country" value={value7} onChange={(e) => setValue7(e.target.value)} />
                    <label htmlFor="country">Pais</label>
                </span>
            </div>
            <div className="create-product-buttons">
                {/* <Button label="Crear" className="p-button-success" />
                <Link to={"/pages/Products/Products"}>
                    <Button label="Cancelar" className="p-button-danger" />
                </Link> */}
                <Button onClick={confirm1} icon="pi pi-check" label="Crear" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
