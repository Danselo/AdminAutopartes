import React, { useState, useRef, useEffect } from "react";
import "./vehicles.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableVehicles } from "../../components/TableVehicles/TableVehicles";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { VehicleService } from "../../service/VehicleService";
import { BrandService } from "../../service/BrandService";
import { Dropdown } from "primereact/dropdown";

const _vehicleService = new VehicleService();
const _brandService = new BrandService();
export default function Vehicles() {
    const [vehicleSelected, setVehicleSelected] = useState({});

    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [vehicleName, setVehicleName] = useState("");
    const [vehicleModel, setVehicleModel] = useState("");
    const [selectedVehicleBrand, setSelectedVehicleBrand] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [brands, setBrands] = useState([]);

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteVehicleAlert()} disabled={!vehicleSelected.name} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!vehicleSelected.name} />
        </React.Fragment>
    );
    console.log(vehicleSelected.length)
    const rightContents = (
        <React.Fragment>
            <Button label="Desactivar" className="p-button-raised p-button-warning dc-space-between" icon="pi pi-eye-slash" onClick={() => onClickDialogCreate()} />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createVehicleAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta vehiculo?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateVehicle(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editVehicleAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta vehiculo?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditVehicle(),
            reject: () => setDisplayDialogEdit(false),
        });
    };
    const deleteVehicleAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea eliminar esta Categoria?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
            rejectLabel: "Cancelar",
            accept: () => deleteVehicle(vehicleSelected),
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
        getBrands();
        setDisplayDialogCreate(true);
    }

    function onClickDialogEdit() {
        getBrands();
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = () => {
        editVehicleAlert();
        setDisplayDialogEdit(false);
    };

    const onHideDialogCreate = () => {
        createVehicleAlert();
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

    const onVehicleBrandChange = (e) => {
        setSelectedVehicleBrand(e.value);
    };
    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Crear vehiculo" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
            </div>
        );
    };

    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                <Button label="Editar vehiculo" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
            </div>
        );
    };
    function EditVehicle() {
        _vehicleService
            .updateVehicle(vehicleSelected)
            .then(() => {
                setVehicleSelected({});
                loadVehicles();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria edita exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }
    function getBrands() {
        _brandService.getBrands().then((response) => {
            setBrands(response);
        });
    }

    function CreateVehicle() {
        _vehicleService
            .createVehicle(vehicleName, vehicleModel, selectedVehicleBrand.id)
            .then(() => {
                setVehicleName("");
                loadVehicles();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria creada exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    function deleteVehicle(vehicle) {
        _vehicleService
            .deleteVehicle(vehicle.id)
            .then(() => {
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria eliminada exitosamente", life: 3000 });
                loadVehicles();
                setVehicleSelected({});

            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    const loadVehicles = () => {
        _vehicleService.getVehicles().then((response) => {
            setVehicles(response);
        });
    };

    const onChangeVehicleSelectedEditForm =  (eventOnChange)=>{
        console.log(eventOnChange.target)
         const vehicleUpdated = {
            ...vehicleSelected,
            [eventOnChange.target.name]:eventOnChange.target.value
        }
        console.log(vehicleUpdated);
        setVehicleSelected(vehicleUpdated)
    }
    useEffect(() => {
        _vehicleService.getVehicles().then((response) => {
            setVehicles(response);
        });
    }, []);

    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Vehículos registrados</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear un nuevo vehiculo" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }} footer={renderFooterDialog()}>
                <div className="create-vehicle-form">
                    <h5>Ingrese los datos del nuevo vehiculo</h5>
                    <InputText value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} placeholder="Nombre del vehiculo" className="create-vehicle-form__input" />
                    <InputText value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="Modelo del vehiculo" className="create-vehicle-form__input" />
                    <Dropdown value={selectedVehicleBrand} options={brands} onChange={onVehicleBrandChange} optionLabel="name" placeholder="Marca del vehiculo" className="create-vehicle-form__dropdown" />
                </div>
            </Dialog>
            <Dialog header="Editar vehiculo" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialogEdit()}>
                <div className="create-vehicle-form">
                    <h5>Ingrese los datos del nuevo vehiculo</h5>
                    <InputText value={vehicleSelected.name} onChange={onChangeVehicleSelectedEditForm} 
                    name="name" placeholder="Nombre del vehiculo" className="create-vehicle-form__input" />
                    <InputText value={vehicleSelected.model} 
                    name="model"
                    onChange={onChangeVehicleSelectedEditForm} placeholder="Modelo del vehiculo" className="create-vehicle-form__input" />
                    <Dropdown value={vehicleSelected.idBrand} 
                    name="idBrand" optionValue="id"
                    options={brands} onChange={onChangeVehicleSelectedEditForm} optionLabel="name" placeholder="Marca del vehiculo" className="create-vehicle-form__dropdown" />
                </div>
            </Dialog>

            <TableVehicles className="table-products" vehicles={vehicles} setVehicleSelected={setVehicleSelected} />
        </div>
    );
}
