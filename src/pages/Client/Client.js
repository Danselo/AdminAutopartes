import React,{useState,useRef,useEffect} from "react";
import { TableClient } from "../../components/TableClient/TableClient";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./client.css";
import { Toolbar } from "primereact/toolbar";
import { UserService} from "../../service/UserService";
import {ClientService } from "../../service/ClientService";
import { confirmDialog } from "primereact/confirmdialog";
import { Dropdown } from "primereact/dropdown";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Form, Field } from "react-final-form";
import { InputTextarea } from 'primereact/inputtextarea';
import "./createClient.css"
import { Column } from "primereact/column";
import { classNames } from "primereact/utils";

const _userService = new UserService();
const _clientService = new ClientService();
export default function Client() {
    const [clientSelected, setClientSelected] = useState({})
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const op = useRef(null);
    // const [clientName, setClientName] = useState("");
    // const [clientLastName, setClientLastName] = useState("");
    const [ setClientDocumentType] = useState("");
    // // const [clientDocument, setClientDocument] = useState("");
    // const [clientTelephone, setClientTelephone] = useState("");
    // const [clientEmail, setClientEmail] = useState("");
    // const [clientCountry, setClientCountry] = useState("");
    // const [clientDepartment, setClientDepartment] = useState("");
    // const [clientCity, setClientCity] = useState("");
    // // const [clientNeightboorhood, setClientNeightboorhood] = useState("");
    // const [clientAdress, setClientAdress] = useState("");
    // const [clientIndications, setClientIndications] = useState("");
    const [selectedClientUser, setSelectedClientUser] = useState("");
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const isMounted = useRef(false);
    const documentTypeOptions = [
        { name: 'Cedula', code: 'CC' },
        { name: 'Tarjeta de identidad', code: 'TI' },
        { name: 'Cedula Extrangeria ', code: 'CE' },
        { name: 'Pasaporte', code: 'PST' },
        { name: 'Root', code: 'RT' }
    ];
    useEffect(() => {
        if (isMounted.current && selectedClientUser) {
            op.current.hide();
            toast.current.show({ severity: "info", summary: "Usuario seleccionado", detail: selectedClientUser.name, life: 3000 });
        }
    }, [selectedClientUser]);

    useEffect(() => {
        isMounted.current = true;
        _clientService
            .getClients()
            .then((response) => {
                setClients(response);
            })
            .catch((e) => {
                console.log(e, "Error al traer los usuarios");
            });
    }, []);
    // const leftContents = (
    //         <Link to={"/pages/Client/CreateClient"}>
    //         <Button label="Agregar Cliente" className="p-button-raised dc-space-between" icon="pi pi-plus-circle"  />
    //         </Link>


    // );
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled = {!clientSelected.name}   />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createClientAlert = (data,form) => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta Cliente?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateClient(data,form),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editClientAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta Cliente?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditClient(),
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
            reject: () => setDisplayDialogEdit(true),
        });
    };
    function onClickDialogCreate() {
        getUsers();
        setDisplayDialogCreate(true);
    }

    function onClickDialogEdit() {
        getUsers();
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = () => {
        editClientAlert();
        setDisplayDialogEdit(false);
    };

    const onHideDialogCreate = (data,form) => {
        createClientAlert(data,form);
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

    const onClientUserChange = (e) => {
        setSelectedClientUser(e.value);
    };

    function EditClient() {
        console.log(clientSelected)
        _clientService.updateClient({
            ...clientSelected,
            documentType: clientSelected.documentType.name
        })
        
            .then(() => {
                setClientSelected({});
                loadClients();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria edita exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }
    function getUsers() {
        _userService.getUsers().then((response) => {
            setUsers(response);
          
        });
    }
   
    function CreateClient(data,form) {
        console.log(data);
        console.log(data.documentType.name);
        _clientService
            .createClient(selectedClientUser.id,data.name,data.name,data.documentType.name,data.document,data.telephone,data.email,data.country,data.department,data.city,data.neightboorhood,data.adress,data.indications)
            .then(() => {
                loadClients();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Usuario creado exitosamente", life: 3000 });
                form.restart();

            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }
    const loadClients = () => {
        _clientService.getClients().then((response) => {
            setClients(response);
        });
    };

    const onEditClientSelected =  (e)=>{
        console.log(e)
         const clientUpdated = {
            ...clientSelected,
            [e.target.name]:e.target.value
        }
        console.log(clientUpdated);
        setClientSelected(clientUpdated)
    }
    useEffect(() => {
        _clientService.getClients().then((response) => {
            setClients(response);
        });
    }, []);
    // const leftContents = (
    //     <React.Fragment>
    //         <Button label="Desactivar" className="p-button-raised p-button-warning dc-space-between" icon="pi pi-eye-slash" onClick={() => onClickDialogCreate()} />
    //     </React.Fragment>
    // );
    

    //------------------------------VALIDATION ----------------
    const initialValues = {
        name : "",
        lastname: "",
        document: "",
        documentType: "",
        telephone: "",
        email: "",
        country: "",
        department: "",
        neightboorhood: "",
        city: "",
        adress: "",
        indications: "",

    };

    const validate = (data) => {
        let errors = {};


        if (!data.name) {
            errors.name = "El nombre es requerido";
        }

        if (!data.lastname) {
            errors.lastname = "El apellido es requerido";
        }
        
        if (!data.documentType) {
            errors.documentType = "El tipo de documento es requerido";
        }

        if (!data.telephone) {
            errors.telephone = "El teléfono es requerido";
        }
        
        if (!data.document) {
            errors.document = "El documento es requerido";
        }
        if (!data.email) {
            errors.email = "El email es requerido";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = "Email invalido. E.g. example@email.com";
        }

        if (!data.country) {
            errors.country = "Debe digitar una país";
        }
        if (!data.department) {
            errors.department = "Debe digitar una departamento";
        }
         if (!data.neightboorhood) {
            errors.neightboorhood = "Debe digitar un vecindario";
        }
        if (!data.city) {
            errors.city = "Debe digitar una ciudad";
        }
        if (!data.adress) {
            errors.adress = "Debe digitar una dirección";
        }
  

        return errors;
    };
    const onSubmit = (data, form) => {
        // setUserEmail(data.email);
        // setUserName(data.name);
        // setUserLastname(data.lastname);
        // setUserPassword(data.password);
        // setSelectedUserRole(data.idRol);
        // const userObject = {
        //     email : data.email,
        //     name : data.name,
        //     lastname: data.lastname,
        //     password : data.password,
        //     rol: data.idRol,
        // }
        console.log(data);
        console.log(data.documentType.name);
        onHideDialogCreate(data,form);
    };
    //----------------------VALIDATION EDIT --------------------------------

    const initialValuesEdit = {
        name : clientSelected.name,
        lastname: clientSelected.lastname,
        document: clientSelected.document,
        documentType: clientSelected.documentType,
        telephone: clientSelected.telephone,
        email: clientSelected.email,
        country: clientSelected.country,
        department: clientSelected.department,
        neightboorhood: clientSelected.neightboorhood,
        city: clientSelected.city,
        adress: clientSelected.address,
        indications: clientSelected.indications,

    };

    const validateEdit = (data) => {
        let errors = {};


        if (!data.name) {
            errors.name = "El nombre es requerido";
        }

        if (!data.lastname) {
            errors.lastname = "El apellido es requerido";
        }
        
        if (!data.documentType) {
            errors.documentType = "El tipo de documento es requerido";
        }

        if (!data.telephone) {
            errors.telephone = "El teléfono es requerido";
        }
        
        if (!data.document) {
            errors.document = "El documento es requerido";
        }
        if (!data.email) {
            errors.email = "El email es requerido";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = "Email invalido. E.g. example@email.com";
        } else
            users.forEach((element) => {
                const userMail = element.email;

                if (data.email === userMail) {
                    errors.email = "El correo ya existe";
                }
            });

        if (!data.country) {
            errors.country = "Debe digitar una país";
        }
        if (!data.department) {
            errors.department = "Debe digitar una departamento";
        }
         if (!data.neightboorhood) {
            errors.neightboorhood = "Debe digitar un vecindario";
        }
        if (!data.city) {
            errors.city = "Debe digitar una ciudad";
        }
        if (!data.adress) {
            errors.adress = "Debe digitar una dirección";
        }
  

        return errors;
    };
    const onSubmitEdit = () => {
        // setUserEmail(data.email);
        // setUserName(data.name);
        // setUserLastname(data.lastname);
        // setUserPassword(data.password);
        // setSelectedUserRole(data.idRol);
        // const userObject = {
        //     email : data.email,
        //     name : data.name,
        //     lastname: data.lastname,
        //     password : data.password,
        //     rol: data.idRol,
        // }
        onHideDialogEdit()
    };

    //-------------------------------------------------------------------
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    
    return (
        <div>
            <Toast ref={toast} />
            <div className="tittle-client">
                <h3>Gestión de Clientes</h3>
            </div>
            <Toolbar  left={leftContents} />
            <Dialog header="Crear un nuevo Cliente" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }} >
            <Form 
             onSubmit={onSubmit}
             initialValues={initialValues}
             validate={validate}
             render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                      <div className="create-client-form">
                        
                        <div className="create-sale-tittle__button">
                                    <Button type="button" icon="pi pi-search" label={selectedClientUser ? selectedClientUser.name : "Seleccione un Usuario"} onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="select-product-button" tooltip="Seleccionar un cliente" />
                                </div>
                            
                            <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: "500px" }} className="overlaypanel-demo">
                                <div className="p-inputgroup create-brand__table">
                                    <InputText placeholder="Buscar usuario" onInput={(e) => setGlobalFilter(e.target.value)} />
                                    <Button icon="pi pi-search" className="p-button-primary" />
                                </div>
                                
                                <DataTable id="saleClientId" value={users} globalFilter={globalFilter} selectionMode="single" paginator rows={5} selection={selectedClientUser} onSelectionChange={onClientUserChange}>
                                    <Column field="name" sortable header="Nombre"></Column>
                                    <Column field="lastname" sortable header="Apellido"></Column>
                                    <Column field="document" sortable header="Documento"></Column>
                                    <Column field="telephone" sortable header="Telefono"></Column>
                                </DataTable>
                            </OverlayPanel>
                            <Field
                                    name="documentType"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="documentType" className={classNames({ "p-error": isFormFieldValid("documentType") })}></label>
                                                <Dropdown value={setClientDocumentType} {...input} options={documentTypeOptions}  optionLabel="name" placeholder="Tipo de documento" id="documentType"  className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}/>
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                   <Field
                                    name="document"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="document" className={classNames({ "p-error": isFormFieldValid("document") })}></label>
                                                <InputText  id="document" {...input} placeholder="Digite el documento" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })} />
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
                                                <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}></label>
                                                <InputText id="name" {...input} placeholder="Nombre" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
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
                                                <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("lastname") })}></label>
                                                <InputText  id="lastname" {...input}placeholder="Apellidos" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                               <Field
                                    name="telephone"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="telephone" className={classNames({ "p-error": isFormFieldValid("telephone") })}></label>
                                                <InputText id="telephone"  {...input}placeholder="Telefono" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="adress"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="adress" className={classNames({ "p-error": isFormFieldValid("adress") })}></label>
                                                <InputText id="adress"  {...input}placeholder="Dirección" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                  <Field
                                    name="email"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="email" className={classNames({ "p-error": isFormFieldValid("email") })}></label>
                                                <InputText id="email"  {...input}placeholder="Correo Electronico" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                   <Field
                                    name="country"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="country" className={classNames({ "p-error": isFormFieldValid("country") })}></label>
                                                <InputText id="country"  {...input}placeholder="Pais" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="department"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="department" className={classNames({ "p-error": isFormFieldValid("department") })}></label>
                                                <InputText id="department"  {...input}placeholder="Departamento" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="city"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="city" className={classNames({ "p-error": isFormFieldValid("city") })}></label>
                                                <InputText id="city"  {...input}placeholder="Ciudades" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="neightboorhood"
                                    render={({ input, meta }) => (
                                        <div className="neightboorhood">
                                            <span>
                                                <label htmlFor="neightboorhood" className={classNames({ "p-error": isFormFieldValid("neightboorhood") })}></label>
                                                <InputText id="neightboorhood"  {...input}placeholder="Vecindario" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="indications"
                                    render={({ input, meta }) => (
                                        <div className="indications">
                                            <span>
                                                <label htmlFor="neightboorhood" className={classNames({ "p-error": isFormFieldValid("indications") })}></label>
                                                <InputTextarea  id="indications"  {...input}placeholder="Indicaciones" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                        </div>
                        <div className="submit-user-create">
                            <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                            <Button label="Crear Cliente" icon="pi pi-check" autoFocus />
                        </div>
                </form>
             )}
            />
          
       
            </Dialog>
            <Dialog header="Editar cliente" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} >
            <Form 
             onSubmit={onSubmitEdit}
             initialValues={initialValuesEdit}
             validate={validateEdit}
             render={({ handleSubmit }) => (
                <form onSubmit={handleSubmit}>
                      <div className="create-client-form">
                        
                        <div className="create-sale-tittle__button">
                                    <Button type="button" icon="pi pi-search" label={  selectedClientUser ? selectedClientUser.name  : "Seleccione un Usuario"} onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="select-product-button" tooltip="Seleccionar un cliente" />
                                </div>
                            
                            <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: "500px" }} className="overlaypanel-demo">
                                <div className="p-inputgroup create-brand__table">
                                    <InputText placeholder="Buscar usuario" onInput={(e) => setGlobalFilter(e.target.value)} />
                                    <Button icon="pi pi-search" className="p-button-primary" />
                                </div>
                                
                                <DataTable id="saleClientId" value={users} globalFilter={globalFilter} selectionMode="single" paginator rows={5} selection={selectedClientUser} onSelectionChange={onClientUserChange}>
                                    <Column field="name" sortable header="Nombre"></Column>
                                    <Column field="lastname" sortable header="Apellido"></Column>
                                    <Column field="document" sortable header="Documento"></Column>
                                    <Column field="telephone" sortable header="Telefono"></Column>
                                </DataTable>
                            </OverlayPanel>
                            <Field
                                    name="documentType"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="documentType" className={classNames({ "p-error": isFormFieldValid("documentType") })}></label>
                                                <Dropdown  {...input} options={documentTypeOptions} onChange={onEditClientSelected} optionLabel="name" placeholder="Tipo de documento" id="documentType"  className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}/>
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                   <Field
                                    name="document"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="document" className={classNames({ "p-error": isFormFieldValid("document") })}></label>
                                                <InputText  id="document" {...input} placeholder="Digite el documento"  onChange={onEditClientSelected} className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })} />
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
                                                <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("name") })}></label>
                                                <InputText id="name" {...input} placeholder="Nombre"  onChange={onEditClientSelected} className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
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
                                                <label htmlFor="name" className={classNames({ "p-error": isFormFieldValid("lastname") })}></label>
                                                <InputText  id="lastname" {...input}placeholder="Apellidos"  onChange={onEditClientSelected} className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                               <Field
                                    name="telephone"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="telephone" className={classNames({ "p-error": isFormFieldValid("telephone") })}></label>
                                                <InputText id="telephone"  {...input}placeholder="Telefono"  onChange={onEditClientSelected}  className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="adress"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="adress" className={classNames({ "p-error": isFormFieldValid("adress") })}></label>
                                                <InputText id="adress"  {...input}placeholder="Dirección"  onChange={onEditClientSelected}  className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                  <Field
                                    name="email"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="email" className={classNames({ "p-error": isFormFieldValid("email") })}></label>
                                                <InputText id="email"  {...input}placeholder="Correo Electronico" onChange={onEditClientSelected} className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                   <Field
                                    name="country"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="country" className={classNames({ "p-error": isFormFieldValid("country") })}></label>
                                                <InputText id="country"  {...input}placeholder="Pais" onChange={onEditClientSelected} className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="department"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="department" className={classNames({ "p-error": isFormFieldValid("department") })}></label>
                                                <InputText id="department"  {...input}placeholder="Departamento" onChange={onEditClientSelected} className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="city"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="city" className={classNames({ "p-error": isFormFieldValid("city") })}></label>
                                                <InputText id="city"  {...input}placeholder="Ciudades" onChange={onEditClientSelected} className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="neightboorhood"
                                    render={({ input, meta }) => (
                                        <div className="neightboorhood">
                                            <span>
                                                <label htmlFor="neightboorhood" className={classNames({ "p-error": isFormFieldValid("neightboorhood") })}></label>
                                                <InputText id="neightboorhood"  {...input} onChange={onEditClientSelected} placeholder="Vecindario" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="indications"
                                    render={({ input, meta }) => (
                                        <div className="indications">
                                            <span>
                                                <label htmlFor="neightboorhood" className={classNames({ "p-error": isFormFieldValid("indications") })}></label>
                                                <InputTextarea  id="indications"  {...input} onChange={onEditClientSelected} placeholder="Indicaciones" className={classNames({ "p-invalid": isFormFieldValid(meta), inputClients: true })}  />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                        </div>
                        <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                                <Button label="Editar cliente" icon="pi pi-check"  autoFocus  />
                        </div>
                </form>
             )}
            />
          
            </Dialog>
            <TableClient className="table-products" clients = {clients} setClientSelected={setClientSelected} />
        </div>
    );
}