import React, { useEffect, useState, useRef } from "react";
import { TableUser } from "../../components/TableUsers/TableUser";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import "./users.css";
import { UserService } from "../../service/UserService";
import { RolesService } from "../../service/RolesService";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";
import { ClientService } from "../../service/ClientService";
import { SaleService } from "../../service/SaleService";

const _clientService = new ClientService();
const _saleService = new SaleService();

const _userService = new UserService();
const _roleService = new RolesService();

export default function Users() {
    const [userSelected, setUserSelected] = useState({});
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    // const [userEmail, setUserEmail] = useState("");
    // const [userName, setUserName] = useState("");
    // const [userPassword, setUserPassword] = useState("");

    // const [userLastname, setUserLastname] = useState("");
    const [userStatus] = useState(true);
    const [users, setUsers] = useState([]);
    const [clients, setClients] = useState([]);
    const [sales, setSales] = useState([]);
    const [roles, setRoles] = useState([]);
    const [rolName, setRoleName] = useState("");
    const [userWithSales, setUserWithSales] = useState({});
    // const refreshPage = ()=>{
    //     window.location.reload();  }
    const refreshPage2 = () => {
        setDisplayDialogEdit(false);
        setUserSelected({});
        loadUsers();
    };

    // const rightContents = (
    //         <Link to={"/pages/CreateUser/CreateUser"}>
    //         <Button label="Agregar Usuario" className="p-button-raised dc-space-between" icon="pi pi-plus-circle"  />
    //         </Link>

    // );
    //----- GET SALES FOR VALIDATION AND CLIENTS
    useEffect(() => {
        _saleService
            .getSales()
            .then((response) => {
                setSales(response);
            })
            .catch((e) => {
                console.log(e, "Error al traer las ventas");
            });
    }, []);

    useEffect(() => {
        _clientService
            .getClients()
            .then((response) => {
                setClients(response);
            })
            .catch((e) => {
                console.log(e, "Error al traer los clientes");
            });
    }, []);

    //----------- END------

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-pencil" onClick={() => onClickDialogEdit()} disabled={!userSelected.name} />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createUserAlert = (form, data) => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta Usuario?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateUser(form, data),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editUserAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta Usuario?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditUser(),
            reject: () => refreshPage2(),
        });
    };
    const editUserStatusAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea cambiar el estado del Usuario?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Cambiar estado",
            rejectLabel: "Cancelar",
            accept: () => EditStatus(),
            reject: () => setDisplayDialogEdit(false),
        });
    };
    const cancelCreate = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => reject(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const cancelEdit = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => refreshPage2(),
            reject: () => setDisplayDialogEdit(true),
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
        setDisplayDialogEdit(false);
        editUserAlert();
    };

    const onHideDialogCreate = (form, data) => {
        createUserAlert(form, data);
        setDisplayDialogCreate(false);
    };
    const onHideDialogCreateX = () => {
        setDisplayDialogCreate(false);
    };
    const onHideDialogEditX = () => {
        setDisplayDialogEdit(false);
        refreshPage2();
    };
    const onHideDialogCancel = () => {
        cancelCreate();
        setDisplayDialogCreate(false);
    };

    const onHideDialogCancelEdit = () => {
        cancelEdit();
        setDisplayDialogEdit(false);
    };

    function EditUser() {
        console.log(userSelected);
        _userService
            .updateUser(userSelected)
            .then(() => {
                setUserSelected({});
                loadUsers();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Usuario  editado exitosamente", life: 3000 });
            })
            .catch((e) => {
                users.forEach((element) => {
                    const userMail = element.email;

                    if (userSelected.email === userMail) {
                        toast.current.show({ severity: "warn", summary: "Correo incorrecto", detail: "El correo ya existe intente editarlo con otro", life: 3000 });
                        setUserSelected({});
                        loadUsers();
                    }
                    setUserSelected({});
                    loadUsers();
                    // else{
                    //     toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                    //     console.log(e);
                    // }
                });
            });
    }
    useEffect(() => {
        clients.map((element) => {
            if (userSelected.id === element.idUser) {
                sales.map((element2) => {
                    if (element.id === element2.idClient) {
                        if (element2.statusSale === "Activo") {
                            setUserWithSales({
                                idUser: element.idUser,
                                name: element.name,
                                statusSale: element2.statusSale,
                            });
                            return element;
                        }
                    }
                });
            }
        });
    }, [setUserWithSales, sales, userSelected, clients]);
    console.log(userWithSales);

    function EditStatus() {
        if (userWithSales.statusSale === "Activo" && userSelected.status === true && userWithSales.idUser === userSelected.id) {
            toast.current.show({ severity: "error", summary: "Error", detail: "El usuario tiene una venta en proceso", life: 3000 });
            loadUsers();
        } else {
            if (userSelected.status === true) {
                userSelected.status = false;
                loadUsers();
            } else if (userSelected.status === false) {
                userSelected.status = true;
                loadUsers();
            }
            _userService
                .updateUser(userSelected)
                .then(() => {
                    setUserSelected({});
                    loadUsers();
                    toast.current.show({ severity: "success", summary: "Confirmación", detail: "El estado del usuario se cambio exitosamente", life: 3000 });
                })
                .catch((e) => {
                    toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                    console.log(e);
                    setUserSelected({});
                    loadUsers();
                });
        }
    }
    function getRoles() {
        _roleService.getRoles().then((response) => {
            setRoles(response);
        });
    }
    function CreateUser(form, data) {
        // console.log(`Esta es los datos: ${data.name} ${data.lastname} rol: ${data.idRol.id} password: ${data.password} email ${data.email}`);

        _userService
            .createUser(data.email, data.password, data.name, data.lastname, userStatus, data.idRol.id)
            .then(() => {
                loadUsers();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Usuario creado exitosamente", life: 3000 });
                form.restart();
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

    const onEditUserSelected = (e) => {
        const userUpdated = {
            ...userSelected,
            [e.target.name]: e.target.value,
        };
        setUserSelected(userUpdated);
    };
    useEffect(() => {
        _userService.getUsers().then((response) => {
            setUsers(response);
        });
    }, []);
    useEffect(() => {
        roles.forEach((element) => {
            if (userSelected.idRol === element.id) {
                console.log(userSelected.idRol);
                setRoleName(element.name);
            }
        });
    }, [userSelected.idRol, setRoleName, roles]);
    const rightContents = (
        <React.Fragment>
            <Button
                label={userSelected.status ? "Desactivar" : "Activar"}
                className={userSelected.status ? "p-button-warning p-button-raised  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                icon="pi pi-eye-slash"
                onClick={() => editUserStatusAlert()}
                disabled={!userSelected.name}
            />
        </React.Fragment>
    );
    const initialValues = {
        idRol: null,
        name: "",
        lastname: "",
        email: "",
        password: "",
        confirmPassword: "",
    };

    const validate = (data) => {
        let errors = {};

        if (!data.idRol) {
            errors.idRol = "Debe asociar un Rol al usuario.";
        } else {
            roles.forEach((element) => {
                if (data.idRol.id === element.id) {
                    if (element.status === false) {
                        errors.idRol = "seleccione un rol activo";
                    }
                }
            });
        }

        if (!data.name) {
            errors.name = "El nombre es requerido";
        }

        if (!data.lastname) {
            errors.lastname = "El apellido es requerido";
        }

        if (!data.email) {
            errors.email = "El email es requerdo";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = "Email invalido. E.g. example@email.com";
        } else
            users.forEach((element) => {
                const userMail = element.email;

                if (data.email === userMail) {
                    errors.email = "El correo ya existe";
                }
            });

        if (!data.password) {
            errors.password = "Debe digitar una contraseña";
        }

        if (data.password !== data.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }

        return errors;
    };
    const onSubmit = (data, form) => {
        onHideDialogCreate(form, data);
    };

    //----------------------EDIT VALIDATION --------------------
    const validateEdit = (data) => {
        let errors = {};

        if (!data.idRol) {
            errors.idRol = "Debe asociar un Rol al usuario.";
        } else {
            roles.forEach((element) => {
                if (data.idRol.id === element.id) {
                    if (element.status === false) {
                        errors.idRol = "seleccione un rol activo";
                    }
                }
            });
        }
        if (!data.name) {
            errors.name = "El nombre es requerido";
        }

        if (!data.lastname) {
            errors.lastname = "El apellido es requerido";
        }
        users.forEach((element) => {
            const userMail = element.email;

            if (data.email === userSelected.email) {
            } else {
                errors.email = "el correo ya existe";
            }
        });

        if (!data.email) {
            errors.email = "El email es requerido";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = "Email invalido. E.g. example@email.com";
        }

        return errors;
    };

    const initialValuesEdit = {
        idRol: userSelected.idRol,
        name: userSelected.name,
        lastname: userSelected.lastname,
        email: userSelected.email,
    };
    const onSubmitEdit = () => {
        userSelected.idRol = userSelected.idRol.id;
        onHideDialogEdit();
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    console.log(rolName);
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Gestión de usuarios</h4>
            </div>
            <Toolbar left={leftContents} right={rightContents} />
            <Dialog header="Crear un nuevo usuario" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="create-user-form">
                                <h5>Ingrese los datos del usuario</h5>
                                <Field
                                    name="email"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="email" className={classNames({ "p-error": isFormFieldValid("email") })}>
                                                    Correo electrónico
                                                </label>
                                                <br />
                                                <InputText id="email" {...input} placeholder="Correo electrónico" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="password"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="password" className={classNames({ "p-error": isFormFieldValid("password") })}>
                                                    Contraseña
                                                </label>
                                                <br />
                                                <Password id="password" {...input} placeholder="Digite su contraseña" className={classNames({ "p-invalid": isFormFieldValid(meta), passwordUsers: true })} toggleMask />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="confirmPassword"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="confirmPassword" className={classNames({ "p-error": isFormFieldValid("confirmPassword") })}>
                                                    Confirmar contraseña
                                                </label>
                                                <br />
                                                <Password id="confirmPassword" {...input} placeholder="Confirmar contraseña" className={classNames({ "p-invalid": isFormFieldValid(meta), passwordUsers: true })} toggleMask />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />

                                <Field
                                    name="name"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}>
                                                    Nombre
                                                </label>
                                                <br />
                                                <InputText id="name" {...input} placeholder="Digite el Nombre" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="lastname"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="lastname" className={classNames({ "p-error": isFormFieldValid("lastmane") })}>
                                                    Apellido
                                                </label>
                                                <br />
                                                <InputText id="lastname" {...input} placeholder="Digite el apellido" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="idRol"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="idRol" className={classNames({ "p-error": isFormFieldValid("idRol") })}>
                                                    Rol{" "}
                                                </label>
                                                <br />
                                                <Dropdown id="idRol" {...input} options={roles} optionLabel="name" placeholder="Seleccione rol" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                                <Button label="Crear Usuario" icon="pi pi-check" />
                            </div>
                        </form>
                    )}
                />
            </Dialog>
            <Dialog header="Editar usuario" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitEdit}
                    initialValues={initialValuesEdit}
                    validate={validateEdit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="create-user-form">
                                <h5>Ingrese los nuevos datos del usuario</h5>
                                <Field
                                    name="email"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="email" className={classNames({ "p-error": isFormFieldValid("email") })}>
                                                    Correo electrónico
                                                </label>
                                                <br />
                                                <InputText id="email" {...input} onChange={onEditUserSelected} placeholder="Correo electrónico" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />

                                <Field
                                    name="name"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}>
                                                    Nombre
                                                </label>
                                                <br />
                                                <InputText id="name" {...input} onChange={onEditUserSelected} placeholder="Digite el Nombre" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="lastname"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="lastname" className={classNames({ "p-error": isFormFieldValid("lastmane") })}>
                                                    Apellido
                                                </label>
                                                <br />
                                                <InputText id="lastname" {...input} onChange={onEditUserSelected} placeholder="Digite el apellido" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="idRol"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="idRol" className={classNames({ "p-error": isFormFieldValid("idRol") })}>
                                                    Rol
                                                </label>
                                                <br />
                                                <Dropdown
                                                    id="idRol"
                                                    {...input}
                                                    options={roles}
                                                    value={userSelected.idRol}
                                                    place
                                                    onChange={onEditUserSelected}
                                                    optionLabel="name"
                                                    placeholder={!userSelected.idRol ? "Seleccione el Rol" : rolName}
                                                    className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })}
                                                />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" type="button" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                                <Button label="Editar Usuario" icon="pi pi-check" autoFocus />
                            </div>
                        </form>
                    )}
                />
            </Dialog>
            <TableUser className="table-users" users={users} setUserSelected={setUserSelected} />
        </div>
    );
}
