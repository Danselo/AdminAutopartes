import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import "./buys.css";
import { Link } from "react-router-dom";
import { TableBuys } from "../../components/TableBuys/TableBuys";
import { BuyService } from "../../service/BuyService";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Form, Field } from "react-final-form";
import { InputTextarea } from "primereact/inputtextarea";
import { confirmDialog } from "primereact/confirmdialog";
import { Password } from "primereact/password";

const _buyService = new BuyService();

export default function Buys() {
    const [buys, setBuys] = useState([]);
    const [buySelected, setBuySelected] = useState({});
    const [displayDialogStatus, setDisplayDialogStatus] = useState(false);
    const [displayDialogStatusPassword, setDisplayDialogStatusPassword] = useState(false);

    const refreshPage2 = ()=>{
        setDisplayDialogStatus(false)
        setBuySelected({});
        loadBuys();
      }
      const loadBuys = () => {
        _buyService.getBuys().then((response) => {
            setBuys(response);
        });
    };

    useEffect(() => {
        _buyService.getBuys().then((response) => {
            setBuys(response);
        });
    }, []);
    const rightContents = (
        <React.Fragment>
            <Button label={buySelected.status ? "Anular" : "Anulado"} className={ buySelected.status ? "p-button-danger p-button-raised  dc-space-between" : "p-button-anulado p-button-raised  dc-space-between" }  icon="pi pi-eye-slash"   disabled={!buySelected.id} onClick={() => onClickDialogStatus()} />
        </React.Fragment>
    );
    const leftContents = (
        <React.Fragment>
           <Link to={"/CreatePurchase"}>
                <Button label="Crear compra" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>           
        </React.Fragment>
    );
    function onClickDialogStatus() {
        setDisplayDialogStatus(true);
    }
    const onHideDialogStatusX = () => {
        setDisplayDialogStatus(false);
        refreshPage2();
    };
    const onHideDialogStatusPasswordX = () => {
        setDisplayDialogStatusPassword(false);
        refreshPage2();
    };
    const cancelCreate = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => refreshPage2(),
            reject: () => setDisplayDialogStatus(true),
        });
    };
    const cancelCreatePassword = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => refreshPage2(),
            reject: () => setDisplayDialogStatusPassword(true),
        });
    };
    const onHideDialogCancelStatus = () => {
        cancelCreate();
        setDisplayDialogStatus(false);
    };
    const onHideDialogCancelStatusPassword = () => {
        cancelCreatePassword();
        setDisplayDialogStatusPassword(false);

    };
     //----------------------Status VALIDATION --------------------
     const validateStatus = (data) => {
        let errors = {};

        if (!data.reason) {
            errors.reason = "Debe digitar una razón para anular una compra";
        }
        
        return errors;
    };

    const initialValuesStatus = {

        reason: "",
        // confirmPassword: "",
        
    };
    const onSubmitStatus = () => {
        setDisplayDialogStatusPassword(true);
        setDisplayDialogStatus(false)
    };
    const validateStatusPassword = (data) => {
        let errors = {};

        
        return errors;
    };

    const initialValuesStatusPassword = {

        confirmPassword: " ",
        // confirmPassword: "",
        
    };
    const onSubmitStatusPassword = () => {
        setDisplayDialogStatus();
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    
    // const confirmBuysStatus = () => {
    //     confirmDialog({
    //         message: `Esta seguro que quieres anular esta compra`,
    //         header: 'Confirmación',
    //         icon: 'pi pi-info-circle',
    //         acceptClassName: 'p-button-danger',
    //         accept,
    //         reject
    //     });
    // };
    console.log(buySelected);
    return (
        <div>
            <div className="text-center">
                <h3>Gestión de compras</h3>
            </div>
            <Toolbar left={leftContents} right={rightContents}/>
            <Dialog header="Anular compra" visible={displayDialogStatus} onHide={() => onHideDialogStatusX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitStatus}
                    initialValues={initialValuesStatus}
                    validate={validateStatus}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="create-user-form">
                                <h5>Digite los datos para anular compra </h5>
                                <p className="paragraph_buys_status_form">Debes tener en cuenta que para poder anular una compra es obligatorio  digitar la razón por la cual deseas anular una compra</p>
                            </div>
                            <Field
                                    name="reason"
                                    render={({ input, meta }) => (
                                        <div className="reason">
                                            <span>
                                                <label htmlFor="reason" className={classNames({ "p-error": isFormFieldValid("reason") })}></label>
                                                <br />
                                                <InputTextarea id="reason" {...input} placeholder="Digite su razón para anular la compra" className={classNames({ "p-invalid": isFormFieldValid(meta), inputBuysReason: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" type="button"  className="p-button-text" onClick={() => onHideDialogCancelStatus()} />
                                <Button label="Anular Compra" icon="pi pi-check" autoFocus />
                            </div>
                        </form>
                    )}
                />
            </Dialog>
            <Dialog header="Contraseña administrador" visible={displayDialogStatusPassword} onHide={() => onHideDialogStatusPasswordX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitStatusPassword}
                    initialValues={initialValuesStatusPassword}
                    validate={validateStatusPassword}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="create-user-form">
                                <h5>Digite la contraseña de administrador para continuar </h5>
                            </div>
                            <Field
                                    name="confirmPassword"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span>
                                                <label htmlFor="confirmPassword" className={classNames({ "p-error": isFormFieldValid("confirmPassword"), passwordBuysStatus: true })}>Confirmar Contraseña Administrador</label>
                                                <br />
                                                <Password id="confirmPassword" {...input} placeholder="Confirmar Contraseña" className={classNames({ "p-invalid": isFormFieldValid(meta), passwordBuysStatus: true })} feedback={false} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" type="button"  className="p-button-text" onClick={() => onHideDialogCancelStatusPassword()} />
                                <Button label="Anular Compra" icon="pi pi-check" autoFocus />
                            </div>
                        </form>
                    )}
                />
            </Dialog>
 
            <TableBuys buys={buys} setBuySelected={setBuySelected} className="table-products"  />
        </div>
    );
}
