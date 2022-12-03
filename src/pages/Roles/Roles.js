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
import { info } from "sass";

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

    const [permissionSelected, setPermissionSelected] = useState([]);
    const [selectedModules, setSelectedModules] = useState([]);
    const [modules, setModules] = useState([]);
    const [modulesOfRol, setModulesOfRol] = useState([]);

    

    useEffect(() => {
        _modulesService
            .getModules()
            .then((response) => {
                setModules(response);
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
            onHide:cancelEditRol(),
            acceptLabel: "Cambiar estado",
            rejectLabel: "Cancelar",
            accept: () => EditStatus(),
            reject: () => cancelEditRol(),
        });
    }
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!rolSelected.name} />
        </React.Fragment>
    );
    const rightContents = (
        <React.Fragment>
            <Button label={rolSelected.status ? "Desactivar" : "Activar"} className={ rolSelected.status ? "p-button-warning p-button-raised  dc-space-between" : "p-button-success p-button-raised  dc-space-between" }  icon="pi pi-eye-slash" onClick={() => editRolStatusAlert()}  disabled={!rolSelected.name} />

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



    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createRolAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear esta rol?",
            header: "Confirmación",
            onHide:cancelCreateRol(),
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateRol(),
            reject: () => cancelCreateRol()
        });
    };

    const editRolAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta rol?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            onHide:cancelEditRol(),
            rejectLabel: "Cancelar",
            accept: () => EditRol(),
            reject: () => cancelEditRol(),
        });
    };
    const cancelCreateRol = () => {
        setDisplayDialogCreate(false)
        setSelectedModules([])
    };
    const cancelEditRol = () => {
        setDisplayDialogEdit(false)
        setSelectedModules([])
        setRolSelected([])
    };
    const cancelCreate = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            onHide:cancelCreateRol(),
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
            onHide:cancelEditRol(),
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => cancelEditRol(),
            reject: () => setDisplayDialogEdit(true),
        });
    };
    function onClickDialogCreate() {
        setDisplayDialogCreate(true);
        // getRolesPermissions();
    }

    function onClickDialogEdit() {
        // getModulesOfRolSelected(rolSelected.id);
        // getRolesPermissions();
        _rolesPermissionsService.getModulesOfRolSelected(rolSelected.id)
            .then((response) => {
                let responseMapped = response.map((element) => {
                    return {
                            
                            id: element.modules.id,
                            name: element.modules.name,
                            description: element.modules.description


                    };
                });
                setModulesOfRol(responseMapped);
            })
            .catch((e) => {
                console.log("Falle aquí", e);
            });
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
    useEffect(() => {

        users.map((element)=>{
            if(rolSelected.id === element.idRol){

                if(element.idRol === rolSelected.id && rolSelected.status === true){
                    console.log(`id ${rolSelected.id} idROlUser : ${element.idRol}` );
                    setRolSelectedWithUser(true)
                }
                
            }


    })

}, [setRolSelectedWithUser,users,rolSelected]);
    
    function EditStatus() {

            if(rolSelectedWithUser){
                toast.current.show({ severity: "error", summary: "Error", detail: "El rol esta asociado a un usuario", life: 3000 });
                setRolSelectedWithUser(null);
            }else if(rolSelected.status == false){
                rolSelected.status = true;

                    _rolService
                    .updateStatus(rolSelected)
                    .then(() => {
                        setRolSelected({});
                        setRolSelectedWithUser(null);
                        loadRoles();
                        toast.current.show({ severity: "success", summary: "Confirmación", detail: "El estado del rol se cambio exitosamente", life: 3000 });
                    })
                    .catch((e) => {
                        toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                        console.log(e);
                        setRolSelectedWithUser(null);
                        setRolSelected({});
                        loadRoles();


                    });

            }else if (rolSelected.status === true && rolSelectedWithUser !== true){
                rolSelected.status = false;

                _rolService
                .updateStatus(rolSelected)
                .then(() => {
                    setRolSelected({});
                    setRolSelectedWithUser(null);
                    loadRoles();
                    toast.current.show({ severity: "success", summary: "Confirmación", detail: "El estado del rol se cambio exitosamente", life: 3000 });
                })
                .catch((e) => {
                    toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                    console.log(e);
                    setRolSelectedWithUser(null);
                    setRolSelected({});
                    loadRoles();


                });

            }
    
        
    }


      

    function EditRol() {
        // let id = rolSelected.id;
        _rolService
            .updateRol(rolSelected.id ,rolSelected.name, modulesOfRol)
            .then(() => {
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Rol Editado exitosamente", life: 3000 });
                loadRoles();
                setRolSelected([])
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
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Rol creado exitosamente", life: 3000 });
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

    const onChangeRolSelectedEditForm = (e) => {
        console.log(e.target);
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
    console.log(selectedModules);
       const initialValues = {
        modulesPermissions: selectedModules,
        nameRol: rolName
    };
    const validate = (data) => {
        let errors = {};

        if(!data.modulesPermissions) {
            errors.modulesPermissions = "No hay ningún permiso debes asociar al menos uno";
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
    // const onEditModuleSelected = (e) => {

    //     const moduleUpdate = {
    //         ...selectedModules,
    //         [e.target.name]: e.target.value,
    //     };
    //     setSelectedModules(moduleUpdate);
    // };
    //------------------------EDIT_______________ROLLL
    const initialValuesEdit = {
        modulesPermissions: modulesOfRol,
        name: rolSelected.name
    };
    console.log(modulesOfRol);

    const validateEdit = (data) => {
        let errors = {};

        if(!data.modulesPermissions) {
            errors.modulesPermissions = "No hay ningún permiso debes asociar al menos uno";
        }else if(data.modulesPermissions.length <=0){
            errors.modulesPermissions = "No hay ningún permiso debes asociar al menos uno";
            
        }
        if(!data.name) {
            errors.name = "Debes ingresar el nombre del rol";
        }
        return errors;
    };
    const onSubmitEdit = (data, form) => {
        onHideDialogEdit()
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
                                        <div className="create-rol-form--input multiselect_modules_roles">
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
                         <div className="buttons_role_create_edit">
                            <Button label="Cancelar" icon="pi pi-times" type="button" onClick={() => onHideDialogCancel()} className="p-button-text" />
                            <Button label="Crear rol" icon="pi pi-check" type="submit" autoFocus />
                        </div>
                            </form>
                        )} />


                </div>
            </Dialog>

            <Dialog header="Editar rol" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} >
            <div className="create-rol-form">
              
              <Form
                  onSubmit={onSubmitEdit}
                  initialValues={initialValuesEdit}
                  validate={validateEdit}
                  render={({ handleSubmit }) => (
                  <form onSubmit={handleSubmit}>
                            <div className="create-rol-form--header">
                              <h5 className="text-center">Ingrese los datos del nuevo rol</h5>
                              <div className="create-rol-form--input multiselect_modules_roles">
                                  <Field
                                      name="name"
                                      render={({ input, meta }) => (
                                          <div className="field">
                                              <span>
                                                  <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}>Nombre del rol</label>
                                                  <br />
                                                  <InputText value={rolSelected.name}
                                                   {...input} 
                                                   onChange={onChangeRolSelectedEditForm} 
                                                   placeholder="Digite el nombre del rol" 
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
                                          <MultiSelect {...input}
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
              )} />


      </div>
            </Dialog>

            <TableRoles className="table-roles" roles={roles} setRolSelected={setRolSelected} />
        </div>
    );
}
