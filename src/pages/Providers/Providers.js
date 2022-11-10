import React, { useState, useRef, useEffect } from "react";
import "./providers.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableProviders } from "../../components/TableProviders/TableProviders";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { ProviderService } from "../../service/ProvidersService";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";


const _providerService = new ProviderService();
export default function Providers() {
    const [providerSelected, setProviderSelected] = useState({});
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [providers, setProviders] = useState([]);
    const [providerStatus] = useState(true);


    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Eliminar" className="p-button-raised p-button-danger dc-space-between" icon="pi pi-trash" onClick={() => deleteProviderAlert()} disabled={!providerSelected.nit} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!providerSelected.nit} />
        </React.Fragment>
    );

    const rightContents = (
        // <React.Fragment>
        //     <Button label="Desactivar" className="p-button-raised p-button-warning dc-space-between" icon="pi pi-eye-slash" onClick={() => onClickDialogCreate()} />
        // </React.Fragment>
        <React.Fragment>
            <Button label={providerSelected.status ? "Desactivar" : "Activar"} className={ providerSelected.status ? "p-button-danger p-button-raised  dc-space-between" : "p-button-success p-button-raised  dc-space-between" }  icon="pi pi-eye-slash" onClick={() => editUserStatusAlert()}  disabled={!providerSelected.companyName} />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createProviderAlert = (form, data) => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta provedor?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateProvider(form, data),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editProviderAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta provedor?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditProvider(),
            reject: () => setDisplayDialogEdit(false),
        });
    };
    const editUserStatusAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea cambiar el estado del proveedor?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Cambiar estado",
            rejectLabel: "Cancelar",
            accept: () => EditStatus(),
            reject: () => setDisplayDialogEdit(false),
        });
    };
    const deleteProviderAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea eliminar esta Categoria?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Eliminar",
            rejectLabel: "Cancelar",
            accept: () => deleteProvider(providerSelected),
            reject,
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

    const cancelEdit = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No editar",
            rejectLabel: "Cancelar",
            accept: () => reject(),
            reject: () => setDisplayDialogEdit(true),
        });
    };
    function onClickDialogCreate() {
        setDisplayDialogCreate(true);
    }

    function onClickDialogEdit() {
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = () => {
        editProviderAlert();
        setDisplayDialogEdit(false);
    };

    const onHideDialogCreate = (form, data) => {
        createProviderAlert(form, data);
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

    const onHideDialogCancelEdit = () => {
        cancelEdit();
        setDisplayDialogEdit(false);
    };

    function EditProvider() {
        _providerService
            .updateProvider(providerSelected)
            .then(() => {
                setProviderSelected({});
                loadProviders();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "proveedor editado exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal al editar el proveedor", life: 3000 });
                console.log(e);
            });
    }
    function EditStatus() {
        if (providerSelected.status === true){
            providerSelected.status = false;
        }else if(providerSelected.status === false){
            providerSelected.status = true;
        }

    console.log(providerSelected);
    _providerService
        .updateProvider(providerSelected)
        .then(() => {
            setProviderSelected({});
            loadProviders();
            toast.current.show({ severity: "success", summary: "Confirmacion", detail: "El estado del proveedor se cambio exitosamente", life: 3000 });
        })
        .catch((e) => {
            toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
            console.log(e);
        });
}

    function CreateProvider(form, data) {
        _providerService
            .createProvider(data.nit, data.companyName, data.contactName, data.telephone, data.adress, data.email, data.country, providerStatus)
            .then(() => {
                loadProviders();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Proveedor creado exitosamente", life: 3000 });
                form.restart();
                
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, al crear el proveedor", life: 3000 });
                console.log(e);
            });
    }

    function deleteProvider(provider) {
        _providerService
            .deleteProvider(provider.id)
            .then(() => {
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Proveedor eliminado exitosamente", life: 3000 });
                loadProviders();
                setProviderSelected({});

            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    const loadProviders = () => {
        _providerService.getProviders().then((response) => {
            setProviders(response);
        });
    };

    const onChangeProviderSelectedEditForm = (eventOnChange) => {

        const providerUpdated = {
            ...providerSelected,
            [eventOnChange.target.name]: eventOnChange.target.value
        }

        setProviderSelected(providerUpdated)
    }
    useEffect(() => {
        _providerService.getProviders().then((response) => {
            setProviders(response);
        });
    }, []);

    const initialValues = {
        id: null,
        nit: "",
        companyName: "",
        contactName: "",
        telephone: "",
        adress: "",
        email: "",
        country: "",
    };

    const validate = (data) => {
        let errors = {};

        if (!data.nit) {
            errors.nit = "Debe ingresar un nit de proveedor.";
        }
        if (!data.companyName) {
            errors.companyName = "El nombre de la empresa es requerido";
        }

        if (!data.contactName) {
            errors.contactName = "El nombre de contacto es requerido";
        }
        if (!data.telephone) {
            errors.telephone = "El teléfono es requerido";
        }
        if (!data.adress) {
            errors.adress = "Debe digitar una dirección";
        }

        if (!data.email) {
            errors.email = "El email es requerdo";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = "Email invalido. E.g. example@email.com";
        } else
            providers.forEach((element) => {
                const providerMail = element.email;

                if (data.email === providerMail) {
                    errors.email = "El correo ya existe";
                }
            });



        if (!data.country) {
            errors.country = "Debe digitar un país";
        }

        return errors;
    };
    const onSubmit = (data, form) => {
        console.log(data);
        onHideDialogCreate(form, data);
    };
    const validateEdit = (data) => {
        let errors = {};

        if (!data.nit) {
            errors.nit = "Debe ingresar un nit de proveedor.";
        }
        if (!data.companyName) {
            errors.companyName = "El nombre de la empresa es requerido";
        }

        if (!data.contactName) {
            errors.contactName = "El nombre de contacto es requerido";
        }
        if (!data.telephone) {
            errors.telephone = "El teléfono es requerido";
        }
        if (!data.adress) {
            errors.adress = "Debe digitar una dirección";
        }

        if (!data.email) {
            errors.email = "El email es requerdo";
        } else if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i.test(data.email)) {
            errors.email = "Email invalido. E.g. example@email.com";
        } 
        // else
        //     providers.forEach((element) => {
        //         const providerMail = element.email;

        //         if (data.email === providerMail) {
        //             errors.email = "El correo ya existe";
        //         }
        //     });



        if (!data.country) {
            errors.country = "Debe digitar un país";
        }

        return errors;
    };
    const initialValuesEdit = {
        id: providerSelected.id,
        nit: providerSelected.nit,
        companyName: providerSelected.companyName,
        contactName: providerSelected.contactName,
        telephone: providerSelected.telephone,
        adress: providerSelected.adress,
        email: providerSelected.email,
        country: providerSelected.country,
    };
    const onSubmitEdit = () => {
        console.log(providerSelected);
        onHideDialogEdit();
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Proveedores registrados</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear un nuevo proveedor" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "55vw" }}>

                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="text-center">
                            <h5>Ingrese los datos del nuevo provedor</h5>
                            </div>
                            <div className="create-provider-form">
                            
                            <Field
                                name="nit"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="nit" className={classNames({ "p-error": isFormFieldValid("nit") })}>
                                               Nit o indicador*
                                            </label>
                                            <InputText id="nit" {...input} placeholder="Nit o indicador del provedor" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-provider-form__input": true })} tooltip="Si es proveedor internacinal, por favor ingrese un indentificador para este proveedor" />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="companyName"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="companyName" className={classNames({ "p-error": isFormFieldValid("companyName") })}>Nombre de la empresa*</label>
                                            <InputText id="companyName" {...input} placeholder="Nombre de la empresa" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-provider-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="contactName"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="contactName" className={classNames({ "p-error": isFormFieldValid("contactName") })}>Persona de contacto*</label>
                                            <InputText id="contactName" {...input} placeholder="Persona de contacto" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-provider-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="telephone"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="telephone" className={classNames({ "p-error": isFormFieldValid("telephone") })}>Telefono de contacto*</label>
                                            <InputText id="telephone" {...input} placeholder="Telefono de contacto" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-provider-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="adress"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="adress" className={classNames({ "p-error": isFormFieldValid("adress") })}>Dirección de la emptresa*</label>
                                            <InputText id="adress" {...input} placeholder="Direccion de la empresa" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-provider-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="email"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="email" className={classNames({ "p-error": isFormFieldValid("email") })}>Email contacto*</label>
                                            <InputText id="email" {...input} placeholder="Email contacto" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-provider-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="country"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="country" className={classNames({ "p-error": isFormFieldValid("country") })}>País de origen proveedor*</label>
                                            <InputText id="country" {...input} placeholder="Pais origen proveedor" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-provider-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                        </div>
                            <div className="create-provider-form__button">
                                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                                <Button label="Crear provedor" icon="pi pi-check" />
                            </div>

                        </form>
                    )}
                />
            </Dialog>
            <Dialog header="Editar provedor" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
            <Form
                    onSubmit={onSubmitEdit}
                    initialValues={initialValuesEdit}
                    validate={validateEdit}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                <div className="create-provider-form">
                    <h5>Ingrese los datos del nuevo proveedor</h5>
                    <Field
                                name="nit"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="nit" className={classNames({ "p-error": isFormFieldValid("nit") })}>Nit o indicador* </label>
                                            <InputText id="nit" {...input} onChange={onChangeProviderSelectedEditForm} placeholder="Nit o indicador del provedor" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="companyName"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="companyName" className={classNames({ "p-error": isFormFieldValid("companyName") })}>Nombre de la empresa*</label>
                                            <InputText id="companyName" {...input} onChange={onChangeProviderSelectedEditForm} placeholder="Nombre de la empresa" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="contactName"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="contactName" className={classNames({ "p-error": isFormFieldValid("contactName") })}>Persona de contacto*</label>
                                            <InputText id="contactName" {...input} onChange={onChangeProviderSelectedEditForm} placeholder="Persona de contacto" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="telephone"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="telephone" className={classNames({ "p-error": isFormFieldValid("telephone") })}>Telefono de contacto*</label>
                                            <InputText id="telephone" {...input} onChange={onChangeProviderSelectedEditForm} placeholder="Telefono de contacto" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="adress"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="adress" className={classNames({ "p-error": isFormFieldValid("adress") })}>Direccion de la empresa*</label>
                                            <InputText id="adress" {...input} onChange={onChangeProviderSelectedEditForm} placeholder="Direccion de la empresa" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="email"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="email" className={classNames({ "p-error": isFormFieldValid("email") })}>Email contacto*</label>
                                            <InputText id="email" {...input} onChange={onChangeProviderSelectedEditForm} placeholder="Email contacto" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="country"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span className="create-sale-form__span">
                                            <label htmlFor="country" className={classNames({ "p-error": isFormFieldValid("country") })}>Pais origen proveedor*</label>
                                            <InputText id="country" {...input} onChange={onChangeProviderSelectedEditForm} placeholder="Pais origen proveedor" className={classNames({ "p-invalid": isFormFieldValid(meta), inputUsers: true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                </div>
                <div>
                    {/*<Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />*/}
                    <Button type="submit" label="Editar proveedor" icon="pi pi-check" />
                </div>
                </form>
                    )}
                />
            </Dialog>

            <TableProviders className="table-products" providers={providers} setProviderSelected={setProviderSelected} />
        </div>
    );
}