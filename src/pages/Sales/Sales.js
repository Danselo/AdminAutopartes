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
    const [password, setPassword] = useState("");
    const validateStatusPayment = saleSelected.statusPayment;
    const validateStatusSale = saleSelected.statusSale;

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
    const cancelSale = () => {
        const token = localStorage.getItem("token");
        _saleService
            .cancelSale(token, password, saleSelected.id)
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
                toast.current.show({ severity: "error", summary: "Error", detail: "Ocurrio un error al anular la venta", life: 3000 });
            });
    };
    const rightContents = (
        <React.Fragment>
            <Button label="Cambiar estados" className="p-button-raised p-button-info dc-space-between" icon="pi pi-sync" onClick={() => setDisplayDialogStatusSales(true)} />
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

    return (
        <div>
            <Toast ref={toast} />
            <div className="text-center">
                <h3>Gestión de ventas</h3>
            </div>
            <Toolbar left={leftContents} right={rightContents} />
            <Dialog header="Anular venta" visible={cancelSaleDialog} onHide={() => setCancelSaleDialog(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "75vw" }}>
                <h5>Esta seguro que desea anular la venta?</h5>
                <p>Deja un motivo de anulacion</p>
                <InputTextarea value={cancelReason} onChange={(e) => setCancelReason(e.target.value)} rows={5} cols={30} />
                <Button
                    label="Anular"
                    onClick={() => {
                        setCancelSaleDialogPassword(true);
                        setCancelSaleDialog(false);
                    }}
                />

                <div className="create-product-form"></div>
            </Dialog>
            <Dialog header="Ingrese credenciales de administrador" visible={cancelSaleDialogPassword} onHide={() => setCancelSaleDialogPassword(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "75vw" }}>
                <h5>Pr favor ingrese la clave del administrador</h5>
                <p>Solo el administrador principal puede anular una compra</p>
                <Password value={password} onChange={(e) => setPassword(e.target.value)} toggleMask />
                <Button
                    label="Anular"
                    onClick={() => {
                        cancelSale();
                    }}
                />

                <div className="create-product-form"></div>
            </Dialog>
            <Dialog header="Seleccionar la funcuión a realizar" visible={displayDialogStatusSales} onHide={() => setDisplayDialogStatusSales(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "75vw" }}>
                <h5>Seleccione la función</h5>

                <div className="create-product-form">
                    <div className="status-sale-card">
                        <Card className="create-sale-form__card" title="Estado de la venta" subTitle="Cambiar estado de la venta" style={{ width: "20em", height: "18em", border: "0.1em solid darkblue" }}>
                            <div className="create-sale-form__card">
                                <p className="m-0" style={{ lineHeight: "1.5" }}>
                                    ¿Ya se pago la venta y entregaste los productos al cliente?
                                </p>
                                <Button
                                    label="Finalizar venta"
                                    className={saleSelected.statusSale ? "p-button-raised p-button-warning  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                                    icon={saleSelected.id ? "pi pi-eye-slash" : "pi pi-eye"}
                                    onClick={() => editStatusSaleAlert()}
                                    disabled={validateStatusPayment === "Pendiente" || validateStatusSale === "Terminado" || validateStatusSale === "Anulada"}
                                    // tooltip="Esta de la venta"
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="status-sale-card">
                        <Card className="create-sale-form__card" title="Estado de pago" subTitle="Cambiar estado de pago de la venta" style={{ width: "20em", height: "18em", border: "0.1em solid darkblue" }}>
                            <div className="create-sale-form__card">
                                <p className="m-0" style={{ lineHeight: "1.5" }}>
                                    ¿Ya se pago la venta?
                                </p>
                                <Button
                                    label="Pagado"
                                    className={"p-button-raised p-button-warning  dc-space-between"}
                                    onClick={() => {
                                        changeStatusPayment();
                                    }}
                                    disabled={validateStatusPayment === "Pagado"}
                                />
                            </div>
                        </Card>
                    </div>
                    <div className="status-sale-card">
                        <Card className="" title="Estado de anular venta" subTitle="Cambiar estado para anular la venta" style={{ width: "20em", height: "18em", border: "0.1em solid darkblue" }}>
                            <div className="create-sale-form__card">
                                <p className="m-0" style={{ lineHeight: "1.5" }}>
                                    Anular venta
                                </p>
                                <Button
                                    label="Anular venta"
                                    className={"p-button-success p-button-raised  dc-space-between"}
                                    onClick={() => {
                                        setCancelSaleDialog(true);
                                    }}
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
