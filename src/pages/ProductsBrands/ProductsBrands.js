import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableProductsBrands } from "../../components/TableProductsBrands/TableProductsBrands";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { ProductsBrandsService } from "../../service/ProductsBrandsService";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";

const _productsBrandsService = new ProductsBrandsService();

export default function ProductsBrand() {
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [productsBrandName, setProductsBrandsName] = useState("");
    const [newProductsBrandsName, setNewProductsBrandsName] = useState("");
    const [productsbrandsIdSelected, setProductsBrandsIdSelected] = useState("");
    const [productsBrandNameSelected, setProductsBrandsNameSelected] = useState("");
    const [productsbrands, setProductsBrands] = useState([]);

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteProductsBrandsAlert()} disabled={!productsbrandsIdSelected} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!productsbrandsIdSelected} />
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
    const createProductsBrandsAlert = (productsBrandName, form) => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta marca de productos?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateProductsBrands(productsBrandName, form),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editProductsBrandsAlert = (newProductsBrandsName, form) => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta marca de productos?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditProductsBrands(productsbrandsIdSelected, newProductsBrandsName, form),
            reject: () => setDisplayDialogCreate(true),
        });
    };
    const deleteProductsBrandsAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea eliminar esta Marca de productos?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
            rejectLabel: "Cancelar",
            accept: () => deleteProductsBrands(productsbrandsIdSelected),
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

    const onHideDialogEdit = (newProductsBrandsName, form) => {
        editProductsBrandsAlert(newProductsBrandsName, form)
        setDisplayDialogEdit(false);

    }

    const onHideDialogCreate = (productsBrandName, form) => {
        createProductsBrandsAlert(productsBrandName, form);
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
    // const renderFooterDialog = () => {
    //     return (
    //         <div>
    //             <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
    //             <Button label="Crear marca" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
    //         </div>
    //     );
    // };

    // const renderFooterDialogEdit = () => {
    //     return (
    //         <div>
    //             <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
    //             <Button label="Editar marca" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
    //         </div>
    //     );
    // };
    function EditProductsBrands(id, newName, form) {
        _productsBrandsService.updateProductsBrands(id, newName)
            .then(() => {
                setProductsBrandsName(newName);
                loadProductsBrands();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Marca edita exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }
    function CreateProductsBrands(productsBrandName, form) {
        _productsBrandsService
            .createProductsBrands(productsBrandName)
            .then(() => {
                setProductsBrandsName("");
                loadProductsBrands();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Marca creada exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    function deleteProductsBrands(id) {
        _productsBrandsService
            .deleteProductsBrands(id)
            .then(() => {
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Marca eliminada exitosamente", life: 3000 });
                loadProductsBrands();
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    const loadProductsBrands = () => {
        _productsBrandsService.getProductsBrands().then((response) => {
            setProductsBrands(response);
            setProductsBrandsIdSelected("");
        });
    };

    useEffect(() => {
        _productsBrandsService.getProductsBrands().then((response) => {
            setProductsBrands(response);
        });

    }, []);

    const initialValues = {
        productsBrandName: "",
    };
    const initialValuesEdit = {
        newProductsBrandsName: productsBrandNameSelected,
    };

    const validateEdit = (data) => {

        let validateExistingName = productsbrands.map((productsbrand) => {
            if (productsbrand.name === data.newProductsBrandsName) {
                return true;
            } else {
                return false;
            }
        });
        let errors = {};
        if (validateExistingName.includes(true)) {
            errors.newProductsBrandsName = "El nombre " + data.newProductsBrandsName + " ya existe, ingrese otro nombre";
        }
        if (!data.newProductsBrandsName) {

            errors.newProductsBrandsName = "Debe ingresar un nombre de marca.";
        }
        return errors;
    };

    const validateCreate = (data) => {

        let validateExistingName = productsbrands.map((productsbrand) => {

            if (productsbrand.name === data.productsBrandName) {
                return true;
            } else {
                return false;
            }
        });

        let errors = {};

        if (!data.productsBrandName) {

            errors.productsBrandName = "Debe ingresar un nombre de marca.";
        }
        if (validateExistingName.includes(true)) {
            errors.productsBrandName = "El nombre " + data.brandName + " ya existe, ingrese otro nombre";
        }

        return errors;
    };

    const onSubmit = (data, form) => {

        let productsBrandName = data.productsBrandName;
        onHideDialogCreate(productsBrandName, form);
    };

    const onSubmitEdit = (data, form) => {

        let newProductsBrandsName = data.newProductsBrandsName;
        onHideDialogEdit(newProductsBrandsName, form);
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
                <h4>Marcas de productos registradas</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear nueva marca de producto" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validate={validateCreate}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="create-brand-form">
                                    <Field
                                        name="productsBrandName"
                                        render={({ input, meta }) => (
                                            <div className="field ">
                                                <span className="create-sale-form__span">
                                                    <label htmlFor="productsBrandName" className={classNames({ "p-error": isFormFieldValid("productsBrandName") })}>
                                                        Nombre de marca*
                                                    </label>
                                                    <InputText id="productsBrandName" {...input} autoFocus placeholder="Ingrese el nombre de la marca" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
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

            <Dialog header="Editar marca" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitEdit}
                    initialValues={initialValuesEdit}
                    validate={validateEdit}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="create-brand-form">
                                    <Field
                                        name="newProductsBrandsName"
                                        render={({ input, meta }) => (

                                            <span className="create-sale-form__span">

                                                <label htmlFor="newProductsBrandsName" className={classNames({ "p-error": isFormFieldValid("newProductsBrandsName") })}>
                                                    Nombre de marca*
                                                </label>
                                                <InputText id="newProductsBrandsName" {...input} autoFocus
                                                    placeholder="Ingrese el nuevo nombre de la marca" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
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


            <TableProductsBrands className="table-products" productsbrands={productsbrands} setProductsBrandsIdSelected={setProductsBrandsIdSelected} setProductsBrandsNameSelected={setProductsBrandsNameSelected} />
        </div>
    );
}