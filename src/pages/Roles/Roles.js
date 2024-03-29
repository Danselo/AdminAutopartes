import React, { useState, useRef, useEffect } from "react";
import "./roles.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableRoles } from "../../components/TableRoles/TableRoles";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { RolesService } from "../../service/RolesService";
import { RolesPermissionsService } from "../../service/RolesPermissionsService";
import { MultiSelect } from "primereact/multiselect";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";

import { ModulesService } from "../../service/ModulesService";
import { UserService } from "../../service/UserService";

const _rolService = new RolesService();
const _userService = new UserService();
const _rolesPermissionsService = new RolesPermissionsService();
const _modulesService = new ModulesService();

export default function Roles() {
    const [rolSelected, setRolSelected] = useState({});
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [rolName, setRolName] = useState("");
    const [roles, setRoles] = useState([]);
    const [users, setUsers] = useState([]);
    const [rolSelectedWithUser, setRolSelectedWithUser] = useState();
    const [selectedModules, setSelectedModules] = useState([]);
    const [modules, setModules] = useState([]);
    const [modulesOfRol, setModulesOfRol] = useState([]);
    useEffect(() => {
        _modulesService
            .getModules()
            .then((response) => {
                const modulesFilter = response.filter((module) => module.id !== 1 && module.id !== 12);

                setModules(modulesFilter);
            })
            .catch((error) => {
                console.log("Algo salio mal al traer los módulos de la bd", error);
            });
    }, []);

    const editRolStatusAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea cambiar el estado del Rol?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            onHide: cancelEditRol(),
            acceptLabel: "Cambiar estado",
            rejectLabel: "Cancelar",
            accept: () => EditStatus(),
            reject: () => cancelEditRol(),
        });
    };
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-pencil" onClick={() => onClickDialogEdit()} disabled={!rolSelected.name} />
        </React.Fragment>
    );
    const rightContents = (
        <React.Fragment>
            <Button
                label={rolSelected.status ? "Desactivar" : "Activar"}
                className={rolSelected.status ? "p-button-warning p-button-raised  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                icon="pi pi-eye-slash"
                onClick={() => editRolStatusAlert()}
                disabled={!rolSelected.name || [1, 2].includes(rolSelected.id)}
            />
        </React.Fragment>
    );

    useEffect(() => {
        _rolService.getRoles().then((response) => {
            setRoles(response);
        });
    }, []);

    useEffect(() => {
        _userService.getUsers().then((response) => {
            setUsers(response);
        });
    }, []);

    const createRolAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear esta rol?",
            header: "Confirmación",
            onHide: cancelCreateRol(),
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateRol(),
            reject: () => cancelCreateRol(),
        });
    };

    const editRolAlert = (data) => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta rol?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            onHide: cancelEditRol(),
            rejectLabel: "Cancelar",
            accept: () => EditRol(data),
            reject: () => cancelEditRol(),
        });
    };
    const cancelCreateRol = () => {
        setDisplayDialogCreate(false);
        setSelectedModules([]);
    };
    const cancelEditRol = () => {
        setDisplayDialogEdit(false);
        setSelectedModules([]);
        setRolSelected([]);
    };
    const cancelCreate = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            onHide: cancelCreateRol(),
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => cancelCreateRol(),
            reject: () => setDisplayDialogCreate(true),
        });
    };
    const cancelEdit = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            onHide: cancelEditRol(),
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => cancelEditRol(),
            reject: () => setDisplayDialogEdit(true),
        });
    };
    function onClickDialogCreate() {
        setDisplayDialogCreate(true);
    }

    function onClickDialogEdit() {
        _rolesPermissionsService
            .getModulesOfRolSelected(rolSelected.id)
            .then((response) => {
                let responseMapped = response.map((element) => {
                    return {
                        id: element.modules.id,
                        name: element.modules.name,
                        description: element.modules.description,
                    };
                });
                setModulesOfRol(responseMapped);
            })
            .catch((e) => {
                console.log("Falle aquí", e);
            });
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = (data) => {
        editRolAlert(data);
        setDisplayDialogEdit(false);
    };

    const onHideDialogCreate = () => {
        createRolAlert();
        setDisplayDialogCreate(false);
    };
    const onHideDialogCreateX = () => {
        setSelectedModules([]);
        setDisplayDialogCreate(false);
    };
    const onHideDialogEditX = () => {
        setDisplayDialogEdit(false);
        cancelEditRol();
    };
    const onHideDialogCancel = () => {
        cancelCreate();

        setDisplayDialogCreate(false);
    };

    const onHideDialogCancelEdit = () => {
        cancelEdit();
        setDisplayDialogEdit(false);
    };

    useEffect(() => {
        users.map((element) => {
            if (rolSelected.id === element.idRol) {
                if (element.idRol === rolSelected.id && rolSelected.status === true) {
                    console.log(`id ${rolSelected.id} idROlUser : ${element.idRol}`);
                    setRolSelectedWithUser(true);
                }
            }
        });
    }, [setRolSelectedWithUser, users, rolSelected]);

    function EditStatus() {
        let newStatus = rolSelected.status;
        // if (rolSelectedWithUser) {
        //     toast.current.show({ severity: "error", summary: "Error", detail: "El rol esta asociado a un usuario", life: 3000 });
        //     setRolSelectedWithUser(null);
        // }
        if (rolSelected.status === false) {
            newStatus = true;
        } else if (rolSelected.status === true) {
            newStatus = false;
        }
        console.log(rolSelected);
        _rolService
            .updateStatus(rolSelected, newStatus)
            .then(() => {
                setRolSelected({});
                setRolSelectedWithUser(null);
                loadRoles();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "El estado del rol se cambio exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "No puedes desactivar un rol que tenga usuarios asociados", life: 3000 });
                console.log(e);
                setRolSelectedWithUser(null);
                setRolSelected({});
                loadRoles();
            });
    }

    function EditRol(data) {
        console.log(data);
        // let id = rolSelected.id;
        _rolService
            .updateRol(rolSelected.id, data.name, modulesOfRol)
            .then(() => {
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Rol editado exitosamente", life: 3000 });
                loadRoles();
                setRolSelected([]);
            })
            .catch((e) => {
                console.log(e);
                roles.map((element) => {
                    if (rolSelected.name === element.name && rolSelected.id !== element.id) {
                        toast.current.show({ severity: "error", summary: "Error", detail: "El nombre del rol ya se encuentra registrado", life: 3000 });
                    }
                    setRolSelected([]);
                    loadRoles();
                });
            });
    }

    function CreateRol() {
        selectedModules.push({ id: 1, name: "Dashboard", description: "Módulo de reportes." });
        console.log(selectedModules);
        _rolService
            .createRol(rolName, selectedModules)
            .then((response) => {
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Rol creado exitosamente", life: 3000 });
                loadRoles();
                setSelectedModules([]);
            })
            .catch((e) => {
                console.log(e);
                roles.map((element) => {
                    if (rolName === element.name) {
                        toast.current.show({ severity: "error", summary: "Error", detail: "El nombre del rol ya se encuentra registrado", life: 3000 });
                    }
                    setSelectedModules([]);
                    loadRoles();
                });
            });
        setRolName("");
        loadRoles();
    }

    const loadRoles = () => {
        _rolService.getRoles().then((response) => {
            setRoles(response);
        });
    };

    const onChangeRolSelectedEditForm = (e) => {
        const rolUpdated = {
            ...rolSelected,
            [e.target.name]: e.target.value,
        };
        console.log(rolUpdated);
        setRolSelected(rolUpdated);
    };
    useEffect(() => {
        _rolService.getRoles().then((response) => {
            setRoles(response);
        });
    }, []);

    //------------------Validation Create Roles --------------------------------

    //------------------------------VALIDATION ----------------
    const initialValues = {
        modulesPermissions: selectedModules,
        nameRol: rolName,
    };
    const validateCreate = (data) => {
        let errors = {};
        console.log(data);
        if (!data.modulesPermissions) {
            errors.modulesPermissions = "No hay ningún permiso debes asociar al menos uno";
        } else if (data.modulesPermissions.length <= 0) {
            errors.modulesPermissions = "No hay ningún permiso debes asociar al menos uno";
        }
        if (!data.nameRol) {
            errors.nameRol = "Debes ingresar el nombre del rol";
        }
        roles.map((element) => {
            if (element.name === data.nameRol) {
                errors.nameRol = "este nombre ya se encuentra registrado";
            }
        });
        return errors;
    };
    const onSubmit = (data, form) => {
        onHideDialogCreate();
    };

    const initialValuesEdit = {
        modulesPermissions: modulesOfRol,
        name: rolSelected.name,
    };

    const validateEdit = (data) => {
        let errors = {};

        if (!data.modulesPermissions) {
            errors.modulesPermissions = "No hay ningún permiso debes asociar al menos uno";
        } else if (data.modulesPermissions.length <= 0) {
            errors.modulesPermissions = "No hay ningún permiso debes asociar al menos uno";
        }
        if (!data.name) {
            errors.name = "Debes ingresar el nombre del rol";
        }

        return errors;
    };
    const onSubmitEdit = (data) => {
        onHideDialogEdit(data);
    };

    //----------------------------------------------------------------
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    return (
        <>
            <Toast ref={toast} />
            <Toolbar left={leftContents} right={rightContents} />
            <div className="text-center">
                <h4>Lista de roles registrados</h4>
            </div>

            <Dialog header="Crear un nuevo rol" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validate={validateCreate}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="create-rol-form--header">
                                <h5 className="text-center">Ingrese los datos del nuevo rol</h5>
                            </div>

                            <div className="create-rol-form--input multiselect_modules_roles">
                                <Field
                                    name="nameRol"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="nameRol" className={classNames({ "p-error": isFormFieldValid("nameRol") })}>
                                                    Nombre del rol
                                                </label>
                                                <br />
                                                <InputText value={rolName} {...input} onChange={(e) => setRolName(e.target.value)} placeholder="Digite el nombre" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-rol-form__input": true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="create-rol-form--body multiselect_modules_roles">
                                <div className="create-rol-form--body-text">
                                    <h5 className="text-center">Acceso por módulo</h5>
                                    <p>A continuación encontrara cada uno de los módulos del sistema, por favor seleccione los módulos a los que desea darle acceso a este rol</p>
                                </div>
                                <Field
                                    name="modulesPermissions"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="modulesPermissions" className={classNames({ "p-error": isFormFieldValid("modulesPermissions") })}>
                                                    Módulos
                                                </label>
                                                <br />
                                                <MultiSelect
                                                    value={selectedModules}
                                                    {...input}
                                                    options={modules}
                                                    onChange={(e) => setSelectedModules(e.value)}
                                                    optionLabel="name"
                                                    placeholder="Seleccione los módulos"
                                                    display="chip"
                                                    className={classNames({ "p-invalid": isFormFieldValid(meta), multiselect_modules_roles_options: true })}
                                                />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            </div>
                            <div className="buttons_role_create_edit">
                                <Button label="Cancelar" icon="pi pi-times" type="button" onClick={() => onHideDialogCancel()} className="p-button-text" />
                                <Button label="Crear rol" icon="pi pi-check" type="submit" autoFocus />
                            </div>
                        </form>
                    )}
                />
            </Dialog>

            <Dialog header="Editar rol" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }}>
                <div className="create-rol-form">
                    <Form
                        onSubmit={onSubmitEdit}
                        initialValues={initialValuesEdit}
                        validate={validateEdit}
                        render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="create-rol-form--header">
                                    <h5 className="text-center">Ingrese los datos que desea modificar del rol</h5>
                                    <div className="create-rol-form--input multiselect_modules_roles">
                                        <Field
                                            name="name"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span>
                                                        <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}>
                                                            Nombre del rol
                                                        </label>
                                                        <br />
                                                        <InputText value={rolSelected.name} {...input} onChange={onChangeRolSelectedEditForm} placeholder="Digite el nombre del rol" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-rol-form__input": true })} />
                                                    </span>
                                                    <br />
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                    </div>
                                </div>
                                <div className="create-rol-form--body multiselect_modules_roles">
                                    <div className="create-rol-form--body-text">
                                        <h5 className="text-center">Acceso por módulo</h5>
                                        <p>A continuación encontrara seleccionados cada uno de los módulos del sistema a los que este rol tiene acceso, por favor seleccione los módulos a los que desea darle o quitarle acceso a este rol</p>
                                    </div>
                                    <Field
                                        name="modulesPermissions"
                                        render={({ input, meta }) => (
                                            <div className="field">
                                                <span>
                                                    <label htmlFor="modulesPermissions" className={classNames({ "p-error": isFormFieldValid("modulesPermissions") })}>
                                                        Módulos
                                                    </label>
                                                    <br />
                                                    <MultiSelect
                                                        {...input}
                                                        value={modulesOfRol}
                                                        options={modules}
                                                        onChange={(e) => setModulesOfRol(e.value)}
                                                        optionLabel="name"
                                                        placeholder="Seleccione los módulos"
                                                        display="chip"
                                                        className={classNames({ "p-invalid": isFormFieldValid(meta), multiselect_modules_roles_options: true })}
                                                    />
                                                </span>
                                                <br />
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="buttons_role_create_edit">
                                    <Button label="Cancelar" icon="pi pi-times" type="button" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                                    <Button label="Editar rol" icon="pi pi-check" type="submit" autoFocus />
                                </div>
                            </form>
                        )}
                    />
                </div>
            </Dialog>

            <TableRoles className="table-roles" roles={roles} setRolSelected={setRolSelected} />
        </>
    );
}
