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
import { InputTextarea } from 'primereact/inputtextarea';
import "./createClient.css"
const _userService = new UserService();
const _clientService = new ClientService();
export default function Client() {
    const [clientSelected, setClientSelected] = useState({})
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [clientName, setClientName] = useState("");
    const [clientLastName, setClientLastName] = useState("");
    const [clientDocumenType, setClientDocumentType] = useState("");
    const [clientDocument, setClientDocument] = useState("");
    const [clientTelephone, setClientTelephone] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientCountry, setClientCountry] = useState("");
    const [clientDepartment, setClientDepartment] = useState("");
    const [clientCity, setClientCity] = useState("");
    const [clientNeightboorhood, setClientNeightboorhood] = useState("");
    const [clientAdress, setClientAdress] = useState("");
    const [clientIndications, setClientIndications] = useState("");
    const [selectedClientUser, setSelectedClientUser] = useState("");
    const [clients, setClients] = useState([]);
    const [users, setUsers] = useState([]);
    // const leftContents = (
    //         <Link to={"/pages/Client/CreateClient"}>
    //         <Button label="Agregar Cliente" className="p-button-raised dc-space-between" icon="pi pi-plus-circle"  />
    //         </Link>


    // );
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()}   />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createClientAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta Cliente?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateClient(),
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

    const onHideDialogCreate = () => {
        createClientAlert();
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

    const onClientUserChange = (e) => {
        setSelectedClientUser(e.value);
    };
    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Crear Cliente" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
            </div>
        );
    };

    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                <Button label="Editar cliente" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus  />
            </div>
        );
    };
    function EditClient() {
        console.log(clientSelected)
        _clientService.updateClient(clientSelected)
        
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
   
    function CreateClient() {
        _clientService
            .createClient(selectedClientUser.id,clientName,clientLastName,clientDocumenType,clientDocument,clientTelephone,clientEmail,clientCountry,clientDepartment,clientCity,clientNeightboorhood,clientAdress,clientIndications)
            .then(() => {
                setClientName("");
                loadClients();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Usuario creado exitosamente", life: 3000 });
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
    return (
        <div>
            <Toast ref={toast} />
            <div className="tittle-client">
                <h3>Gestión de Clientes</h3>
            </div>
            <Toolbar  left={leftContents} />
            <Dialog header="Crear un nuevo Cliente" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }} footer={renderFooterDialog()}>

            <div className="create-client-form">
                <span className="p-float-label">
                <Dropdown value={selectedClientUser} options={users} onChange={onClientUserChange} optionLabel="name" placeholder="Ingrese el Usuario" className="create-vehicle-form__dropdown" />
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="nit" value={clientDocumenType} onChange={(e) => setClientDocumentType(e.target.value)} />
                    <label htmlFor="type_document">Tipo documento</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="company_name" value={clientDocument} onChange={(e) => setClientDocument(e.target.value)} />
                    <label htmlFor="number_document">Numero documento</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="contact_name" value={clientName} onChange={(e) => setClientName(e.target.value)} />
                    <label htmlFor="first_name">Nombre</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="telephone" value={clientLastName} onChange={(e) => setClientLastName(e.target.value)} />
                    <label htmlFor="last_name">Apellido</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="email" value={clientTelephone} onChange={(e) => setClientTelephone(e.target.value)} />
                    <label htmlFor="telephone">Telefono</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="addres" value={clientAdress} onChange={(e) => setClientAdress(e.target.value)} />
                    <label htmlFor="addres">Direccion</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="addres" value={clientEmail} onChange={(e) => setClientEmail(e.target.value)} />
                    <label htmlFor="addres">Email</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="addres" value={clientCountry} onChange={(e) => setClientCountry(e.target.value)} />
                    <label htmlFor="addres">Pais</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="addres" value={clientDepartment} onChange={(e) => setClientDepartment(e.target.value)} />
                    <label htmlFor="addres">Departmento</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="addres" value={clientCity} onChange={(e) => setClientCity(e.target.value)} />
                    <label htmlFor="addres">Ciudad</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="addres" value={clientNeightboorhood} onChange={(e) => setClientNeightboorhood(e.target.value)} />
                    <label htmlFor="addres">Vecindario</label>
                </span>
                <span className="p-float-label">
                <InputTextarea  id="indications" value={clientIndications} onChange={(e) => setClientIndications(e.target.value)} />

                    <label htmlFor="indications">Indicaciones</label>
                </span>
            </div>
       
            </Dialog>
            <Dialog header="Editar cliente" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialogEdit()}>
            <div className="create-client-form">
            <span className="p-float-label">
            <Dropdown value={clientSelected.idUser} 
                    name="idUser" optionValue="id"
                    options={users} onChange={onEditClientSelected} optionLabel="name" placeholder="Usuario para Cliente"  />
                </span>
                <span className="p-float-label">
                    <InputText  name="documentType" value={clientSelected.documentType} onChange={onEditClientSelected} />
                    <label htmlFor="documentType">Tipo documento</label>
                </span>
                <span className="p-float-label">
                    <InputText name="document" value={clientSelected.document} onChange={onEditClientSelected} />
                    <label htmlFor="document">Numero documento</label>
                </span>
                <span className="p-float-label">
                    <InputText name="name" value={clientSelected.name} onChange={onEditClientSelected} />
                    <label htmlFor="name">Nombre</label>
                </span>
                <span className="p-float-label">
                    <InputText name="lastname" value={clientSelected.lastname} onChange={onEditClientSelected} />
                    <label htmlFor="lastname">Apellido</label>
                </span>
                <span className="p-float-label">
                    <InputText name="telephone"  value={clientSelected.telephone} onChange={onEditClientSelected} />
                    <label htmlFor="telephone">Telefono</label>
                </span>
                <span className="p-float-label">
                    <InputText name="address" value={clientSelected.adress} onChange={onEditClientSelected} />
                    <label htmlFor="address">Direccion</label>
                </span>
                <span className="p-float-label">
                    <InputText name="email" value={clientSelected.email} onChange={onEditClientSelected} />
                    <label htmlFor="email">Email</label>
                </span>
                <span className="p-float-label">
                    <InputText name="country" value={clientSelected.country} onChange={onEditClientSelected} />
                    <label htmlFor="country">Pais</label>
                </span>
                <span className="p-float-label">
                    <InputText name="department" value={clientSelected.department} onChange={onEditClientSelected} />
                    <label htmlFor="department">Departmento</label>
                </span>
                <span className="p-float-label">
                    <InputText name="city" value={clientSelected.city} onChange={onEditClientSelected} />
                    <label htmlFor="city">Ciudad</label>
                </span>
                <span className="p-float-label">
                    <InputText name="neightboorhood" value={clientSelected.neightboorhood} onChange={onEditClientSelected} />
                    <label htmlFor="neightboorhood">Vecindario</label>
                </span>
                <span className="p-float-label">
                <InputTextarea name="indications"  value={clientSelected.indications} onChange={onEditClientSelected} />

                    <label htmlFor="indications">Indicaciones</label>
                </span>
                </div>
            </Dialog>
            <TableClient className="table-products" clients = {clients} setClientSelected={setClientSelected} />
        </div>
    );
}