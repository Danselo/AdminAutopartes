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
import { Panel } from "primereact/panel";
import { MultiSelect } from "primereact/multiselect";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";

import { Checkbox } from "primereact/checkbox";
import { ModulesService } from "../../service/ModulesService";

const _rolService = new RolesService();
const _rolesPermissionsService = new RolesPermissionsService();
const _modulesService = new ModulesService();

export default function Roles() {
    const [rolSelected, setRolSelected] = useState({});
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [rolName, setRolName] = useState("");
    const [permissions, setPermissions] = useState([]);
    const [roles, setRoles] = useState([]);
    const [permissionSelected, setPermissionSelected] = useState([]);
    const [permissionsOfRolSelected, setPermissionsOfRolSelected] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [modules, setModules] = useState([]);
    console.log(selectedModules);

    useEffect(() => {
        _modulesService
            .getModules()
            .then((response) => {
                console.log(response);
                setModules(response);
            })
            .catch((error) => {
                console.log("Algo salio mal al traer los modulos de la bd", error);
            });
    }, []);

    const permissionsArray = [
        {
            name: "Dashboard",
            permissions: [],
            checked: false,
        },
        {
            name: "Proveedores",
            permissions: [],
            checked: false,
        },
        {
            name: "Compras",
            permissions: [],
            checked: false,
        },
        {
            name: "Categorias",
            permissions: [],
            checked: false,
        },
        {
            name: "Marcas",
            permissions: [],
            checked: false,
        },
        {
            name: "Productos",
            permissions: [],
            checked: false,
        },
        {
            name: "Vehiculos",
            permissions: [],
            checked: false,
        },
        {
            name: "Clientes",
            permissions: [],
            checked: false,
        },
        {
            name: "Ventas",
            permissions: [],
            checked: false,
        },
        {
            name: "Usuarios",
            permissions: [],
        },
    ];

    permissions.forEach((element) => {
        const nameOfModule = element.modules_permissions.name;
        permissionsArray.forEach((elementJSON) => {
            if (elementJSON.name === nameOfModule) {
                elementJSON.permissions.push(element);
            }
        });
    });

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!rolSelected.name} />
        </React.Fragment>
    );
    const rightContents = (
        <React.Fragment>
            <Button label="Desactivar" className="p-button-raised p-button-warning dc-space-between" icon="pi pi-eye-slash" onClick={() => onClickDialogCreate()} />
        </React.Fragment>
    );

    useEffect(() => {
        _rolService.getRoles().then((response) => {
            setRoles(response);
        });
    }, []);

    const getModulesOfRolSelected = (idRolSelected) => {
        _rolesPermissionsService
            .getModulesOfRolSelected(idRolSelected)
            .then((response) => {
                let responseMapped = response.map((element) => {
                    return {
                        id: element.idPermissions,
                        idModule: element.permissions.idModule,
                        name: element.permissions.name,
                    };
                });
                console.log(responseMapped);
                setPermissionsOfRolSelected(responseMapped);
            })
            .catch((e) => {
                console.log("Falle aqui", e);
            });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createRolAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear esta rol?",
            header: "Confirmacion",
            onHide:cancelCreateRol(),
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateRol(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editRolAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta rol?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditRol(),
            reject: () => setDisplayDialogEdit(false),
        });
    };
    const cancelCreateRol = () => {
        setDisplayDialogCreate(false)
        setSelectedModules([])
    };
    const cancelCreate = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            onHide:cancelCreateRol(),
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => cancelCreateRol(),
            reject: () => setDisplayDialogCreate(true),
        });
    };
    function onClickDialogCreate() {
        setDisplayDialogCreate(true);
        // getRolesPermissions();
    }

    function onClickDialogEdit() {
        getModulesOfRolSelected(rolSelected.id);
        // getRolesPermissions();
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = () => {
        editRolAlert();
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
    };
    const onHideDialogCancel = () => {
        cancelCreate();
        
        setDisplayDialogCreate(false);
    };

    const onHideDialogCancelEdit = () => {
        cancelCreate();
        setDisplayDialogEdit(false);
    };
    console.log(selectedModules);
    // const getRolesPermissions = () => {
    //     _permissionsService
    //         .getModules()
    //         .then((response) => {
    //             setPermissions(response);
    //         })
    //         .catch((e) => {
    //             console.log("Algo salio mal al traer los permisos de la bd", e);
    //         });
    // };

    function EditRol() {
        // let id = rolSelected.id;
        _rolService
            .updateRol(rolSelected)
            .then(() => {
                console.log(rolSelected.id);
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    function CreateRol() {
        _rolService
            .createRol(rolName, selectedModules)
            .then((response) => {
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Rol creado exitosamente", life: 3000 });
                loadRoles();
                setSelectedModules([])

            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal al crear el rol, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
        setRolName("");
        loadRoles();
    }

    const loadRoles = () => {
        _rolService.getRoles().then((response) => {
            setRoles(response);
        });
    };

    const onChangeRolSelectedEditForm = (eventOnChange) => {
        console.log(eventOnChange.target);
        const rolUpdated = {
            ...rolSelected,
            [eventOnChange.target.name]: eventOnChange.target.value,
        };
        console.log(rolUpdated);
        setRolSelected(rolUpdated);
    };
    useEffect(() => {
        _rolService.getRoles().then((response) => {
            setRoles(response);
        });
    }, []);


    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                <Button label="Editar rolo" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
            </div>
        );
    };
    const onPermissionChange = (e) => {
        let selectedPermissions = [...permissionSelected];

        if (e.checked) selectedPermissions.push(e.value);
        else selectedPermissions.splice(selectedPermissions.indexOf(e.value), 1);

        setPermissionSelected(selectedPermissions);
    };

    const onPermissionChangeEdit = (e) => {
        console.log(e);

        let _selectedPermissions = [...permissionsOfRolSelected];
        console.log(_selectedPermissions);

        if (e.checked) {
            _selectedPermissions.push(e.value);
        } else {
            for (let i = 0; i < _selectedPermissions.length; i++) {
                const selectedPermission = _selectedPermissions[i];
                console.log(selectedPermission);

                if (selectedPermission.id === e.value.id) {
                    _selectedPermissions.splice(i, 1);
                    break;
                }
            }
        }

        setPermissionsOfRolSelected(_selectedPermissions);
    };
//------------------Validation Create Roles --------------------------------


 //------------------------------VALIDATION ----------------
    const initialValues = {
        modulesPermissions: selectedModules,
        nameRol: rolName
    };

    const validate = (data) => {
        let errors = {};

        if(!data.modulesPermissions) {
            errors.modulesPermissions = "No hay ningún permiso debes asociar almenos uno";
        }else if(data.modulesPermissions.length <=0){
            errors.modulesPermissions = "No hay ningún permiso debes asociar al menos uno";
            
        }
        if(!data.nameRol) {
            errors.nameRol = "Debes ingresar el nombre del rol";
        }
        return errors;
    };
    const onSubmit = (data, form) => {
        onHideDialogCreate()
    };


//----------------------------------------------------------------
const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
const getFormErrorMessage = (meta) => {
    return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
};
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Modulo de roles</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear un nuevo rol" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} >
                <div className="create-rol-form">
              
                        <Form
                            onSubmit={onSubmit}
                            initialValues={initialValues}
                            validate={validate}
                            render={({ handleSubmit }) => (
                            <form onSubmit={handleSubmit}>
                                      <div className="create-rol-form--header">
                                        <h5 className="text-center">Ingrese los datos del nuevo rol</h5>
                                        <div className="create-rol-form--input">
                                            <Field
                                                name="nameRol"
                                                render={({ input, meta }) => (
                                                    <div className="field">
                                                        <span>
                                                            <label htmlFor="nameRol" className={classNames({ "p-error": isFormFieldValid("nameRol") })}>Nombre del rol</label>
                                                            <br />
                                                            <InputText value={rolName}
                                                             {...input} 
                                                             onChange={(e) => setRolName(e.target.value)} 
                                                             placeholder="Digite el documento" 
                                                             className={classNames({ "p-invalid": isFormFieldValid(meta), "create-rol-form__input": true })}  />

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
                                        <p>A continuación encontrara cada uno de los módulos del sistema, por favor seleccione los módulos a los que desea darle acceso a este rol</p>
                                    </div>
                                    <Field
                                        name="modulesPermissions"
                                        render={({ input, meta }) => (
                                            <div className="field">
                                                <span>
                                                    <label htmlFor="modulesPermissions" className={classNames({ "p-error": isFormFieldValid("modulesPermissions") })}>Módulos</label>
                                                    <br />
                                                    <MultiSelect value={selectedModules} {...input} 
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
                         <div>
                            <Button label="Cancelar" icon="pi pi-times" type="button" onClick={() => onHideDialogCancel()} className="p-button-text" />
                            <Button label="Crear rol" icon="pi pi-check" type="submit" autoFocus />
                        </div>
                            </form>
                        )} />


                </div>
            </Dialog>

            <Dialog header="Editar rol" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} footer={renderFooterDialogEdit()}>
                <div className="create-rol-form">
                    <div className="create-rol-form">
                        <div className="create-rol-form--header">
                            <h5 className="text-center">Ingrese los datos del nuevo rol</h5>
                            <div className="create-rol-form--input">
                                <label htmlFor="buyId">Nombre del rol</label>
                                <InputText value={rolSelected.name} onChange={onChangeRolSelectedEditForm} placeholder="Nombre" className="create-rol-form__input" />
                            </div>
                        </div>
                        <div className="create-rol-form--body">
                            <div className="create-rol-form--body-text">
                                <h5 className="text-center">Permisos del rol por modulo</h5>
                                <p>A continuación encontrara cada uno de los módulos del sistema con sus respectivos permisos disponibles, por favor seleccione cada uno de los permisos que desea asociar a este rol</p>
                            </div>

                            {permissionsArray.map((element) => (
                                <Panel header={element.name} className="create-rol-form--body-panel" key={element.name} toggleable>
                                    <div className="">
                                        {element.permissions.map((permissionObject) => (
                                            <div className="field-radiobutton" key={permissionObject.name}>
                                                <Checkbox inputId={permissionObject.id} name="permission" value={permissionObject} onChange={onPermissionChangeEdit} checked={permissionsOfRolSelected.some((item) => item.id === permissionObject.id)} />
                                                <label htmlFor={permissionObject.id}>{permissionObject.name}</label>
                                            </div>
                                        ))}
                                    </div>
                                </Panel>
                            ))}
                        </div>
                    </div>
                </div>
            </Dialog>

            <TableRoles className="table-roles" roles={roles} setRolSelected={setRolSelected} />
        </div>
    );
}
