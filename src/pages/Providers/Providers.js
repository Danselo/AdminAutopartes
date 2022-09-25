import React, { useState, useRef } from "react";
import "./providers.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableProviders } from "../../components/TableProviders/TableProviders";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from 'primereact/toolbar';
import axios from "axios";
import { ProvidersService } from "../../service/ProvidersService";
const url = "http://localhost:5000/providers/create";

export default function Providers() {
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const toast = useRef(null);
    const [providersNit, setProvidersNit] = useState("");
    const [providersCompanyName, setProvidersCompanyName] = useState("");
    const [providersContactName, setProvidersContactName] = useState("");
    const [providersTelephone, setProvidersTelephone] = useState("");
    const [providersAdress, setProvidersAdress] = useState("");
    const [providersEmail, setProvidersEmail] = useState("");
    const [providersCountry, setProvidersCountry] = useState("");
    const [providersId, setProvidersId] = useState("");
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteProvidersAlert()} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button label="Desactivar" className="p-button-raised p-button-warning dc-space-between" icon="pi pi-eye-slash" onClick={() => onClickDialogCreate()} />
        
        </React.Fragment>
    );
    const accept = () => {
        toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Proveedor creado exitosamente", life: 3000 });
        CreateProviders();
    };
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const acceptDelete = () => {
        toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Proveedor eliminado exitosamente", life: 3000 });
        deleteProviders(providersId)
    };

    const createProviders = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar este Proveedor?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept,
            reject: () => setDisplayDialogCreate(true),
        });
    };
    const deleteProvidersAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea eliminar este Proveedor?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
            rejectLabel: "Cancelar",
            accept: () => acceptDelete(),
            reject: () => setDisplayDialogCreate(true),
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
        setDisplayDialogCreate(true);
    }

    const onHideDialogCreate = () => {
        createProviders();
        setDisplayDialogCreate(false);
    };
    const onHideDialogCreateX = () => {
        setDisplayDialogCreate(false);
    };
    const onHideDialogCancel = () => {
        cancelCreate();
        setDisplayDialogCreate(false);
    };
    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Crear categoria" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
            </div>
        );
    };

    function CreateProviders() {
        axios
            .post(url, {
                nit: providersNit,
                companyName: providersCompanyName,
                contactName: providersContactName,
                telephone: providersTelephone,
                adress: providersAdress,
                email: providersEmail,
                country: providersCountry,
            })
            .then((response) => {
                setProvidersNit(response.data);
                setProvidersCompanyName(response.data);
                setProvidersContactName(response.data);
                setProvidersTelephone(response.data);
                setProvidersAdress(response.data);
                setProvidersEmail(response.data);
                setProvidersCountry(response.data);
            });
    }
    function getProvidersIdHandler(id){
        setProvidersId(id)
    }

    const _providersService = new ProvidersService();
    
    function deleteProviders(id) {
         _providersService.deleteProviders(id)
         .then((data) => {
            
             console.log('Proveedor eliminado exitosamente', data);
         })      
     }
    return (
        <div>
            <Toast ref={toast} />
            <div>
        </div>
            <div className="text-center">
                <h4>Proveedores registrados</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />
            
            <Dialog header="Crear nuevo proveedor" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialog()}>
                <div className="create-providers-form">
                    <h5>Ingrese el nit de la empresa</h5>
                    <InputText value={providersNit} onChange={(e) => setProvidersNit(e.target.value)} placeholder="nit" />
                    <h5>Ingrese el nombre de la empresa</h5>
                    <InputText value={providersCompanyName} onChange={(e) => setProvidersCompanyName(e.target.value)} placeholder="companyName" />
                    <h5>Ingrese el nombre del contacto</h5>
                    <InputText value={providersContactName} onChange={(e) => setProvidersContactName(e.target.value)} placeholder="contactName" />
                    <h5>Ingrese el Telefono de contacto</h5>
                    <InputText value={providersTelephone} onChange={(e) => setProvidersTelephone(e.target.value)} placeholder="telephone" />
                    <h5>Ingrese la Dirección</h5>
                    <InputText value={providersAdress} onChange={(e) => setProvidersAdress(e.target.value)} placeholder="adress" />
                    <h5>Ingrese el Email</h5>
                    <InputText value={providersEmail} onChange={(e) => setProvidersEmail(e.target.value)} placeholder="email" />
                    <h5>Ingrese el País</h5>
                    <InputText value={providersCountry} onChange={(e) => setProvidersCountry(e.target.value)} placeholder="country" />
                </div>
                
            </Dialog>

                <div className="p-inputgroup create-providers__table">
                    <InputText placeholder="Buscar proveedor" />
                    <Button icon="pi pi-search" className="p-button-primary" />
                </div>
            
            <TableProviders className="table-products" idProviders = {(id) => getProvidersIdHandler(id)}/>
        </div>
    );
}
