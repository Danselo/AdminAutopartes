import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createPurchase.css";
import { TableCreatePurchase } from "../../components/TableBuys/TableCreatePurchase";
import { FileUpload } from "primereact/fileupload";
import { Tooltip } from "primereact/tooltip";

export default function CreatePurchase() {
    const toast = useRef(null);
    const [buyProviderId, setBuyProviderId] = useState("");
    const [buyDatePurchase, setBuyDatePurchase] = useState("");
    const [buyInvoiceNumber, setBuyInvoiceNumber] = useState("");
    const [buyTotalPurchase, setBuyTotalPurchase] = useState("");
    const [buyShippingPrice, setBuyShippingPrice] = useState("");
    const [buyIvaPercentage, setBuyIvaPercentage] = useState("");
    const [buyTotalIva, setBuyTotalIva] = useState("");
    const [buyOtherTaxesPercentage, setBuyOtherTaxesPercentage] = useState("");
    const [buyTotalOtherTaxes, setBuyTotalOtherTaxes] = useState("");
    const [buyDiscountsPercentage, setBuyDiscountsPercentage] = useState("");
    const [buyTotalDiscounts, setBuyTotalDiscounts] = useState("");
    const [buyInvoiceUrl, setBuyinvoiceUrl] = useState("");

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
                
                    <InputText value={buyProviderId} onChange={(e) => setBuyProviderId(e.target.value)} placeholder="Proveedor" className="create-product-form__input" />
                    
                    <InputText value={buyDatePurchase} onChange={(e) => setBuyDatePurchase(e.target.value)} placeholder="Fecha de compra" className="jjj" id="" />             
                    
                    <InputText value={buyInvoiceNumber} onChange={(e) => setBuyInvoiceNumber(e.target.value)} placeholder="Numero de factura" className="jjj" id="" />
                    
                    <InputText  value={buyTotalPurchase} onChange={(e) => setBuyTotalPurchase(e.target.value)} placeholder="Total compra" className="jjj" id=""/>
         
                    <InputText  value={buyShippingPrice} onChange={(e) => setBuyShippingPrice(e.target.value)} placeholder="Valor de envio" className="jjj" id=""/>
                                  
                    <InputText  value={buyIvaPercentage} onChange={(e) => setBuyIvaPercentage(e.target.value)} placeholder="Porcentaje de IVA" className="jjj" id=""/>
                      
                    <InputText value={buyTotalIva} onChange={(e) => setBuyTotalIva(e.target.value)}
                    placeholder="Total IVA compra" className="jjj" id="" />
                        
                    <InputText  value={buyOtherTaxesPercentage} onChange={(e) => setBuyOtherTaxesPercentage(e.target.value)} placeholder="Porcentaje otros impuestos" className="jjj" id=""/>

                    <InputText  value={buyTotalOtherTaxes} onChange={(e) => setBuyTotalOtherTaxes(e.target.value)} placeholder="Total otros impuestos" className="jjj" id=""/>
                    
                    <InputText  value={buyDiscountsPercentage} onChange={(e) => setBuyDiscountsPercentage(e.target.value)} placeholder="Porcentaje descuento compra" className="jjj" id=""/>

                    <InputText  value={buyTotalDiscounts} onChange={(e) => setBuyTotalDiscounts(e.target.value)} placeholder="Total descuento" className="jjj" id=""/>

                    <InputText  value={buyInvoiceUrl} onChange={(e) => setBuyinvoiceUrl(e.target.value)} placeholder="URL factura" className="jjj" id=""/>
                    
                
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
