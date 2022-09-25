import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { InputTextarea } from 'primereact/inputtextarea';
// import { Dropdown } from "primereact/dropdown";
import { ListBox } from 'primereact/listbox';
import "./createClient.css";
import axios from 'axios'
import { ClientService } from "../../service/ClientService";
const urlUsers = 'http://localhost:5000/users/'

export default function CreateClient() {
    const _clientService = new ClientService();
    
    const acceptModalConfirmation = (lifeTime) => {
       
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };

    const createClientConfirmation = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear este cliente?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            accept: createClient,
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
    const [ setUserId] = useState("");

    const [selectedUser, setSelectedUser] = useState([null]);
    const [clientName, setClientName] = useState("");
    const [clientLastName, setClientLastName] = useState("");
    const [clientDocumentType, setClientDocumentType] = useState("");
    const [clientDocument, setClientDocument] = useState("");
    const [clientTelephone, setClientTelephone] = useState("");
    const [clientEmail, setClientEmail] = useState("");
    const [clientCountry, setClientCountry] = useState("");
    const [clientDepartment, setClientDepartment] = useState("");
    const [clientCity, setClientCity] = useState("");
    const [clientNeightBoordHood, setClientNeightBoordHood] = useState("");
    const [clientAddress, setClientAddress] = useState("");
    const [clientIndications, setClientIndications] = useState("");
    const [clientUsers, setClientUsers] = useState([]);
    

    useEffect(() => {
        axios.get(urlUsers).then((response) => {
            setClientUsers(response.data);    
        });    

    }, []);
    const onUserChange = (e) => {
        setSelectedUser(e.value);
    };
    function createClient() {
        _clientService.createClient(selectedUser.id,clientName,clientLastName,clientDocumentType,clientDocument,clientTelephone,clientEmail,clientCountry,clientDepartment,clientCity,clientNeightBoordHood,clientAddress,clientIndications)
        .then((data)=>{
            const lifeTime = 3000;
            toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Usuario Creado exitosamente", life: lifeTime });
            setTimeout(() => {
               console.log('Redirigiendo a otra pagina') 
            }, lifeTime);
            console.log('client created successfully', data);
        })
        .catch(console.error);
      }
      function getUserIdHandler(id){
        setUserId(id)
    }

    
    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/pages/Client/Client"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-product-tittle">
                <h3>Crear un nuevo cliente</h3>
            </div>
            <div className="create-product-form">
            <span className="p-float-label">
                     {/* <Dropdown value={selectedUser} options={clientUsers} onChange={onUserChange} optionLabel="name" placeholder="Seleccione Rol"  /> */}
                     <ListBox value={selectedUser} options={clientUsers} idUser={(id) => getUserIdHandler(id)} onChange={onUserChange}  filter optionLabel="name"
                 style={{ width: '15rem' }} listStyle={{ maxHeight: '250px' }} />
                    {/* <label htmlFor="type_document">Usuario</label> */}
                </span>
            </div>
            <div className="create-product-form">
          
                <span className="p-float-label">
                    <InputText className="jjj" id="nit" value={clientDocumentType} onChange={(e) => setClientDocumentType(e.target.value)} />
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
                    <InputText className="jjj" id="addres" value={clientAddress} onChange={(e) => setClientAddress(e.target.value)} />
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
                    <InputText className="jjj" id="addres" value={clientNeightBoordHood} onChange={(e) => setClientNeightBoordHood(e.target.value)} />
                    <label htmlFor="addres">Vecindario</label>
                </span>
            </div>
            <div className="create-product-form">
            <span className="p-float-label">
                <InputTextarea  value={clientIndications} onChange={(e) => setClientIndications(e.target.value)} />

                    <label htmlFor="addres">Indicaciones</label>
                </span>
            </div>
            <div className="create-product-buttons">
                {/* <Button label="Crear" className="p-button-success" />
                <Link to={"/pages/Products/Products"}>
                    <Button label="Cancelar" className="p-button-danger" />
                </Link> */}
                <Button onClick={createClientConfirmation} icon="pi pi-check" label="Crear" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
