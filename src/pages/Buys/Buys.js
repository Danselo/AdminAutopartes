import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import "./buys.css";
import { Link } from "react-router-dom";
import { TableBuys } from "../../components/TableBuys/TableBuys";
import { BuyService } from "../../service/BuyService";
import { UserService } from "../../service/UserService";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Form, Field } from "react-final-form";
import { InputTextarea } from "primereact/inputtextarea";
import { confirmDialog, ConfirmDialog } from "primereact/confirmdialog";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";
import { Tooltip } from "primereact/tooltip";
import { SaleService } from "../../service/SaleService";

const _buyService = new BuyService();
const _userService = new UserService();
const _saleService = new SaleService();

export default function Buys() {
    const toast = useRef(null);
    const [buys, setBuys] = useState([]);
    const [buySelected, setBuySelected] = useState({});
    const [displayDialogStatus, setDisplayDialogStatus] = useState(false);
    const [displayDialogStatusPassword, setDisplayDialogStatusPassword] = useState(false);
    const [userAdmin, setUserAdmin] = useState([]);
    const [visibleTrue, setVisibleTrue] = useState(false);
    const [visibleFalse, setVisibleFalse] = useState(false);
    const [productsDetailOfBuy, setProductsDetailOfBuy] = useState([]);
    const [reason, setReason] = useState("");
    const [verifyCancelSaleAcces, setVerifyCancelSaleAcces] = useState(null);

    const refreshPage2 = () => {
        setDisplayDialogStatus(false);
        setDisplayDialogStatusPassword(false);
        setBuySelected({});
        loadBuys();
    };
    const loadBuys = () => {
        _buyService.getBuys().then((response) => {
            setBuys(response);
        });
    };

    const refreshPage3 = () => {
        setDisplayDialogStatusPassword(true);
    };
    useEffect(() => {
        const token = localStorage.getItem("token");
        _saleService
            .verifyRol(token)
            .then((response) => {
                setVerifyCancelSaleAcces(response);
            })
            .catch((error) => {
                console.error("Error al verificar el rol del usuario", error);
            });
    }, []);

    useEffect(() => {
        _userService.getUser(1).then((response) => {
            setUserAdmin(response);
        });
    }, []);

    useEffect(() => {
        _buyService.getBuys().then((response) => {
            setBuys(response);
        });
    }, []);
    const rightContents = (
        <React.Fragment>
            <Tooltip target=".custom-target-icon" />
            <Button
                label={buySelected.status ? "Anular compra" : "Compra anulada"}
                className={buySelected.status ? "p-button-danger p-button-raised  dc-space-between" : "p-button-anulado p-button-raised  dc-space-between"}
                icon="pi pi-eye-slash"
                disabled={!buySelected.id || buySelected.status === false || !verifyCancelSaleAcces}
                onClick={() => {
                    onClickDialogStatus();
                    getBuyDetail();
                }}
            />
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

    const onHideDialogCancelStatus = () => {
        cancelCreate();
        setDisplayDialogStatus(false);
    };

    function cancelBuy() {
        if (buySelected.status === true) {
            buySelected.status = false;
            const token = localStorage.getItem("token");
            _buyService
                .cancelBuy(buySelected, reason, productsDetailOfBuy, token)
                .then(() => {
                    toast.current.show({ severity: "success", summary: "Anulado!", detail: "La compra se anulo exitosamente", life: 3000 });
                    refreshPage2();
                })
                .catch((e) => {
                    toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, no hay suficiente stock para anular la venta", life: 3000 });

                    setBuySelected({});
                    setDisplayDialogStatusPassword(false);
                });
        } else {
            toast.current.show({ severity: "error", summary: "Error", detail: "Ya se anulo lo compra", life: 3000 });
            setBuySelected({});
        }
    }

    const onHideDialogCancelPassword = () => {
        setVisibleFalse(false);
        setVisibleTrue(false);
        setBuySelected({});
    };
    const validateStatus = (data) => {
        let errors = {};

        if (!data.reason) {
            errors.reason = "Debe digitar una razón para anular una compra";
        }

        return errors;
    };

    const initialValuesStatus = {
        reason: buySelected.reason,
    };
    const onSubmitStatus = (data) => {
        setReason(data.reason);
        setDisplayDialogStatusPassword(true);
        setDisplayDialogStatus(false);
    };
    const validateStatusPassword = (data) => {
        let errors = {};

        if (!data.confirmPassword) {
            errors.confirmPassword = "Este campo es requerido";
        }

        return errors;
    };

    const initialValuesStatusPassword = {
        confirmPassword: " ",
    };

    const onSubmitStatusPassword = (data) => {
        _userService
            .getRealPassword(data.confirmPassword, userAdmin.password)
            .then((response) => {
                if (response.data) {
                    setDisplayDialogStatus(false);
                    setVisibleTrue(true);
                }
            })
            .catch((error) => {
                toast.current.show({ severity: "error", summary: "Denegado", detail: "La contraseña de administrador no es la correcta", life: 3000 });
                refreshPage2();
            });
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const onEditUserSelected = (e) => {
        const buyUpdated = {
            ...buySelected,
            [e.target.name]: e.target.value,
        };

        setBuySelected(buyUpdated);
    };
    const getBuyDetail = () => {
        _buyService
            .getBuyDetailById(buySelected.id)
            .then((response) => {
                setProductsDetailOfBuy(response);
            })
            .catch((e) => {
                console.log("Falle desde la tabla", e);
            });
    };
    return (
        <div>
            <Toast ref={toast} />

            <div className="text-center">
                <h4>Gestión de compras</h4>
            </div>
            <Toolbar left={leftContents} right={rightContents} />
            <Dialog header="Anular compra" visible={displayDialogStatus} onHide={() => onHideDialogStatusX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitStatus}
                    initialValues={initialValuesStatus}
                    validate={validateStatus}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="create-user-form">
                                <h5>Digite los datos para anular compra </h5>
                                <p className="">Debes tener en cuenta que para poder anular una compra es obligatorio digitar la razón por la cual deseas anular una compra, al anular la compra, el stock de los productos asociados disminuirá automáticamente</p>
                            </div>
                            <Field
                                name="reason"
                                render={({ input, meta }) => (
                                    <div className="reason">
                                        <span>
                                            <label htmlFor="reason" className={classNames({ "p-error": isFormFieldValid("reason") })}></label>
                                            <br />
                                            <InputTextarea id="reason" {...input} onChange={onEditUserSelected} placeholder="Digite su razón para anular la compra" className={classNames({ "p-invalid": isFormFieldValid(meta), inputBuysReason: true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" type="button" className="p-button-text" onClick={() => onHideDialogCancelStatus()} />
                                <Button label="Anular compra" icon="pi pi-check" autoFocus />
                            </div>
                        </form>
                    )}
                />
            </Dialog>
            <Dialog header="Un ultimo detalle" visible={displayDialogStatusPassword} onHide={() => onHideDialogStatusPasswordX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitStatusPassword}
                    initialValues={initialValuesStatusPassword}
                    validate={validateStatusPassword}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="">
                                <p>Solo el administrador puede anular una compra, por favor ingresa la contraseña de administrador para validar tu identidad. </p>
                            </div>
                            <Field
                                name="confirmPassword"
                                render={({ input, meta }) => (
                                    <div className="field passwordBuysStatus">
                                        <span>
                                            <label htmlFor="confirmPassword" className={classNames({ "p-error": isFormFieldValid("confirmPassword") })}>
                                                Confirmar contraseña
                                            </label>
                                            <br />
                                            <Password id="confirmPassword" {...input} placeholder="Confirmar contraseña" className={classNames({ "p-invalid": isFormFieldValid(meta) })} toggleMask feedback={false} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" type="button" className="p-button-text" onClick={() => onHideDialogStatusPasswordX()} />
                                <Button label="Anular compra" icon="pi pi-check" autoFocus />
                            </div>
                        </form>
                    )}
                />
            </Dialog>
            {/* Validacion para la contraseña al la hora de anular compra  */}
            <ConfirmDialog visible={visibleTrue} onHide={() => onHideDialogCancelPassword(true)} header="Acceso concedido" message="¿Desea anular la compra?" icon="pi pi-exclamation-triangle" acceptLabel="Anular" rejectLabel="Cancelar" accept={cancelBuy} reject={refreshPage2} />
            <ConfirmDialog visible={visibleFalse} onHide={() => onHideDialogCancelPassword(true)} message="La contraseña no coincide" header="Acceso denegado" icon="pi pi-exclamation-triangle" acceptLabel="Cerrar" rejectLabel="Volver" accept={refreshPage2} reject={refreshPage3} />
            <TableBuys buys={buys} setBuySelected={setBuySelected} className="table-products" />
        </div>
    );
}
