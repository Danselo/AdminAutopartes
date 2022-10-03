import React, { useState, useRef, useEffect } from "react";
import "./categories.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableCategories } from "../../components/TableCategories/TableCategories";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { CategoryService } from "../../service/CategoryService";

const _categoryService = new CategoryService();
export default function Categories() {
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [categoryName, setCategoryName] = useState("");
    const [newCategoryName, setNewCategoryName] = useState("");
    const [categoryIdSelected, setCategoryIdSelected] = useState("");
    const [categoryNameSelected, setCategoryNameSelected] = useState("");
    const [categories, setCategories] = useState([]);

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteCategoryAlert()} disabled={!categoryIdSelected}/>
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!categoryIdSelected}/>
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
    const createCategoryAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta categoria?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateCategory(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editCategoryAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta categoria?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditCategory(categoryIdSelected, newCategoryName),
            reject: () => setDisplayDialogCreate(true),
        });
    };
    const deleteCategoryAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea eliminar esta Categoria?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
            rejectLabel: "Cancelar",
            accept: () => deleteCategory(categoryIdSelected),
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
        editCategoryAlert()
        setDisplayDialogEdit(false);

    }

    const onHideDialogCreate = () => {
        createCategoryAlert();
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
                <Button label="Crear categoria" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
            </div>
        );
    };

    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Editar categoria" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
            </div>
        );
    };
    function EditCategory(id, newName) {
        _categoryService.updateCategory(id, newName)
        .then(() => {
            setCategoryName(newName);
            loadCategories();
            toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria edita exitosamente", life: 3000 });
        })
        .catch((e) => {
            toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
            console.log(e);
        });
    }
    function CreateCategory() {
        _categoryService
            .createCategory(categoryName)
            .then(() => {
                setCategoryName("");
                loadCategories();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria creada exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    function deleteCategory(id) {
        _categoryService
            .deleteCategory(id)
            .then(() => {
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria eliminada exitosamente", life: 3000 });
                loadCategories();
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    const loadCategories = () => {
        _categoryService.getCategories().then((response) => {
            setCategories(response);
            setCategoryIdSelected("");
        });
    };
    useEffect(() => {
        _categoryService.getCategories().then((response) => {
            setCategories(response);
        });
    }, []);
   
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Categorias registradas</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear nueva categoria" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialog()}>
                <div className="create-category-form">
                    <h5>Ingrese el nombre de la nueva categoria</h5>
                    <InputText value={categoryName} onChange={(e) => setCategoryName(e.target.value)} placeholder="Nombre categoria" />
                </div>
            </Dialog>

            <Dialog header="Editar categoria" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} footer={renderFooterDialogEdit()}>
                <div className="create-category-form">
                    <h5>Ingrese el nuevo nombre</h5>
                    <InputText value={newCategoryName} onChange={(e) => setNewCategoryName(e.target.value)} placeholder={categoryNameSelected} />
                </div>
            </Dialog>


            <TableCategories className="table-products" categories={categories} setCategoryIdSelected={setCategoryIdSelected} setCategoryNameSelected ={setCategoryNameSelected}/>
        </div>
    );
}
