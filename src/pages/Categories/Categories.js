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
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";

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
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteCategoryAlert()} disabled={!categoryIdSelected} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!categoryIdSelected} />
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
    const createCategoryAlert = (categoryName, form) => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta categoria?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateCategory(categoryName, form),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editCategoryAlert = (newCategoryName, form) => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta categoria?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditCategory(categoryIdSelected, newCategoryName, form),
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

    const onHideDialogEdit = (newCategoryName, form) => {
        editCategoryAlert(newCategoryName, form)
        setDisplayDialogEdit(false);

    }

    const onHideDialogCreate = (categoryName, form) => {
        createCategoryAlert(categoryName, form);
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

    function EditCategory(id, newName, form) {
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
    function CreateCategory(categoryName, form) {
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

    const initialValues = {
        categoryName: "",
    };
    const initialValuesEdit = {
        newCategoryName: categoryNameSelected,
    };

    const validateEdit = (data) => {

        let validateExistingName = categories.map((category) => {
            if (category.name === data.newCategoryName) {
                return true;
            } else {
                return false;
            }
        });
        let errors = {};
        if (validateExistingName.includes(true)) {
            errors.newCategoryName = "El nombre " + data.newCategoryName + " ya existe, ingrese otro nombre";
        }
        if (!data.newCategoryName) {

            errors.newCategoryName = "Debe ingresar un nombre de categoria.";
        }
        return errors;
    };

    const validateCreate = (data) => {

        let validateExistingName = categories.map((category) => {

            if (category.name === data.categoryName) {
                return true;
            } else {
                return false;
            }
        });

        let errors = {};

        if (!data.categoryName) {

            errors.categoryName = "Debe ingresar un nombre de categoria.";
        }
        if (validateExistingName.includes(true)) {
            errors.categoryName = "El nombre " + data.categoryName + " ya existe, ingrese otro nombre";
        }

        return errors;
    };

    const onSubmit = (data, form) => {

        let categoryName = data.categoryName;
        onHideDialogCreate(categoryName, form);
    };

    const onSubmitEdit = (data, form) => {

        let newCategoryName = data.newCategoryName;
        onHideDialogEdit(newCategoryName, form);
    };

    const isFormFieldValid = (meta) => {
        let a = !!(meta.touched && meta.error);
        return a
    }
    const getFormErrorMessage = (meta) => {

        return isFormFieldValid(meta) ? <small className="p-error">{meta.error}</small> : <small className="p-error"></small>;
    };

    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Categorias registradas</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear nueva categoria" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validate={validateCreate}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="create-category-form">
                                    <Field
                                        name="categoryName"
                                        render={({ input, meta }) => (
                                            <div className="field ">
                                                <span className="create-sale-form__span">
                                                    <label htmlFor="categoryName" className={classNames({ "p-error": isFormFieldValid("categoryName") })}>
                                                        Nombre de categoria*
                                                    </label>
                                                    <InputText id="categoryName" {...input} autoFocus placeholder="Ingrese el nombre de la categoria" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                                    <Button type="submit" label="Crear marca" icon="pi pi-check" />
                                </div>
                            </form>
                        </>
                    )}
                />
            </Dialog>

            <Dialog header="Editar categoria" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitEdit}
                    initialValues={initialValuesEdit}
                    validate={validateEdit}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="create-category-form">
                                    <Field
                                        name="newCategoryName"
                                        render={({ input, meta }) => (

                                            <span className="create-sale-form__span">

                                                <label htmlFor="newCategoryName" className={classNames({ "p-error": isFormFieldValid("newCategoryName") })}>
                                                    Nombre de categoria*
                                                </label>
                                                <InputText id="newCategoryName" {...input} autoFocus
                                                    placeholder="Ingrese el nuevo nombre de la categoria" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                {getFormErrorMessage(meta)}
                                            </span>
                                        )}
                                    />
                                </div>
                                <div>
                                    {/* <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" /> */}
                                    <Button type="submit" label="Editar marca" icon="pi pi-check" />
                                </div>
                            </form>
                        </>
                    )}
                />
            </Dialog>


            <TableCategories className="table-products" categories={categories} setCategoryIdSelected={setCategoryIdSelected} setCategoryNameSelected={setCategoryNameSelected} />
        </div>
    );
}
