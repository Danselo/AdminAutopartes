import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import "./sales.css";
import { Link } from "react-router-dom";
import { TableSales } from "../../components/TableSales/TableSales";
import { SaleService } from "../../service/SaleService";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";
import { Card } from "primereact/card";

const _saleService = new SaleService();

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [saleSelected, setSaleSelected] = useState({});
    const [displayDialogStatusSales, setDisplayDialogStatusSales] = useState(false);

    const leftContents = (
        <React.Fragment>
            <Link to={"/CreateSales"}>
                <Button label="Crear venta" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
        </React.Fragment>
    );

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

    return (
        <div>
            <div className="text-center">
                <h3>Gestión de ventas</h3>
            </div>
            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Seleccionar la funcuión a realizar" visible={displayDialogStatusSales} onHide={() => setDisplayDialogStatusSales(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }}>
                <div className="create-product-form">
                    <h5>Seleccione la función</h5>

                    <Card className="create-sale-form__card"title="Estado de la venta" subTitle="Cambiar estado de la venta">
                        <label>los estados de la venta son: Activo y terminado</label>
                        <Button
                            label={saleSelected.statusSale ? "Terminar" : "Activo"}
                            className={saleSelected.statusstatusSale ? "p-button-raised p-button-warning  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                            //  icon={providerSelected.companyName ?"pi pi-eye-slash" : "pi pi-eye"} onClick={() => editUserStatusAlert()} disabled={!providerSelected.companyName}
                            tooltip="Esta de la venta"
                        />
                    </Card>
                    <Card className="create-sale-form__card" title="Estado de pago" subTitle="Cambiar estado de pago de la venta">
                        <label> los estados de pago de la venta son pendiente y pagado</label>
                        <Button
                            label={saleSelected.status ? "pagado" : "Pendiente"}
                            className={saleSelected.status ? "p-button-raised p-button-warning  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                            //  icon={providerSelected.companyName ?"pi pi-eye-slash" : "pi pi-eye"} onClick={() => editUserStatusAlert()} disabled={!providerSelected.companyName}
                            tooltip="Esatdo de pago"
                        />
                    </Card>
                    <Card className="create-sale-form__card" title="Estado de anular venta" subTitle="Cambiar estado para anular la venta">
                    <label>los estados son activo y anular al estar una venta anulada no se puede cambiar</label>
                    <Button
                        label={saleSelected.status ? "Anular" : "Activa"}
                        className={saleSelected.status ? "p-button-raised p-button-warning  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                        //  icon={providerSelected.companyName ?"pi pi-eye-slash" : "pi pi-eye"} onClick={() => editUserStatusAlert()} disabled={!providerSelected.companyName}
                        tooltip="Anular venta"
                    />
                        
                    </Card>

                   
                </div>
            </Dialog>

            <TableSales sales={sales} setSaleSelected={setSaleSelected} className="table-products" />
        </div>
    );
}
