import React, { useState, useRef, useEffect } from "react";
import "./brands.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableBrand } from "../../components/TableBrand/TableBrand";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { BrandService } from "../../service/BrandService";

const _brandService = new BrandService();

export default function Brand() {
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [brandName, setBrandName] = useState("");
    const [newBrandName, setNewBrandName] = useState("");
    const [brandIdSelected, setBrandIdSelected] = useState("");
    const [brandNameSelected, setBrandNameSelected] = useState("");
    const [brands, setBrands] = useState([]);

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteBrandAlert()} disabled={!brandIdSelected}/>
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!brandIdSelected}/>
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
    const createBrandAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta marca?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateBrand(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editBrandAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta marca?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditBrand(brandIdSelected, newBrandName),
            reject: () => setDisplayDialogCreate(true),
        });
    };
    const deleteBrandAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea eliminar esta Marca?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
            rejectLabel: "Cancelar",
            accept: () => deleteBrand(brandIdSelected),
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

    function onClickDialogEdit() {
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = () =>{
        editBrandAlert()
        setDisplayDialogEdit(false);

    }

    const onHideDialogCreate = () => {
        createBrandAlert();
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
    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Crear marca" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
            </div>
        );
    };

    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Editar marca" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
            </div>
        );
    };
    function EditBrand(id, newName) {
        _brandService.updateBrand(id, newName)
        .then(() => {
            setBrandName(newName);
            loadBrands();
            toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Marca edita exitosamente", life: 3000 });
        })
        .catch((e) => {
            toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
            console.log(e);
        });
    }
    function CreateBrand() {
        _brandService
            .createBrand(brandName)
            .then(() => {
                setBrandName("");
                loadBrands();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Marca creada exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    function deleteBrand(id) {
        _brandService
            .deleteBrand(id)
            .then(() => {
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Marca eliminada exitosamente", life: 3000 });
                loadBrands();
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    const loadBrands = () => {
        _brandService.getBrands().then((response) => {
            
            setBrands(response);
            setBrandIdSelected("");
        });
    };

    useEffect(() => {
        _brandService.getBrands().then((response) => {
            setBrands(response);
        });

    }, []);
   
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Marcas registradas</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear nueva marca" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialog()}>
                <div className="create-brand-form">
                    <h5>Ingrese el nombre de la nueva marca</h5>
                    <InputText value={brandName} onChange={(e) => setBrandName(e.target.value)} placeholder="Nombre marca" />
                </div>
            </Dialog>

            <Dialog header="Editar marca" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialogEdit()}>
                <div className="create-brand-form">
                    <h5>Ingrese el nuevo nombre</h5>
                    <InputText value={newBrandName} onChange={(e) => setNewBrandName(e.target.value)} placeholder={brandNameSelected} />
                </div>
            </Dialog>


            <TableBrand className="table-products" brands={brands} setBrandIdSelected={setBrandIdSelected} setBrandNameSelected ={setBrandNameSelected}/>
        </div>
    );
}