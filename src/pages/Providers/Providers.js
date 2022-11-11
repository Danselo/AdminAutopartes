import React, { useState, useRef, useEffect } from "react";
import "./providers.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableProviders } from "../../components/TableProviders/TableProviders";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { ProviderService } from "../../service/ProvidersService";


const _providerService = new ProviderService();
export default function Providers() {
    const [providerSelected, setProviderSelected] = useState({});
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [providerNit, setProviderNit] = useState("");
    const [providerCompanyName, setProviderCompanyName] = useState("");
    const [providerContactName, setProviderContactName] = useState("");
    const [providerTelephone, setProviderTelephone] = useState("");
    const [providerAdress, setProviderAdress] = useState("");
    const [providerEmail, setProviderEmail] = useState("");
    const [providerCountry, setProviderCountry] = useState("");
    const [providers, setProviders] = useState([]);
  

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteProviderAlert()} disabled={!providerSelected.nit} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!providerSelected.nit} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button label="Desactivar" className="p-button-raised p-button-warning dc-space-between" icon="pi pi-eye-slash" onClick={() => onClickDialogCreate()} />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createProviderAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta provedor?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateProvider(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editProviderAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta provedor?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditProvider(),
            reject: () => setDisplayDialogEdit(false),
        });
    };
    const deleteProviderAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea eliminar esta Categoria?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
            rejectLabel: "Cancelar",
            accept: () => deleteProvider(providerSelected),
            reject,
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
            acceptLabel: "No editar",
            rejectLabel: "Cancelar",
            accept: () => reject(),
            reject: () => setDisplayDialogEdit(true),
        });
    };
    function onClickDialogCreate() {   
        setDisplayDialogCreate(true);
    }

    function onClickDialogEdit() {
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = () => {
        editProviderAlert();
        setDisplayDialogEdit(false);
    };

    const onHideDialogCreate = () => {
        createProviderAlert();
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
        cancelEdit();
        setDisplayDialogEdit(false);
    };


    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Crear provedor" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
            </div>
        );
    };

    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                <Button label="Editar provedor" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
            </div>
        );
    };
    function EditProvider() {
        _providerService
            .updateProvider(providerSelected)
            .then(() => {
                setProviderSelected({});
                loadProviders();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "proveedor editado exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal al editar el proveedor", life: 3000 });
                console.log(e);
            });
    }
 
    function CreateProvider() {
        _providerService
            .createProvider(providerNit, 
                providerCompanyName,
                providerContactName, 
                providerTelephone, 
                providerAdress, 
                providerEmail,
                providerCountry)
            .then(() => {
                setProviderNit("");
                setProviderCompanyName("");
                setProviderContactName("");
                setProviderTelephone("");
                setProviderEmail("");
                setProviderAdress("");
                setProviderCountry("");
                loadProviders();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Proveedor creado exitosamente", life: 3000 });
            })
            .catch((e) => {
               toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, al crear el proveedor", life: 3000 });
                console.log(e);
            });
    }

    function deleteProvider(provider) {
        _providerService
            .deleteProvider(provider.id)
            .then(() => {
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Proveedor eliminado exitosamente", life: 3000 });
                loadProviders();
                setProviderSelected({});

            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    const loadProviders = () => {
        _providerService.getProviders().then((response) => {
            setProviders(response);
        });
    };

    const onChangeProviderSelectedEditForm =  (eventOnChange)=>{
       
         const providerUpdated = {
            ...providerSelected,
            [eventOnChange.target.name]:eventOnChange.target.value
        }
        
        setProviderSelected(providerUpdated)
    }
    useEffect(() => {
        _providerService.getProviders().then((response) => {
            setProviders(response);
        });
    }, []);
    
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Proveedores registrados</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear un nuevo provedor" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }} footer={renderFooterDialog()}>
                <div className="create-provider-form">
                    <h5>Ingrese los datos del nuevo provedor</h5>
                    <InputText value={providerNit} onChange={(e) => setProviderNit(e.target.value)} placeholder="Nit del provedor" className="create-provider-form__input" />
                    <InputText value={providerCompanyName} onChange={(e) => setProviderCompanyName(e.target.value)} placeholder="Nombre de la empresa" className="create-provider-form__input" />
                    <InputText value={providerContactName} onChange={(e) => setProviderContactName(e.target.value)} placeholder="Persona de contacto" className="create-provider-form__input" />
                    <InputText value={providerTelephone} onChange={(e) => setProviderTelephone(e.target.value)} placeholder="Telefono de contacto" className="create-provider-form__input" />
                    <InputText value={providerAdress} onChange={(e) => setProviderAdress(e.target.value)} placeholder="Direccion de la empresa" className="create-provider-form__input" />
                    <InputText value={providerEmail} onChange={(e) => setProviderEmail(e.target.value)} placeholder="Email contacto" className="create-provider-form__input" />
                    <InputText value={providerCountry} onChange={(e) => setProviderCountry(e.target.value)} placeholder="Pais origen proveedor" className="create-provider-form__input" />
                   
                </div>
            </Dialog>
            <Dialog header="Editar provedor" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialogEdit()}>
                <div className="create-provider-form">
                    <h5>Ingrese los datos del nuevo proveedor</h5>
                    <InputText value={providerSelected.nit} onChange={onChangeProviderSelectedEditForm} 
                    name="nit" placeholder="Nit del proveedor" className="create-provider-form__input" />
                    <InputText value={providerSelected.companyName} onChange={onChangeProviderSelectedEditForm} 
                    name="companyName" placeholder="Nombre de la empresal" className="create-provider-form__input" />
                    <InputText value={providerSelected.contactName} onChange={onChangeProviderSelectedEditForm} 
                    name="contactName" placeholder="Persona de contacto" className="create-provider-form__input" />
                    <InputText value={providerSelected.telephone} onChange={onChangeProviderSelectedEditForm} 
                    name="telephone" placeholder="Telefono de contacto" className="create-provider-form__input" />
                    <InputText value={providerSelected.adress} onChange={onChangeProviderSelectedEditForm} 
                    name="adress" placeholder="Direccion de la empresa" className="create-provider-form__input" />
                    <InputText value={providerSelected.email} onChange={onChangeProviderSelectedEditForm} 
                    name="email" placeholder="Email contacto" className="create-provider-form__input" />
                    <InputText value={providerSelected.country} onChange={onChangeProviderSelectedEditForm} 
                    name="country" placeholder="Pais origen proveedor" className="create-provider-form__input" />
                   
                </div>
            </Dialog>

            <TableProviders className="table-products" providers={providers} setProviderSelected={setProviderSelected} />
        </div>
    );
}