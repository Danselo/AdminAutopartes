import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createProvider.css";

export default function EditProvider() {
    const accept = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Proveedor editado exitosamente", life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Ha cancelado", detail: "El proveedor no se ha editado", life: 3000 });
    };

    const accept_cancel = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Ha cancelado el proceso", life: 3000 });
    };

    const reject_cancel = () => {
        toast.current.show({ severity: "info", summary: "", detail: "Puede seguir editando", life: 3000 });
    };
    const confirm1 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar este proveedor?",
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
            accept: accept_cancel,
            reject: reject_cancel,
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
            <Link to={"/Providers"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-product-tittle">
                <h3>Editar proveedor</h3>
            </div>

            <div className="create-product-form">
                <span className="">
                    <label htmlFor="nit">Nit empresa</label>
                    <InputText className="jjj" id="nit" value={value1} placeholder="32323434" onChange={(e) => setValue1(e.target.value)} />
                </span>
                <span className="">
                    <label htmlFor="company_name">Nombre empresa</label>
                    <InputText className="jjj" id="company_name" value={value2} placeholder="U.S Cars" onChange={(e) => setValue2(e.target.value)} />
                </span>
                <span className="">
                    <label htmlFor="contact_name">Nombre contacto directo</label>
                    <InputText className="jjj" id="contact_name" value={value3} placeholder="Juan Andres Gomez" onChange={(e) => setValue3(e.target.value)} />
                </span>
                <span className="">
                    <label htmlFor="telephone">Telefono</label>
                    <InputText className="jjj" id="telephone" value={value4} placeholder="+58 304 554 2123" onChange={(e) => setValue4(e.target.value)} />
                </span>
                <span className="">
                    <label htmlFor="addres">Direccion</label>
                    <InputText className="jjj" id="addres" value={value5} placeholder="Cra 24 F #40 sur 163 int 204" onChange={(e) => setValue5(e.target.value)} />
                </span>
                <span className="">
                    <label htmlFor="email">Email</label>
                    <InputText className="jjj" id="email" value={value6} placeholder="juan.andres.gomez@gmail.com" onChange={(e) => setValue6(e.target.value)} />
                </span>
                <span className="">
                    <label htmlFor="country">Pais</label>
                    <InputText className="jjj" id="country" value={value7} placeholder="Colombia" onChange={(e) => setValue7(e.target.value)} />
                </span>
            </div>
            <div className="create-product-buttons">
                {/* <Button label="Crear" className="p-button-success" />
                <Link to={"/pages/Products/Products"}>
                    <Button label="Cancelar" className="p-button-danger" />
                </Link> */}
                <Button onClick={confirm1} icon="pi pi-check" label="Editar" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
