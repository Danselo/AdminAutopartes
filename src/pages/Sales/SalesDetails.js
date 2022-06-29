import React, { useRef } from "react";
import { TableClientInformation } from "../../components/TablesSaleDetails/TableClientInformation";
import { TableClientInformationShipping } from "../../components/TablesSaleDetails/TableClientInformationShipping";
import { TableSalesInformation } from "../../components/TablesSaleDetails/TableSalesInformation";
import { TableProductsInformation } from "../../components/TablesSaleDetails/TableProductsInformation";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import "./sales.css";

export default function SalesDetails() {
    const toast = useRef(null);
    const accept = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Venta finalizada exitosamente", life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };

    const accept_anular = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Venta anulada exitosamente", life: 3000 });
    };

    const reject_anular = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };

    const anular_venta = () => {
        confirmDialog({
            message: "¿Esta seguro que desea anular esta venta?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept: accept_anular,
            reject: reject_anular,
        });
    };

    const cambiar_estado = () => {
        confirmDialog({
            message: "¿Esta seguro que desea cambiar el estado de la venta?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptClassName: "p-button-danger",
            accept,
            reject,
        });
    };

    return (
        <>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/Sales"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div>
                <div className="tittle-product">
                    <h3>Detalles venta</h3>
                </div>

                <h4>Informacion general del pedido</h4>
                <TableSalesInformation className="table-products" />

                <h4>Informacion personal del cliente</h4>
                <TableClientInformation className="table-products" />

                <h4>Informacion de envio del cliente</h4>
                <TableClientInformationShipping className="table-products" />

                <h4>Productos</h4>
                <TableProductsInformation className="table-products" />

                <div className="create-product-buttons">
                    <Button onClick={anular_venta} icon="pi pi-times" label="Anular venta" className="p-button-danger"></Button>
                    <Button onClick={cambiar_estado} icon="pi pi-check" label="Cambiar estado" className="p-button-success"></Button>
                </div>
            </div>
        </>
    );
}
