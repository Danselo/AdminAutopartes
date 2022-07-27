import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createPurchase.css";
//import { TableCreatePurchase } from "../../components/TableBuys/TableCreatePurchase";
import { TableCreatePurchase } from "../../components/TableBuys/TableCreatePurchase";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";

export default function CreatePurchase() {
    const onUpload = () => {
        toast.current.show({ severity: "info", summary: "Success", detail: "File Uploaded" });
    };
    const accept = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Compra creado exitosamente", life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const confirm1 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear esta compra?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            accept,
            reject,
        });
    };

    const confirm2 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept,
            reject,
        });
    };

    const toast = useRef(null);
    const [proveedor, setProveedor] = useState("");
    const [nro_factura, SetNro_factura] = useState("");
    const [fecha_compra, setValue2] = useState("");
    const [total_compra, setTotal_compra] = useState("");
    const [total_iva, setValue4] = useState("");
    const [total_otros_impuestos, setValue5] = useState("");
    const [monto_total, setMonto_total] = useState("");

    const chooseOptions = { icon: "pi pi-fw pi-images", iconOnly: true, className: "custom-choose-btn p-button-rounded p-button-outlined" };
    const uploadOptions = { icon: "pi pi-fw pi-cloud-upload", iconOnly: true, className: "custom-upload-btn p-button-success p-button-rounded p-button-outlined" };
    const cancelOptions = { icon: "pi pi-fw pi-times", iconOnly: true, className: "custom-cancel-btn p-button-danger p-button-rounded p-button-outlined" };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Tooltip target=".custom-choose-btn" content="Elegir factura" position="bottom" />
            <Tooltip target=".custom-upload-btn" content="Subir" position="bottom" />
            <Tooltip target=".custom-cancel-btn" content="Borrar" position="bottom" />
            <Link to={"/pages/Sales/Sales"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-product-tittle">
                <h3>Crear una compra</h3>
            </div>

            <div className="create-product-form">
                <span className="p-float-label">
                    <InputText className="jjj" id="nit" value={proveedor} onChange={(e) => setProveedor(e.target.value)} />
                    <label htmlFor="id_client">Proveedor</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="contact_name" value={nro_factura} onChange={(e) => SetNro_factura(e.target.value)} />
                    <label htmlFor="first_name">Nro factura</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="telephone" value={fecha_compra} onChange={(e) => setValue4(e.target.value)} />
                    <label htmlFor="last_name">Fecha de compra</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="email" value={total_compra} onChange={(e) => setTotal_compra(e.target.value)} />
                    <label htmlFor="total_purchase">Total compra</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="addres" value={total_iva} onChange={(e) => setValue5(e.target.value)} />
                    <label htmlFor="total_vat">Total iva</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="company_name" value={total_otros_impuestos} onChange={(e) => setValue2(e.target.value)} />
                    <label htmlFor="total_other_taxes">Total otros impuestos</label>
                </span>
                <span className="p-float-label">
                    <InputText className="jjj" id="company_name" value={monto_total} onChange={(e) => setMonto_total(e.target.value)} />
                    <label htmlFor="total_amount">Monto total</label>
                </span>
            </div>
            <div className="form-venta">
                <FileUpload
                    name="demo[]"
                    url="https://primefaces.org/primereact/showcase/upload.php"
                    onUpload={onUpload}
                    multiple
                    accept="image/*"
                    maxFileSize={1000000}
                    emptyTemplate={<p className="m-0">Arrastra la factura y pon el archivo aca para subirlo.</p>}
                    chooseOptions={chooseOptions}
                    uploadOptions={uploadOptions}
                    cancelOptions={cancelOptions}
                />
                <Button label="Agregar producto" className="p-button-raised p-button-success" />
                <TableCreatePurchase />
            </div>

            <div className="create-product-buttons">
                <Button onClick={confirm1} icon="pi pi-check" label="Crear" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
