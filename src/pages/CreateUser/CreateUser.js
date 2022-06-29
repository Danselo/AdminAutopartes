import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export default function CreateUser() {
    const accept = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Usuario creado exitosamente", life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const confirm1 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar este Usuario?",
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
    const [value2, setValue2] = useState("");
    const [value3, setValue3] = useState("");
    const [value4, setValue4] = useState("");
    const [value5, setValue5] = useState("");

    // const [setValue] = useState("");

    const [selectedRoles, setSelectedRoles] = useState(null);

    const roles = [
        { name: "Administrador1", code: "AD1" },
        { name: "Administrador de Productos", code: "ADP" },
        { name: "Administrador Marcas", code: "ADM" },
        { name: "Administrador Secundario", code: "ADS" },
        { name: "Admin tres", code: "ADT" },
    ];

    const onRolesChange = (e) => {
        setSelectedRoles(e.value);
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/pages/Users/Users"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="text-center">
                <h3>Agregar un Nuevo Usuario</h3>
            </div>

            <div className="create-product-form">
                <div className="row">
                    <div className="col-sm-12">
                        <span className="p-float-label">
                            <InputText className="jjj" id="email" value={value2} onChange={(e) => setValue2(e.target.value)} />
                            <label htmlFor="email">Correo Electronico</label>
                        </span>
                    </div>
                    <div className="col-sm-12 pt-2 ">
                        <span className="p-float-label">
                            <InputText className="jjj" id="username" value={value3} onChange={(e) => setValue3(e.target.value)} />
                            <label htmlFor="username">Nombre</label>
                        </span>
                    </div>
                    <div className="col-sm-12 pt-2">
                        <span className="p-float-label">
                            <InputText className="jjj" id="lastname" value={value4} onChange={(e) => setValue4(e.target.value)} />
                            <label htmlFor="lastname">Apellido</label>
                        </span>
                    </div>
                    <div className="col-sm-12 pt-2">
                        <span className="p-float-label">
                            <InputText className="jjj" id="telefono" value={value5} onChange={(e) => setValue5(e.target.value)} />
                            <label htmlFor="telefono">Telefono</label>
                        </span>
                    </div>
                    <div className="col-sm-12 pt-2">
                        <Dropdown value={selectedRoles} options={roles} onChange={onRolesChange} optionLabel="name" placeholder="Seleccione Rol" />
                    </div>
                </div>
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
