import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import axios from 'axios'
import { Password } from 'primereact/password';
import { UserService } from "../../service/UserService";
 
const urlRoles = 'http://localhost:5000/roles/'


export default function CreateUser() {
    const _userService = new UserService();
    
    const acceptModalConfirmation = (lifeTime) => {
       
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };

    const createUserConfirmation = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear este producto?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            accept: createUser,
            reject,
        });
    };
    const confirm2 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept: acceptModalConfirmation,
            reject,
        });
    };
    
    const toast = useRef(null);
    const [selectedRol, setSelectedRol] = useState([null]);

    const [userAdress, setUserAdress] = useState("");
    const [userName, setUserName] = useState("");
    const [userLastName, setUserLastName] = useState("");
    const [userStatus] = useState(true);
    const [userRoles, setUserRoles] = useState([]);
    const [userPassword, setUserPassword] = useState("");
    useEffect(() => {
        axios.get(urlRoles).then((response) => {
            setUserRoles(response.data);    
        });    

    }, []);
    const onRolChange = (e) => {
        setSelectedRol(e.value);
    };
    function createUser() {
        _userService.createUser(userAdress,userPassword,userName,userLastName,userStatus,selectedRol.id)
        .then((data)=>{
            const lifeTime = 3000;
            toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Usuario Creado exitosamente", life: lifeTime });
            setTimeout(() => {
               console.log('Redirigiendo a otra pagina') 
            }, lifeTime);
            console.log('user created successfully', data);
        })
        .catch(console.error);
      }
    

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
                    <div className="col-sm-12 pt-5">
                        <span className="p-float-label">
                            <InputText className="jjj" id="email" value={userAdress} onChange={(e) => setUserAdress(e.target.value)} />
                            <label htmlFor="email">Correo Electronico</label>
                        </span>
                    </div>
                    <div className="col-sm-12 pt-5 ">
                        <span className="p-float-label">
                            <InputText className="jjj" id="username" value={userName} onChange={(e) => setUserName(e.target.value)} />
                            <label htmlFor="username">Nombre</label>
                        </span>
                    </div>
                    <div className="col-sm-12 pt-5">
                        <span className="p-float-label">
                            <InputText className="jjj" id="lastname" value={userLastName} onChange={(e) => setUserLastName(e.target.value)} />
                            <label htmlFor="lastname">Apellido</label>
                        </span>
                    </div>
                   
                    <div className="col-sm-12 pt-5">
                        <span className="p-float-label">
                             <Password value={userPassword} onChange={(e) => setUserPassword(e.target.value)} />
                            <label htmlFor="telefono">Contraseña</label>
                        </span>
                    </div>
                    <div className="col-sm-12 pt-5">
                        <Dropdown value={selectedRol} options={userRoles} onChange={onRolChange} optionLabel="name" placeholder="Seleccione Rol"  />
                    </div>
                </div>
            </div>
            <div className="create-product-buttons">
                {/* <Button label="Crear" className="p-button-success" />
                <Link to={"/pages/Products/Products"}>
                    <Button label="Cancelar" className="p-button-danger" />
                </Link> */}
                <Button onClick={createUserConfirmation} icon="pi pi-check" label="Crear" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
