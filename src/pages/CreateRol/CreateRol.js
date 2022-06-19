import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createrol.css";
import { TablePermissions } from "../../components/TablePermissions/TablePermissions";


export default function CreateUser() {
    const accept = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Rol creado exitosamente", life: 3000 });
    };
   
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    
    const confirm1 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar este Rol?",
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
    const [value3, setValue3] = useState("");


    // const [value, setValue] = useState("");

    const [selectedModules, setSelectedModules] = useState(null);
    const [selectedPermissions, setSelectedPermissions] = useState(null);

    

    
    const modules = [
        { name: "Usuarios", code: "US" },
        { name: "Productos", code: "PD" },
        { name: "Compras", code: "CP" },
        { name: "Ventas", code: "VT" },
    ];
    const permissions = [
        { name: "Eliminar", code: "DL" },
        { name: "Editar", code: "ED" },
        { name: "Cambiar estado", code: "ST" },
    ];


  

    const onModulesChange = (e) => {
        setSelectedModules(e.value);
    };
    const onPermissionsChange = (e) => {
        setSelectedPermissions(e.value);
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/pages/Roles/Roles"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="text-center">
                <h3>Agregar Rol</h3>
            </div>
            
            <div className="create-product-form">
               
                <div className="row">
                   
                    <div className="col-sm-12 pt-5 create-rol-form ">
                            <span className="p-float-label">
                            <InputText className="jjj" id="username" value={value3} onChange={(e) => setValue3(e.target.value)} />
                            <label htmlFor="username">Nombre Rol</label>
                        </span>
                    </div>
                    
                    <div className="col-sm-6 pt-5 create-rol-form">
                    <label htmlFor="lastname">Modulos de Acceso</label>
                <Dropdown value={selectedModules} options={modules} onChange={onModulesChange} optionLabel="name" placeholder="Modulo de Acceso" />

                    </div>
                    <div className="col-sm-6 pt-5 create-rol-form">
                    <label htmlFor="lastname">Permisos Por Modulo</label>
                <Dropdown value={selectedPermissions} options={permissions} onChange={onPermissionsChange} optionLabel="name" placeholder="Permisos" />

                    </div>

                </div>
                
                
                

            </div>
            <div className="create-product-buttons">
                {/* <Button label="Crear" className="p-button-success" />
                <Link to={"/pages/Products/Products"}>
                    <Button label="Cancelar" className="p-button-danger" />
                </Link> */}
                 <div className="container search-user p-2">
                <div className="row d-flex flex-row-reverse">
                    <div className="col-6 md:col-3 ">
                            <div className="p-inputgroup ">
                            <Button onClick={confirm1} icon="pi pi-plus-circle" label="Agregar" className="mr-2"></Button>
                            </div>
                        </div>
                        <div className="col-12 pt-5">
            <TablePermissions className="table-products" />

            </div>
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
