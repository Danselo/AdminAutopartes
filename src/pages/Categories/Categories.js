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
import {TableProductsWhereCategory } from "../../components/TableCategories/TableProductsWhereCategory";



const _categoryService = new CategoryService();
export default function Categories() {
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [categoryIdSelected, setCategoryIdSelected] = useState("");
    const [categoryNameSelected, setCategoryNameSelected] = useState("");
    const [categories, setCategories] = useState([]);
    const [categorySelected, setCategorySelected] = useState({});
    const [productsWhereCategory, setProductsWhereCategory] = useState({});
    const [displayDialogStatus, setDisplayDialogStatus] = useState(false);
   
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!categoryIdSelected} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button
                label={categorySelected.status ? "Desactivar" : "Activar"}
                className={categorySelected.status ? "p-button-raised p-button-warning dc-space-between" : "p-button-raised p-button-success dc-space-between"}
                disabled={!categorySelected.name}
                icon={categorySelected.status ? "pi pi-eye-slash" : "pi pi-eye"}
                onClick={() => {
                    if (categorySelected.status) {
                        productsWhereCategory.length !== 0 ? setDisplayDialogStatus(true) : onChangeCategoryStatusDialog(categorySelected);
                        
                    } else {
                         onChangeCategoryStatusDialog(categorySelected);

                        
                    }
                }}
            />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createCategoryAlert = (categoryName, form) => {
        confirmDialog({
            message: "¿Está seguro que desea agregar esta categoría?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateCategory(categoryName, form),
            reject: () => setDisplayDialogCreate(true),
        });
    };
    const onChangeCategoryStatusDialog = (categoryData) => {
        let categoryState;
        if (categoryData.status === false) {
            categoryState = "activar";
        } else {
            categoryState = "desactivar";
        }

        confirmDialog({
            message: "¿Está seguro que desea " + categoryState + " esta categoría?",
            header: "Cambio de estado de la categoría " + categoryData.name,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: categoryState,
            rejectLabel: "Cancelar",
            accept: () => changeCategoryStatus(categoryData),
            reject,
        });
    };

    const editCategoryAlert = (newCategoryName, form) => {
        confirmDialog({
            message: "¿Está seguro que desea editar esta categoria?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditCategory(categoryIdSelected, newCategoryName, form),
            reject: () => setDisplayDialogCreate(true),
        });
    };
 
    const cancelCreate = () => {
        confirmDialog({
            message: "¿Está seguro que desea perder el progreso?",
            header: "Confirmación",
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

    function changeCategoryStatus(categoryData) {
        let newState;
       
        if (categoryData.status === false) {

            newState = true;
        } else if (categoryData.status === true) {
            newState = false;
        }
        console.log("estado",newState)
        _categoryService.changeStatusOfCategory(categoryData.id, {status: newState}).then((response) => {
            loadCategories();
            toast.current.show({ severity: "success", summary: "Confirmación", detail: "Cambio de estado exitoso", life: 3000 });
            setDisplayDialogStatus(false)
        }).catch((error) => {
            toast.current.show({ severity: "error", summary: "Error", detail: "error", life: 3000 });
            setDisplayDialogStatus(false)
        });
    }

    function EditCategory(id, newName, form) {
        _categoryService.updateCategory(id, newName)
            .then(() => {
                loadCategories();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Categoría editada exitosamente", life: 3000 });
                form.reset()
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
                loadCategories();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Categoría creada exitosamente", life: 3000 });
                form.reset()
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }
    useEffect(() => {
        if (categorySelected.id !== undefined) {
            _categoryService
                .getProductsWhereCategory(categorySelected.id)
                .then((response) => {
                    setProductsWhereCategory(response);
                })
                .catch((e) => {
                    console.log(e, "No se encontraron productos");
                });
        }
    }, [categorySelected]);

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

            errors.newCategoryName = "Debe ingresar un nombre de categoría.";
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

            errors.categoryName = "Debe ingresar un nombre de categoría.";
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

    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label={categorySelected.status ? "Desactivar" : "Activar"} icon="pi pi-check" onClick={() => changeCategoryStatus(categorySelected)} autoFocus />
            </div>
        );
    };


    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Categorías registradas</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear categoría" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }}>
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
                                                        Nombre de categoría*
                                                    </label>
                                                    <InputText id="categoryName" {...input} autoFocus placeholder="Ingrese el nombre de la categoría" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="create-category-form__btns">
                                    <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                                    <Button type="submit" label="Crear" icon="pi pi-check" />
                                </div>
                            </form>
                        </>
                    )}
                />
            </Dialog>

            <Dialog header="Editar categoría" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }} className="dialog-edit">
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
                                                    Nombre de categoría*
                                                </label>
                                                <InputText id="newCategoryName" {...input} autoFocus
                                                    placeholder="Ingrese el nuevo nombre de la categoría" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                {getFormErrorMessage(meta)}
                                            </span>
                                        )}
                                    />
                                </div>
                                <div className="create-category-form__btns">
                                    <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                                    <Button type="submit" label="Editar" icon="pi pi-check" />
                                </div>
                            </form>
                        </>
                    )}
                />
            </Dialog>

            <Dialog header={"¿Está seguro que desea " + (categorySelected.status ? "desactivar" : "activar") +" la categoría " + categorySelected.name + "?"} footer={renderFooterDialog()} visible={displayDialogStatus} onHide={() => setDisplayDialogStatus(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <p>Los siguientes productos estan asociados a esta categoría, si desactiva la categoría los productos asociados tambien se desactivaran</p>
                <TableProductsWhereCategory className="table-products" products={productsWhereCategory} />
            </Dialog>


            <TableCategories className="table-products" categories={categories} setCategoryIdSelected={setCategoryIdSelected} setCategoryNameSelected={setCategoryNameSelected} setCategorySelected={setCategorySelected}/>
        </div>
    );
}
