import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableProductsBrands } from "../../components/TableProductsBrands/TableProductsBrands";
import { TableProductsOfBrandSelected } from "../../components/TableProductsBrands/TableProductsOfBrandsSelected";
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
    const [displayDialogStatus, setDisplayDialogStatus] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);

    const [productsbrandsIdSelected, setProductsBrandsIdSelected] = useState("");
    const [productsBrandNameSelected, setProductsBrandsNameSelected] = useState("");
    const [brandSelected, setBrandSelected] = useState({});
    const [productsWhereBrand, setProductsWhereBrand] = useState({});
    const [productsbrands, setProductsBrands] = useState([]);

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-pencil" onClick={() => onClickDialogEdit()} disabled={!productsbrandsIdSelected} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button
                label={brandSelected.status ? "Desactivar" : "Activar"}
                className={brandSelected.status ? "p-button-raised p-button-warning dc-space-between" : "p-button-raised p-button-success dc-space-between"}
                disabled={!brandSelected.name}
                icon={brandSelected.status ? "pi pi-eye-slash" : "pi pi-eye"}
                onClick={() => {
                    productsWhereBrand ? setDisplayDialogStatus(true) : onChangeBrandStatusDialog(brandSelected);
                }}
            />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const onChangeBrandStatusDialog = (productBrandData) => {
        let brandState;
        if (productBrandData.status === false) {
            brandState = "activar";
        } else {
            brandState = "desactivar";
        }

        confirmDialog({
            message: "¿Esta seguro que desea " + brandState + " esta marca?",
            header: "Cambio de estado de la marca " + productBrandData.name,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: brandState,
            rejectLabel: "Cancelar",
            accept: () => changeBrandStatus(productBrandData),
            reject,
        });
    };
    const createProductsBrandsAlert = (productsBrandName, form) => {
        confirmDialog({
            message: "¿Está seguro que desea agregar esta marca de productos?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateProductsBrands(productsBrandName, form),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editProductsBrandsAlert = (newProductsBrandsName, form) => {
        confirmDialog({
            message: "¿Está seguro que desea editar esta marca de productos?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditProductsBrands(productsbrandsIdSelected, newProductsBrandsName, form),
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

    const onHideDialogEdit = (newProductsBrandsName, form) => {
        editProductsBrandsAlert(newProductsBrandsName, form);
        setDisplayDialogEdit(false);
    };

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

    function changeBrandStatus(productBrandData) {
        let newState;
        console.log(productBrandData.status);
        if (productBrandData.status === false) {
            newState = true;
        } else if (productBrandData.status === true) {
            newState = false;
        }
        console.log("estado", newState);
        console.log(productBrandData);
        _productsBrandsService
            .changeStatusOfBrand(productBrandData.id, { status: newState })
            .then((response) => {
                loadProductsBrands();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Cambio de estado exitoso", life: 3000 });
                setDisplayDialogStatus(false);
            })
            .catch((error) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "error", life: 3000 });
                setDisplayDialogStatus(false);
            });
    }

    function EditProductsBrands(id, newName, form) {
        _productsBrandsService
            .updateProductsBrands(id, newName)
            .then(() => {
                loadProductsBrands();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Marca edita exitosamente", life: 3000 });
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
                loadProductsBrands();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Marca creada exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    useEffect(() => {
        if (brandSelected.id !== undefined) {
            _productsBrandsService
                .getProductsWhereBrand(brandSelected.id)
                .then((response) => {
                    setProductsWhereBrand(response);
                })
                .catch((e) => {
                    console.log(e, "No se encontraron productos");
                });
        }
    }, [brandSelected]);

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
            errors.productsBrandName = "El nombre ya existe, ingrese otro";
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
        return a;
    };
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) ? <small className="p-error">{meta.error}</small> : <small className="p-error"></small>;
    };
    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label={brandSelected.status ? "Desactivar" : "Activar"} icon="pi pi-check" onClick={() => changeBrandStatus(brandSelected)} autoFocus />
            </div>
        );
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
                                <div className="create-brand-form__button">
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
                                                <InputText id="newProductsBrandsName" {...input} autoFocus placeholder="Ingrese el nuevo nombre de la marca" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                {getFormErrorMessage(meta)}
                                            </span>
                                        )}
                                    />
                                </div>
                                <div className="create-brand-form__button">
                                    {/* <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" /> */}
                                    <Button type="submit" label="Editar marca" icon="pi pi-check" />
                                </div>
                            </form>
                        </>
                    )}
                />
            </Dialog>

            <Dialog
                header={"¿Esta seguro que desea " + (brandSelected.status ? "desactivar" : "activar") + " la marca " + brandSelected.name + "?"}
                footer={renderFooterDialog()}
                visible={displayDialogStatus}
                onHide={() => setDisplayDialogStatus(false)}
                breakpoints={{ "960px": "75vw" }}
                style={{ width: "50vw" }}
            >
                <p>Los siguientes productos estan asociados a esta marca</p>
                <TableProductsOfBrandSelected className="table-products" products={productsWhereBrand} />
            </Dialog>

            <TableProductsBrands className="table-products" productsbrands={productsbrands} setBrandSelected={setBrandSelected} setProductsBrandsIdSelected={setProductsBrandsIdSelected} setProductsBrandsNameSelected={setProductsBrandsNameSelected} />
        </div>
    );
}
