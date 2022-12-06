import React, { useState, useRef, useEffect } from "react";
import "./brands.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableBrand } from "../../components/TableBrand/TableBrand";
import { TableVehiclesOfBrandSelected } from "../../components/TableBrand/TableVehiclesOfBrandSelected";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { BrandService } from "../../service/BrandService";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";

const _brandService = new BrandService();

export default function Brand() {
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogStatus, setDisplayDialogStatus] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [brandName, setBrandName] = useState("");
    const [brandIdSelected, setBrandIdSelected] = useState("");
    const [brandNameSelected, setBrandNameSelected] = useState("");
    const [brandSelected, setBrandSelected] = useState({});
    const [vehiclesWhereBrand, setVehiclesWhereBrand] = useState({});
    const [brands, setBrands] = useState([]);

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            {/* <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteBrandAlert()} disabled={!brandIdSelected} /> */}
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-pencil" onClick={() => onClickDialogEdit()} disabled={!brandIdSelected} />
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
                    vehiclesWhereBrand ? setDisplayDialogStatus(true) : onChangeBrandStatusDialog(brandSelected);
                }}
            />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const onChangeBrandStatusDialog = (brandData) => {
        let brandState;
        if (brandData.status === false) {
            brandState = "activar";
        } else {
            brandState = "desactivar";
        }

        confirmDialog({
            message: "¿Esta seguro que desea " + brandState + " esta marca?",
            header: "Cambio de estado de la marca " + brandData.name,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: brandState,
            rejectLabel: "Cancelar",
            accept: () => changeBrandStatus(brandData),
            reject,
        });
    };
    const createBrandAlert = (brandName, form) => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta marca?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateBrand(brandName, form),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editBrandAlert = (newBrandName, form) => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta marca?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditBrand(brandIdSelected, newBrandName, form),
            reject: () => setDisplayDialogEdit(true),
        });
    };
    // const deleteBrandAlert = () => {
    //     confirmDialog({
    //         message: "¿Esta seguro que desea eliminar esta Marca?",
    //         header: "Confirmación",
    //         icon: "pi pi-exclamation-triangle",
    //         acceptLabel: "Eliminar",
    //         rejectLabel: "Cancelar",
    //         accept: () => deleteBrand(brandIdSelected),
    //         reject: () => setDisplayDialogCreate(true),
    //     });
    // };
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
    const confirmCancel = () => {
        setDisplayDialogEdit(false);
        reject();
    };
    const cancelEdit = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => confirmCancel(),
            reject: () => setDisplayDialogEdit(true),
        });
    };
    function onClickDialogCreate() {
        setDisplayDialogCreate(true);
    }

    function onClickDialogEdit() {
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = (newBrandName, form) => {
        editBrandAlert(newBrandName, form);
        setDisplayDialogEdit(false);
    };

    const onHideDialogCreate = (brandName, form) => {
        createBrandAlert(brandName, form);
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
    const onHideDialogEditBrand = () => {
        cancelEdit();
        setDisplayDialogCreate(false);
    };

    function changeBrandStatus(brandData) {
        let newState;

        if (brandData.status === false) {
            newState = true;
        } else if (brandData.status === true) {
            newState = false;
        }
        console.log("estado", newState);
        _brandService
            .changeStatusOfBrand(brandData.id, { status: newState })
            .then((response) => {
                loadBrands();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Cambio de estado exitoso", life: 3000 });
                setDisplayDialogStatus(false);
            })
            .catch((error) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "error", life: 3000 });
                setDisplayDialogStatus(false);
            });
    }

    function EditBrand(id, newName, form) {
        _brandService
            .updateBrand(id, newName)
            .then(() => {
                setBrandName(newName);
                loadBrands();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Marca edita exitosamente", life: 3000 });
                form.restart();
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }
    function CreateBrand(brandName, form) {
        // setBrandName(brandName)
        _brandService
            .createBrand(brandName)
            .then(() => {
                setBrandName("");
                loadBrands();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Marca creada exitosamente", life: 3000 });
                form.restart();
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    useEffect(() => {
        if (brandSelected.id !== undefined) {
            _brandService
                .getVehiclesWhereBrand(brandSelected.id)
                .then((response) => {
                    setVehiclesWhereBrand(response);
                })
                .catch((e) => {
                    console.log(e, "No se encontraron productos");
                });
        }
    }, [brandSelected]);

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

    const initialValues = {
        brandName: "",
    };
    const initialValuesEdit = {
        newBrandName: brandNameSelected,
    };

    const validate = (data) => {
        let validateExistingName = brands.map((brand) => {
            if (brand.name === data.brandName) {
                return true;
            } else {
                return false;
            }
        });
        let errors = {};

        if (!data.brandName) {
            errors.brandName = "Debe ingresar un nombre de marca crear.";
        }
        if (validateExistingName.includes(true)) {
            errors.brandName = "El nombre " + data.brandName + " ya existe, ingrese otro nombre";
        }
        return errors;
    };

    const validateEdit = (data) => {
        let validateExistingName = brands.map((brand) => {
            if (brand.name === data.newBrandName) {
                return true;
            } else {
                return false;
            }
        });
        let errors = {};
        console.log(validateExistingName);
        if (validateExistingName.includes(true)) {
            errors.newBrandName = "El nombre " + data.newBrandName + " ya existe, ingrese otro nombre";
        }
        if (!data.newBrandName) {
            errors.newBrandName = "Debe ingresar un nombre de marca.";
        }
        return errors;
    };

    const onSubmit = (data, form) => {
        console.log("entre al onSubmit", data);
        let brandName = data.brandName;
        onHideDialogCreate(brandName, form);
    };

    const onSubmitEdit = (data, form) => {
        console.log("Entre al onSubmitEdit");
        let newBrandName = data.newBrandName;
        onHideDialogEdit(newBrandName, form);
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
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
                <h4>Marcas de vehículos registrados</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear nueva marca" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="create-brand-form">
                                    <Field
                                        name="brandName"
                                        render={({ input, meta }) => (
                                            <div className="field ">
                                                <span className="create-brand-form__span">
                                                    <label htmlFor="brandName" className={classNames({ "p-error": isFormFieldValid("brandName") })}>
                                                        Nombre de marca*
                                                    </label>
                                                    <InputText id="brandName" {...input} autoFocus placeholder="Ingrese el nombre de la marca" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )}
                                    />
                                </div>
                                <div className="create-brand-buttons">
                                    <Button label="Cancelar" icon="pi pi-times" type="button" onClick={() => onHideDialogCancel()} className="p-button-text" />
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
                                        name="newBrandName"
                                        render={({ input, meta }) => (
                                            <span className="create-sale-form__span">
                                                <label htmlFor="newBrandName" className={classNames({ "p-error": isFormFieldValid("newBrandName") })}>
                                                    Nombre de marca*
                                                </label>
                                                <InputText id="newBrandName" {...input} autoFocus placeholder="Ingrese el nuevo nombre de la marca" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                {getFormErrorMessage(meta)}
                                            </span>
                                        )}
                                    />
                                </div>
                                <div>
                                    <Button label="Cancelar" icon="pi pi-times" type="button" onClick={() => onHideDialogEditBrand()} className="p-button-text" />
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
                <p>Los siguientes vehículos están asociados a esta marca</p>
                <strong>Nota:</strong>

                <p>
                    <strong>-Si vas a desactivar la marca, el vehículo se desactivara</strong>{" "}
                </p>
                <p>
                    <strong>-Si vas a activar la marca el vehículo seguirá desactivado</strong>{" "}
                </p>

                <TableVehiclesOfBrandSelected className="table-products" vehicles={vehiclesWhereBrand} />
            </Dialog>

            <TableBrand className="table-products" brands={brands} setBrandSelected={setBrandSelected} setBrandIdSelected={setBrandIdSelected} setBrandNameSelected={setBrandNameSelected} />
        </div>
    );
}
