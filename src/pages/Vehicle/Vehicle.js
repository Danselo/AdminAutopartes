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
import { TableProductsWhereVehicle } from "../../components/TableVehicles/TableProductsWhereVehicle";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";
import { InputNumber } from "primereact/inputnumber";

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
    const [displayDialogStatus, setDisplayDialogStatus] = useState(false);
    const [productsWhereVehicle, setProductsWhereVehicle] = useState({});

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!vehicleSelected.name} />
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button
                label={vehicleSelected.status ? "Desactivar" : "Activar"}
                className={vehicleSelected.status ? "p-button-raised p-button-warning dc-space-between" : "p-button-raised p-button-success dc-space-between"}
                disabled={!vehicleSelected.name}
                onClick={() => {
                    if (vehicleSelected.status) {
                        productsWhereVehicle.length !== 0 ? setDisplayDialogStatus(true) : changeVehicleStatusDialog(vehicleSelected);
                    } else {
                        changeVehicleStatusDialog(vehicleSelected);
                    }
                }}
                icon={vehicleSelected.status ? "pi pi-eye-slash" : "pi pi-eye"}
            />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createVehicleAlert = (form, data) => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta vehículo?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateVehicle(form, data),
            reject: () => setDisplayDialogCreate(true),
        });
    };
    const changeVehicleStatusDialog = (vehicleData) => {
        let vehicleState;
        if (vehicleData.status === false) {
            vehicleState = "activar";
        } else {
            vehicleState = "desactivar";
        }

        confirmDialog({
            message: "¿Esta seguro que desea " + vehicleState + " este vehículo?",
            header: "Cambio de estado del vehículo " + vehicleData.id,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: vehicleState,
            rejectLabel: "Cancelar",
            accept: () => changeVahicleStatus(vehicleData),
            reject,
        });
    };

    const changeVahicleStatus = (vehicleData) => {
        let newState;
        if (vehicleData.status === false) {
            newState = true;
        } else if (vehicleData.status === true) {
            newState = false;
        }

        _vehicleService
            .changeStatusOfVehicle(vehicleData.id, { status: newState })
            .then((e) => {
                if (e.data == null) {
                    loadVehicles();
                    setDisplayDialogStatus(false);
                    toast.current.show({ severity: "error", summary: "No procede", detail: "Lo sentimos, pero no puede activar este vehículo, porque la marca de este vehículo se encuentra desactivada", life: 9000 });
                } else {
                    loadVehicles();
                    setDisplayDialogStatus(false);
                    toast.current.show({ severity: "success", summary: "Confirmación", detail: "Cambio de estado exitoso", life: 3000 });
                }
            })
            .catch((error) => {
                toast.current.show({ severity: "error", summary: "Error", detail: error, life: 3000 });
            });
    };

    const editVehicleAlert = (form, data) => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta vehículo?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditVehicle(form, data),
            reject: () => setDisplayDialogEdit(false),
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
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => reject(),
            reject: () => setDisplayDialogEdit(true),
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

    // const onHideDialogCreate = () => {
    //     createVehicleAlert();
    //     setDisplayDialogCreate(false);
    // };

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

    // const onVehicleBrandChange = (e) => {
    //     setSelectedVehicleBrand(e.value);
    // };
    // const renderFooterDialog = () => {
    //     return (
    //         <div>
    //             <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
    //             <Button label="Crear vehículo" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
    //         </div>
    //     );
    // };

    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                <Button label="Editar vehículo" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
            </div>
        );
    };

    const renderFooterDialogChangeStatus = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialogStatus(false)} className="p-button-text" />
                <Button label="Desactivar" icon="pi pi-check" onClick={() => changeVahicleStatus(vehicleSelected)} autoFocus />
            </div>
        );
    };

    const initialValues = {
        vehicleName: "",
        vehicleModel: "",
        selectedVehicleBrand: "",
    };

    const initialValuesEdit = {
        vehicleName: vehicleSelected.name,
        vehicleModel: vehicleSelected.model,
        selectedVehicleBrand: vehicleSelected.brands_vehicles?.name,
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const onSubmit = (data, form) => {
        createVehicleAlert(form, data);
    };
    const onSubmitEdit = (data, form) => {
        console.log(data)
        editVehicleAlert(data, form);
       
    };

    const validate = (data) => {
        let letters = ["a", "b", "c", "d", "e", "f", "g", "h", "i", "j", "k", "l", "m", "n", "o", "p", "q", "r", "s", "t", "u", "v", "w", "x", "y", "z"];
        let specialCharacters = ["/", "-", "_", "@", "!", "#", "$", "%", "^", "&", "*", "(", ")", "[", "]", "{", "}", '"', "'", ":", ";"];
        console.log(data);
        let validateExistingNameAndModel = vehicles.map((vehicle) => {
            if (vehicle.name === data.vehicleName && vehicle.model === data.vehicleModel) {
                return true;
            } else {
                return false;
            }
        });

        let errors = {};
        if (data.vehicleModel !== undefined) {
            if (data.vehicleModel.length === 4) {
                letters.forEach((letter) => {
                    let arrayOfModel = data.vehicleModel.split("");
                   
                    if (arrayOfModel.includes(letter)) {
                        errors.vehicleModel = "El modelo no puede contener letras, solo numeros.";
                    }
                });
            }
            if (data.vehicleModel.length === 4) {
                specialCharacters.forEach((character) => {
                    if (data.vehicleModel.includes(character)) {
                        errors.vehicleModel = "El modelo no puede contener caracteres especiales, solo numeros.";
                    }
                });
            }
            if (data.vehicleModel.length > 4) {
                errors.vehicleModel = "El modelo del vehículo no puede ser un numero mayor a 4 digitos";
            }
        }

        if (!data.vehicleName) {
            errors.vehicleName = "El nombre del vehículo es requerido.";
        }
        if (validateExistingNameAndModel.includes(true)) {
            errors.vehicleName = "El vehículo " + data.vehicleName + " " + data.vehicleModel + " ya existe, ingrese otro nombre y/o modelo";
        }

        if (!data.vehicleModel) {
            errors.vehicleModel = "El modelo del vehículo es requerido";
        }

        if (!data.selectedVehicleBrand) {
            errors.selectedVehicleBrand = "La marca del vehículo es requerido";
        }
        return errors;
    };

    function EditVehicle(form, data) {

        _vehicleService
            .updateVehicle(vehicleSelected)
            .then(() => {
                setVehicleSelected({});
                loadVehicles();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Vehículo edito exitosamente", life: 3000 });
                setDisplayDialogEdit(false);
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

    function CreateVehicle(form, data) {
        console.log(data);
        _vehicleService
            .createVehicle(data.vehicleName, data.vehicleModel, data.selectedVehicleBrand.id)
            .then(() => {
                setVehicleName("");
                setVehicleModel("");
                setSelectedVehicleBrand("");
                loadVehicles();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Vehículo creado exitosamente", life: 3000 });
            })
            .then((e) => {
                form.restart();
                setDisplayDialogCreate(false);
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    useEffect(() => {
        if (vehicleSelected.id !== undefined) {
            _vehicleService
                .getProductsWhereVehicle(vehicleSelected.id)
                .then((response) => {
                    setProductsWhereVehicle(response);
                })
                .catch((e) => {
                    console.log(e, "No se encontrarón productos");
                });
        }
    }, [vehicleSelected]);

    const loadVehicles = () => {
        _vehicleService.getVehicles().then((response) => {
            setVehicles(response);
        });
    };

    const onChangeVehicleSelectedEditForm = (eventOnChange) => {
        console.log(eventOnChange.target);
        const vehicleUpdated = {
            ...vehicleSelected,
            [eventOnChange.target.name]: eventOnChange.target.value,
        };
        console.log(vehicleUpdated);
        setVehicleSelected(vehicleUpdated);
    };
    useEffect(() => {
        _vehicleService.getVehicles().then((response) => {
            setVehicles(response);
        });
    }, []);
console.log(vehicleSelected)
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Vehículos registrados</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear un nuevo vehículo" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "40vw" }}>
                <div className="create-vehicle-form">
                    <Form
                        onSubmit={onSubmit}
                        initialValues={initialValues}
                        validate={validate}
                        render={({ handleSubmit }) => (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <div>
                                        <Field
                                            name="vehicleName"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span className="create-sale-form__span">
                                                        <label htmlFor="vehicleName" className={classNames({ "p-error": isFormFieldValid("vehicleName") })}>
                                                            Nombre del vehículo*
                                                        </label>
                                                        <InputText id="vehicleName" {...input} autoFocus placeholder="Nombre del vehículo" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="vehicleModel"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span className="create-sale-form__span">
                                                        <label htmlFor="vehicleModel" className={classNames({ "p-error": isFormFieldValid("vehicleModel") })}>
                                                            Modelo del vehículo*
                                                        </label>
                                                        <InputText id="vehicleModel" {...input} placeholder="Modelo del vehículo" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="selectedVehicleBrand"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span className="create-sale-form__span">
                                                        <label htmlFor="selectedVehicleBrand" className={classNames({ "p-error": isFormFieldValid("selectedVehicleBrand") })}>
                                                            Marca del vehículo*
                                                        </label>
                                                        <Dropdown id="selectedVehicleBrand" {...input} options={brands} optionLabel="name" placeholder="Marca del vehículo" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        {/* <InputText value={vehicleName} onChange={(e) => setVehicleName(e.target.value)} placeholder="Nombre del vehículo" className="create-vehicle-form__input" />
                                        <InputText value={vehicleModel} onChange={(e) => setVehicleModel(e.target.value)} placeholder="Modelo del vehículo" className="create-vehicle-form__input" />
                                        <Dropdown value={selectedVehicleBrand} options={brands} onChange={onVehicleBrandChange} optionLabel="name" placeholder="Marca del vehículo" className="create-vehicle-form__dropdown" /> */}
                                    </div>

                                    <div className="create-product-buttons">
                                        <Button type="submit" icon="pi pi-check" label="Crear vehículo" className="mr-2"></Button>
                                        <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                                    </div>
                                </form>
                            </>
                        )}
                    />
                </div>
            </Dialog>

            <Dialog header="Editar vehículo" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitEdit}
                    initialValues={initialValuesEdit}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                            <Field
                                            name="vehicleName"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span className="create-sale-form__span">
                                                        <label htmlFor="vehicleName" className={classNames({ "p-error": isFormFieldValid("vehicleName") })}>
                                                            Nombre del vehículo*
                                                        </label>
                                                        <InputText id="vehicleName" {...input} autoFocus placeholder="Nombre del vehículo" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="vehicleModel"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span className="create-sale-form__span">
                                                        <label htmlFor="vehicleModel" className={classNames({ "p-error": isFormFieldValid("vehicleModel") })}>
                                                            Modelo del vehículo*
                                                        </label>
                                                        <InputText id="vehicleModel" {...input} placeholder="Modelo del vehículo" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="selectedVehicleBrand"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span className="create-sale-form__span">
                                                        <label htmlFor="selectedVehicleBrand" className={classNames({ "p-error": isFormFieldValid("selectedVehicleBrand") })}>
                                                            Marca del vehículo*
                                                        </label>
                                                        <Dropdown id="selectedVehicleBrand" {...input} options={brands} optionLabel="name" optionValue="name" placeholder="Marca del vehículo" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <div className="create-product-buttons">
                                        <Button type="submit" icon="pi pi-check" label="Editar" className="mr-2"></Button>
                                        <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                                    </div>
                            </form>
                        </>
                    )}
                />
            </Dialog>
            <Dialog
                header={"¿Esta seguro que desea " + (vehicleSelected.status ? "desactivar" : "activar") + " el vehículo " + vehicleSelected.name + "?"}
                footer={renderFooterDialogChangeStatus()}
                visible={displayDialogStatus}
                onHide={() => setDisplayDialogStatus(false)}
                breakpoints={{ "960px": "75vw" }}
                style={{ width: "50vw" }}
            >
                <p>Los siguientes productos estan asociados a este vehículo, si desactiva el vehículo los productos asociados tambien se desactivaran</p>
                <TableProductsWhereVehicle className="table-products" products={productsWhereVehicle} />
            </Dialog>

            <TableVehicles className="table-products" vehicles={vehicles} setVehicleSelected={setVehicleSelected} />
        </div>
    );
}
