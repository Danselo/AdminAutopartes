import React, { useState, useRef } from "react";
import "./categories.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableCategories } from "../../components/TableCategories/TableCategories";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from 'primereact/toolbar';
import axios from "axios";
import { CategoryService } from "../../service/CategoryService";
const url = "http://localhost:5000/categories/create";

export default function Categories() {
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const toast = useRef(null);
    const [categoryName, setCategoryName] = useState("");
    const [categoryId, setCategoryId] = useState("");
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteCategoryAlert()} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button label="Desactivar" className="p-button-raised p-button-warning dc-space-between" icon="pi pi-eye-slash" onClick={() => onClickDialogCreate()} />
        
        </React.Fragment>
    );
    const accept = () => {
        toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria creada exitosamente", life: 3000 });
        CreateCategory();
    };
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const acceptDelete = () => {
        toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria eliminada exitosamente", life: 3000 });
        deleteCategory(categoryId)
    };

    const createCategory = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta Categoria?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept,
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
        createCategory();
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

    function CreateCategory() {
        axios
            .post(url, {
                name: categoryName,
            })
            .then((response) => {
                setCategoryName(response.data);
            });
    }
    function getCategoryIdHandler(id){
        setCategoryId(id)
    }

    const _categoryService = new CategoryService();
    
    function deleteCategory(id) {
         _categoryService.deleteCategory(id)
         .then((data) => {
            
             console.log('Categoria eliminada exitosamente', data);
         })      
     }
    return (
        <div>
            <Toast ref={toast} />
            <div>
        </div>
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

                <div className="p-inputgroup create-category__table">
                    <InputText placeholder="Buscar categoria" />
                    <Button icon="pi pi-search" className="p-button-primary" />
                </div>
            
            <TableCategories className="table-products" idCategory = {(id) => getCategoryIdHandler(id)}/>
        </div>
    );
}
