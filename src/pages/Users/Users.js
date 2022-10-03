import React, {useEffect,useState,useRef} from "react";
import { TableUser } from "../../components/TableUsers/TableUser";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import "./users.css";
import { UserService } from "../../service/UserService";
import {RoleService} from "../../service/RolesService";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Password } from 'primereact/password';
import { Toast } from "primereact/toast";

const _userService = new UserService();
const _roleService = new RoleService();


export default function Users() {
    const [userSelected, setUserSelected] = useState({})
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [userEmail, setUserEmail] = useState("");
    const [userName, setUserName] = useState("");
    const [userPassword, setUserPassword] = useState("");

    const [userLastname, setUserLastname] = useState("");
    const [userStatus] = useState(true);

    const [selectedUserRole, setSelectedUserRole] = useState("");
    const [users, setUsers] = useState([]);
    const [roles, setRoles] = useState([]);
    // const leftContents = (
    //         // <Link to={"/pages/CreateUser/CreateUser"}>
    //         // <Button label="Agregar Usuario" className="p-button-raised dc-space-between" icon="pi pi-plus-circle"  />
    //         // </Link>


    // );
    const rightContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!userSelected.name}  />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createUserAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta Usuario?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateUser(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editUserAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta Usuario?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditUser(),
            reject: () => setDisplayDialogEdit(false),
        });
    };
    const cancelCreate = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => reject(),
            reject: () => setDisplayDialogCreate(true),
        });
    };
    function onClickDialogCreate() {
        getRoles();
        setDisplayDialogCreate(true);
    }

    function onClickDialogEdit() {
        getRoles();
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = () => {
        editUserAlert();
        setDisplayDialogEdit(false);
    };

    const onHideDialogCreate = () => {
        createUserAlert();
        setDisplayDialogCreate(false);
    };
    const onHideDialogCreateX = () => {
        setDisplayDialogCreate(false);
    };
    const onHideDialogEditX = () => {
        setDisplayDialogCreate(false);
    };
    const onHideDialogCancel = () => {
        cancelCreate();
        setDisplayDialogCreate(false);
    };

    const onHideDialogCancelEdit = () => {
        cancelCreate();
        setDisplayDialogEdit(false);
    };

    const onUserRolChange = (e) => {
        setSelectedUserRole(e.value);
    };
    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Crear Usuario" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
            </div>
        );
    };

    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                <Button label="Editar Usuario" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus  />
            </div>
        );
    };
    function EditUser() {
        console.log(userSelected);
        _userService.updateUser(userSelected)
            .then(() => {
                setUserSelected({});
                loadUsers();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria edita exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }
    function getRoles() {
        _roleService.getRoles().then((response) => {
            setRoles(response);
        });
    }
    function CreateUser() {
        _userService
            .createUser(userEmail,userPassword, userName,userLastname,userStatus,selectedUserRole.id)
            .then(() => {
                setUserName("");
                loadUsers();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Usuario creado exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }
    const loadUsers = () => {
        _userService.getUsers().then((response) => {
            setUsers(response);
        });
    };

    const onEditUserSelected =  (e)=>{
        console.log(e)
         const userUpdated = {
            ...userSelected,
            [e.target.name]:e.target.value
        }
        console.log(userUpdated);
        setUserSelected(userUpdated)
    }
    useEffect(() => {
        _userService.getUsers().then((response) => {
            setUsers(response);
        });
    }, []);
    // const rightContents = (
    //     <React.Fragment>
    //         <Button label="Desactivar" className="p-button-raised p-button-warning dc-space-between" icon="pi pi-eye-slash" onClick={() => onClickDialogCreate()} />
    //     </React.Fragment>
    // );
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h3>Gestión de Usuarios</h3>
            </div>
            <Toolbar right={rightContents} />
            <Dialog header="Crear un nuevo Usuario" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }} footer={renderFooterDialog()}>
                <div className="create-user-form">
                    <h5>Ingrese los datos del Usuario</h5>

                    <div className="create_user_form_complete_name">
                    <InputText name="email" value={userEmail} onChange={(e) => setUserEmail(e.target.value)} placeholder="Correo Electronico" className="create-vehicle-form__input" />
                    <Password  name="password" value={userPassword } onChange={(e) => setUserPassword(e.target.value)} placeholder="Digite su contraseña" toggleMask />
                    </div>
                    <div className="create_user_form_complete_name">
                    <InputText name="name" value={userName} onChange={(e) => setUserName(e.target.value)} placeholder="Digite el Nombre" className="create-vehicle-form__input" />
                    <InputText name="lastname" value={userLastname} onChange={(e) => setUserLastname(e.target.value)} placeholder="Digite el Apellido" className="create-vehicle-form__input" />
                    </div>
                    <Dropdown  value={selectedUserRole} options={roles} onChange={onUserRolChange} optionLabel="name" placeholder="Rol" className="create-vehicle-form__dropdown" />
                </div>
            </Dialog>
            <Dialog header="Editar usuario" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialogEdit()}>
            <div className="create-user-form">
                    <h5>Ingrese los datos del Usuario</h5>
                    <InputText  name="email" value={userSelected.email} onChange={onEditUserSelected} placeholder="Correo Electronico" className="create-vehicle-form__input" />
                    <InputText name="name" value={userSelected.name} onChange={onEditUserSelected} placeholder="Digite el Nombre" className="create-vehicle-form__input" />
                    <InputText name="lastname" value={userSelected.lastname} onChange={onEditUserSelected} placeholder="Digite el Apellido" className="create-vehicle-form__input" />
                    <Password name="password" value={userSelected.password} onChange={onEditUserSelected} placeholder="Digite su contraseña" toggleMask />
                    <Dropdown value={userSelected.idRol} 
                    name="idRol" optionValue="id"
                    options={roles} onChange={onEditUserSelected} optionLabel="name" placeholder="Rol del usuario" className="create-vehicle-form__dropdown" />
                </div>
            </Dialog>
            <TableUser className="table-users" users = {users} setUserSelected={setUserSelected} />

        </div>
    );
}