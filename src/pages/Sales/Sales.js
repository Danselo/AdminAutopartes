import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import "./sales.css";
import { Link } from "react-router-dom";
import { TableSales } from "../../components/TableSales/TableSales";
import { SaleService } from "../../service/SaleService";
import { Dialog } from "primereact/dialog";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { Card } from "primereact/card";
import { InputTextarea } from "primereact/inputtextarea";
import { Password } from "primereact/password";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";
import { Tooltip } from "primereact/tooltip";
import { Badge } from "primereact/badge";

import { Toast } from "primereact/toast";

const _saleService = new SaleService();

export default function Sales() {
    const toast = useRef(null);
    const [sales, setSales] = useState([]);
    const [saleSelected, setSaleSelected] = useState({});
    const [displayDialogStatusSales, setDisplayDialogStatusSales] = useState(false);
    const [cancelSaleDialog, setCancelSaleDialog] = useState(false);
    const [cancelSaleDialogPassword, setCancelSaleDialogPassword] = useState(false);
    const [cancelReason, setCancelReason] = useState("");
    const [verifyCancelSaleAcces, setCancelAcces] = useState(null);
    const validateStatusPayment = saleSelected.statusPayment;
    const validateStatusSale = saleSelected.statusSale;
    const [productsDetailOfSale, setProductsDetailOfSale] = useState([]);
    console.log(verifyCancelSaleAcces);
    useEffect(() => {
        const token = localStorage.getItem("token");
        _saleService
            .verifyRol(token)
            .then((response) => {
                setCancelAcces(response);
            })
            .catch((error) => {
                console.error("Error al verificar el rol del usuario", error);
            });
    }, []);
    const leftContents = (
        <React.Fragment>
            <Link to={"/CreateSales"}>
                <Button label="Crear venta" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
        </React.Fragment>
    );

    const changeStatusPaymentSale = () => {
        _saleService
            .changeStatusPayment(saleSelected.id)
            .then((response) => {
                console.log(response);
                setDisplayDialogStatusSales(false);
                toast.current.show({ severity: "success", summary: "Cambio de pago exitoso", detail: "El cambio de pago de la venta se realizo de forma exitosa, ahora la venta esta pagada", life: 3000 });
                loadSales();
            })
            .catch((error) => {
                console.error("Ocurrio un error al cambiar el estado de pago de la venta", error);
                toast.current.show({ severity: "error", summary: "Error al cambiar el estado de la venta", detail: "Ocurrio un error al cambiar el estado de pago de la venta", life: 3000 });
            });
    };
    const changeStatusSale = () => {
        _saleService
            .changeStatusSale(saleSelected.id)
            .then((response) => {
                console.log(response);
                setDisplayDialogStatusSales(false);
                toast.current.show({ severity: "success", summary: "Estado de venta", detail: "El cambio de estado de la venta se realizo de forma exitosa, la venta ahora esta finalizada", life: 3000 });
                loadSales();
            })
            .catch((error) => {
                console.error("Ocurrio un error al cambiar el estado de la venta", error);
                toast.current.show({ severity: "error", summary: "Error al cambiar el estado de la venta", detail: "Ocurrio un error al cambiar el estado de la venta", life: 3000 });
            });
    };
    const cancelSale = (data) => {
        const token = localStorage.getItem("token");
        _saleService
            .cancelSale(token, data.password, saleSelected.id, cancelReason, productsDetailOfSale)
            .then((response) => {
                setDisplayDialogStatusSales(false);
                console.log(response);
                toast.current.show({ severity: "success", summary: "Venta anulada", detail: "La venta ha sido anulada exitosamente", life: 3000 });
                loadSales();
                setCancelSaleDialogPassword(false);
            })
            .catch((error) => {
                setDisplayDialogStatusSales(false);
                loadSales();
                setCancelSaleDialogPassword(false);
                console.error("Ocurrio un error al anular la venta", error);
                toast.current.show({ severity: "error", summary: "Error", detail: "Verifica tu contraseña", life: 3000 });
            });
    };
    console.log(productsDetailOfSale);
    const rightContents = (
        <React.Fragment>
            <Button label="Estados de la venta" className="p-button-raised p-button-info dc-space-between" icon="pi pi-sync" onClick={() => setDisplayDialogStatusSales(true)} disabled={!saleSelected.id || saleSelected === null} />
        </React.Fragment>
    );

    useEffect(() => {
        _saleService.getSales().then((response) => {
            setSales(response);
        });
    }, []);
    const editStatusSaleAlert = () => {
        confirmDialog({
            message: "¿Está seguro que desea finalizar la venta?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Finalizar",
            rejectLabel: "Cancelar",
            accept: () => changeStatusSale(),
            reject: () => setDisplayDialogStatusSales(true),
        });
    };
    const changeStatusPayment = () => {
        confirmDialog({
            message: "¿Está seguro que desea cambiar el estado de pago de la venta?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Cambiar estado a pagado",
            rejectLabel: "Cancelar",
            accept: () => changeStatusPaymentSale(),
            reject: () => setDisplayDialogStatusSales(true),
        });
    };
    const loadSales = () => {
        _saleService.getSales().then((response) => {
            setSales(response);
        });
    };
    const onSubmit = (data, form) => {
        setCancelSaleDialogPassword(true);
        setCancelSaleDialog(false);
        setCancelReason(data.cancelReason);
        getSaleDetail();
    };
    const onSubmitPassword = (data, form) => {
        cancelSale(data);
    };

    const initialValues = {
        cancelReason: "",
    };
    const initialValuesPassword = {
        password: "",
    };
    const validate = (data) => {
        let errors = {};

        if (!data.cancelReason) {
            errors.cancelReason = "Debe ingresar una razón válida por la cual desea anular la venta.";
        }
        return errors;
    };
    const validatePassword = (data) => {
        let errors = {};

        if (!data.password) {
            errors.password = "Debe ingresar una contraseña.";
        }
        return errors;
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    const getSaleDetail = () => {
        _saleService
            .getSaleDetailById(saleSelected.id)
            .then((response) => {
                setProductsDetailOfSale(response);
            })
            .catch((e) => {
                console.log("Falle desde la tabla", e);
            });
    };

    return (
        <div>
            <Toast ref={toast} />
            <div className="text-center">
                <h4>Gestión de ventas</h4>
            </div>
            <Toolbar left={leftContents} right={rightContents} />
            <Dialog header="Anular venta" visible={cancelSaleDialog} onHide={() => setCancelSaleDialog(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "45vw" }}>
                <h5>¿Está seguro que desea anular la venta?</h5>
                <p>
                    Deja un motivo por el cual estás anulando la venta, ten presente que una vez la venta sea anulada no podrás revertir la venta. También tenga en cuenta que al anular la venta, el stock de los productos asociados a la venta aumentaran con relación a la cantidad de los mismos en la
                    venta.
                </p>
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="">
                                    <Field
                                        name="cancelReason"
                                        render={({ input, meta }) => (
                                            <div className="field">
                                                <span className="create-sale-form__span">
                                                    <label htmlFor="cancelReason" className={classNames({ "p-error": isFormFieldValid("cancelReason") })}></label>
                                                    <InputTextarea id="cancelReason" {...input} autoFocus className={classNames({ "p-invalid": isFormFieldValid(meta), "cancel-sale-form__input": true })} placeholder="Razón por la cual se anula la venta" />
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="create-product-buttons">
                                    <Button label="Anular" type="submit" />
                                </div>
                            </form>
                        </>
                    )}
                />

                <div className="create-product-form"></div>
            </Dialog>
            <Dialog header="Una ultima cosa" visible={cancelSaleDialogPassword} onHide={() => setCancelSaleDialogPassword(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "45vw" }}>
                <p>Solo el administrador principal puede anular una venta, por favor ingresa la clave del administrador para verificar tu identidad.</p>
                <Form
                    onSubmit={onSubmitPassword}
                    initialValues={initialValuesPassword}
                    validate={validatePassword}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <div className="">
                                    <Field
                                        name="password"
                                        render={({ input, meta }) => (
                                            <div className="field">
                                                <span className="create-sale-form__span">
                                                    <label htmlFor="password" className={classNames({ "p-error": isFormFieldValid("password") })}>
                                                        Contraseña*
                                                    </label>
                                                    <Password id="password" feedback={false} toggleMask {...input} autoFocus className={classNames({ "p-invalid": isFormFieldValid(meta), "": true })} placeholder="Contraseña" />
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )}
                                    />
                                </div>

                                <div className="create-product-buttons">
                                    <Button label="Anular" type="submit" />
                                </div>
                            </form>
                        </>
                    )}
                />
                <div className="create-product-form"></div>
            </Dialog>
            <Dialog header="Estados de la venta" visible={displayDialogStatusSales} onHide={() => setDisplayDialogStatusSales(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "75vw" }}>
                <div className="create-product-form">
                    <div className="status-sale-card">
                        <Card className="create-sale-form__card" title="Estado de la venta" subTitle="Cambiar estado de la venta" style={{ width: "20em", height: "18em", border: "0.1em solid darkblue" }}>
                            <div className="create-sale-form__card">
                                <p className="m-0" style={{ lineHeight: "1.5" }}>
                                    ¿Ya se pagó la venta y entregaste los productos al cliente?
                                </p>
                                <Button
                                    label="Finalizar venta"
                                    className="p-button-success p-button-raised  dc-space-between"
                                    icon="pi pi-check-circle"
                                    onClick={() => editStatusSaleAlert()}
                                    disabled={validateStatusPayment === "Pendiente" || validateStatusSale === "Terminado" || validateStatusSale === "Anulada"}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="status-sale-card">
                        <Card className="create-sale-form__card" title="Estado de pago" subTitle="Cambiar estado de pago de la venta" style={{ width: "20em", height: "18em", border: "0.1em solid darkblue" }}>
                            <div className="create-sale-form__card">
                                <p className="m-0" style={{ lineHeight: "1.5" }}>
                                    ¿Ya se pagó la venta? Cambia el estado de pago
                                </p>
                                <Button
                                    label="Cambiar a pagado"
                                    className={"p-button-raised p-button-success dc-space-between"}
                                    onClick={() => {
                                        changeStatusPayment();
                                    }}
                                    disabled={validateStatusPayment === "Pagado"}
                                    icon="pi pi-dollar"
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="status-sale-card">
                        <Card className="" title="Anular venta" subTitle="Anular venta" style={{ width: "20em", height: "18em", border: "0.1em solid darkblue" }}>
                            <div className="create-sale-form__card">
                                <p className="m-0" style={{ lineHeight: "1.5" }}>
                                    Al dar clic en anular venta, el stock de los productos aumentará.
                                    <Tooltip target=".custom-target-icon" />
                                    <i
                                        className="custom-target-icon pi pi-question-circle p-overlay-badge"
                                        data-pr-tooltip="La venta ya esta anulada o no tienes permiso para anular la venta."
                                        data-pr-position="right"
                                        data-pr-at="right+5 top"
                                        data-pr-my="left center-2"
                                        style={{ fontSize: "1rem", cursor: "pointer" }}
                                    >
                                        <Badge severity="danger"></Badge>{" "}
                                    </i>
                                </p>
                                <Button
                                    label="Anular venta"
                                    className={"p-button-danger p-button-raised  dc-space-between"}
                                    onClick={() => {
                                        setCancelSaleDialog(true);
                                        setDisplayDialogStatusSales(false);
                                    }}
                                    icon="pi pi-ban"
                                    disabled={validateStatusSale === "Anulada" || !verifyCancelSaleAcces}
                                />
                            </div>
                        </Card>
                    </div>
                </div>
            </Dialog>

            <TableSales sales={sales} setSaleSelected={setSaleSelected} className="table-products" />
        </div>
    );
}
