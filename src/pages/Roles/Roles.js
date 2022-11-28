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
    const [users, setUsers] = useState([]);
    const [rolStatusWithUser, setRolStatusWithUser] = useState(null);

    
    const [permissionSelected, setPermissionSelected] = useState([]);
    const [permissionsOfRolSelected, setPermissionsOfRolSelected] = useState([]);
    const [selectedModules, setSelectedModules] = useState(null);
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
            name: "Categorías",
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
            name: "Vehículos",
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
            checked: false,

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
    //------ENABLE AND DISABLE CLIENT-------
    const editRolStatusAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea cambiar el estado del Rol?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Cambiar estado",
            rejectLabel: "Cancelar",
            accept: () => EditStatus(),
            reject: () => setDisplayDialogEdit(false),
        });
    };
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!rolSelected.name} />
        </React.Fragment>
    );
    const rightContents = (
        <React.Fragment>
                        <Button
                label={rolSelected.status ? "Desactivar" : "Activar"}
                className={rolSelected.status ? "p-button-warning p-button-raised  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                icon="pi pi-eye-slash"
                onClick={() => editRolStatusAlert()}
                disabled={!rolSelected.name}
            />
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
                console.log("Falle aquí", e);
            });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createRolAlert = (data) => {
        confirmDialog({
            message: "¿Esta seguro que desea crear esta rol?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateRol(data),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editRolAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta rol?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditRol(),
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

    const onHideDialogCreate = (data) => {
        createRolAlert(data);
        setDisplayDialogCreate(false);
    };
    const onHideDialogCreateX = () => {
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

            users.map((element) => { 
                if( element.idRol === rolSelected.id ){
                    setRolStatusWithUser(false)
                }
            });
    

    function EditStatus() {

        if (rolStatusWithUser === false) {
            toast.current.show({ severity: "error", summary: "Error", detail: "No se puede cambiar el rol ya  que esta asociado a un usuario", life: 3000 });
            setRolStatusWithUser({})
       } else{
                if(rolSelected.status === true){
                    rolSelected.status = false;
                }else if (rolSelected.status === false){
                    rolSelected.status = true;
                }
                _rolService.updateRol(rolSelected)
            .then(() => {
                setRolSelected({});
                loadRoles();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "El estado del rol se cambio exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
            setRolStatusWithUser({})

   } 
      

    }
    function EditRol() {
        // let id = rolSelected.id;
        _rolService
            .createRol(rolName, selectedModules)
            .then((response) => {
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Rol creado exitosamente", life: 3000 });
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

    // const renderFooterDialog = () => {
    //     return (
    //         <div>
    //             <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
    //             <Button label="Crear rol" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
    //         </div>
    //     );
    // };

    // const renderFooterDialogEdit = () => {
    //     return (
    //         <div>
    //             <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
    //             <Button label="Editar rol" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
    //         </div>
    //     );
    // };
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
                    
                }
            }
        }

        setPermissionsOfRolSelected(_selectedPermissions);
    };
      //------------------------------VALIDATION ----------------
      const initialValues = {
        name: "",
        permissions: null
    };

    const validate = (data) => {
        let errors = {};

        if (!data.name) {
            errors.name = "El nombre es requerido";
        }
        if(permissionSelected.length<=0){
            errors.permissions = "  Debe digitar al menos un permiso"
        }


        return errors;
    };
    const onSubmit = (data) => {
        onHideDialogCreate(data)
    };

    const initialValuesEdit = {
        name: rolSelected.name,
        
    };

    const validateEdit = (data) => {
        let errors = {};

        if (!data.name) {
            errors.name = "El nombre es requerido";
        }
        if(permissionsOfRolSelected.length<=0){
            errors.permissions = "  Debe digitar al menos un permiso"
        }


        return errors;
    };
    const onSubmitEdit = (data) => {
        onHideDialogEdit()
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    //------------------------------------------------------------------------------------------

    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Modulo de roles</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear un nuevo rol" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} footer={renderFooterDialog()}>
                <div className="create-rol-form">
                    <div className="create-rol-form--header">
                        <h5 className="text-center">Ingrese los datos del nuevo rol</h5>
                        <div className="create-rol-form--input">
                            <label htmlFor="buyId">Nombre del rol</label>
                            <InputText value={rolName} onChange={(e) => setRolName(e.target.value)} placeholder="Nombre" className="create-rol-form__input" />
                        </div>
                    </div>
                    <div className="create-rol-form--body">
                        <div className="create-rol-form--body-text">
                            <h5 className="text-center">Acceso por módulo</h5>
                            <p>A continuacion encontrara cada uno de los modulos del sistema, por favor seleccione los modulos a los que desea darle acceso a este rol</p>
                        </div>

                        <MultiSelect value={selectedModules} options={modules} onChange={(e) => setSelectedModules(e.value)} optionLabel="name" placeholder="Seleccione los modulos" display="chip" />
                    </div>
                        
                </div>
              
            </Dialog>

            <Dialog header="Editar rol" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} >
            <Form
                    onSubmit={onSubmitEdit}
                    initialValues={initialValuesEdit}
                    validate={validateEdit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                                 <div className="create-rol-form">
                                        <div className="create-rol-form">
                                            <div className="create-rol-form--header">
                                                <h5 className="text-center">Ingrese los datos del nuevo rol</h5>
                                                <Field
                                                name="name"
                                                render={({ input, meta }) => (
                                                    <div className="field">
                                                        <span>
                                                            <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}>Nombre del rol</label>
                                                            <br />
                                                            <InputText id="name" {...input} onChange={onChangeRolSelectedEditForm} placeholder="Nombre del rol" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-rol-form__input": true })} />
                                                        </span>
                                                        <br />
                                                        {getFormErrorMessage(meta)}
                                                    </div>
                                                )}
                                            />
                                                {/* <div className="create-rol-form--input">
                                                    <label htmlFor="buyId">Nombre del rol</label>
                                                    <InputText value={rolSelected.name} onChange={onChangeRolSelectedEditForm} placeholder="Nombre" className="create-rol-form__input" />
                                                </div> */}
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
                                                                    <Field
                                                                    name="permissions"
                                                                    render={({ input, meta }) => (
                                                                        <div className="field">
                                                                            <span>
                                                                                <label htmlFor={permissionObject.id} className={classNames({ "p-error": isFormFieldValid("permissions") })}>{permissionObject.name}</label>
                                                                                {/* <InputText id="permissions" {...input} placeholder="Nombre del rol" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-rol-form__input": true })} /> */}
                                                                                <Checkbox inputId={permissionObject.id} {...input} name="permission"  value={permissionObject} onChange={onPermissionChangeEdit} checked={permissionsOfRolSelected.some((item) => item.id === permissionObject.id)}  className={classNames({ "p-invalid": isFormFieldValid(meta),checkedPermissionsRol: true  })} />

                                                                            </span>
                                                                            <br />
                                                                            {getFormErrorMessage(meta)}
                                                                        </div>
                                                                    )}
                                                                />
                                                                    {/* <Checkbox inputId={permissionObject.id} name="permission" value={permissionObject} onChange={onPermissionChangeEdit} checked={permissionsOfRolSelected.some((item) => item.id === permissionObject.id)} />
                                                                    <label htmlFor={permissionObject.id}>{permissionObject.name}</label> */}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    </Panel>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                    <div>
                                        <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                                        <Button label="Editar rol" icon="pi pi-check"  autoFocus />
                                    </div>
                        </form>
                    )} />
                
            </Dialog>

            <TableRoles className="table-roles" roles={roles} setRolSelected={setRolSelected} />
        </div>
    );
}
