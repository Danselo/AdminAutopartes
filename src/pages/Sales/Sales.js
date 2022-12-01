import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import "./sales.css";
import { Link } from "react-router-dom";
import { TableSales } from "../../components/TableSales/TableSales";
import { SaleService } from "../../service/SaleService";
import { Dialog } from "primereact/dialog";
import { Toolbar } from "primereact/toolbar";



const _saleService = new SaleService();

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [saleSelected, setSaleSelected] = useState({});


    const leftContents = (
        <React.Fragment>
            <Link to={"/CreateSales"}>
                <Button label="Crear venta" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>
        </React.Fragment>
    );

    const rightContents = (
        <React.Fragment>
            <Button label="Cambiar estados" className="p-button-raised p-button-info dc-space-between" icon="pi pi-sync" />

            <Button label={saleSelected.statusSale ? "Terminar" : "Activo"}
                className={saleSelected.statusstatusSale ? "p-button-raised p-button-warning  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                //  icon={providerSelected.companyName ?"pi pi-eye-slash" : "pi pi-eye"} onClick={() => editUserStatusAlert()} disabled={!providerSelected.companyName}
                tooltip="Esta de la venta" />
            <Button label={saleSelected.status ? "pagado" : "Pendiente"}
                className={saleSelected.status ? "p-button-raised p-button-warning  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                //  icon={providerSelected.companyName ?"pi pi-eye-slash" : "pi pi-eye"} onClick={() => editUserStatusAlert()} disabled={!providerSelected.companyName}
                tooltip="Esatdo de pago" />
            <Button label={saleSelected.status ? "Anular" : "Activa"}
                className={saleSelected.status ? "p-button-raised p-button-warning  dc-space-between" : "p-button-success p-button-raised  dc-space-between"}
                //  icon={providerSelected.companyName ?"pi pi-eye-slash" : "pi pi-eye"} onClick={() => editUserStatusAlert()} disabled={!providerSelected.companyName}
                tooltip="Anular venta" />

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
                <h4>Gestión de ventas</h4>
            </div>
            <Toolbar left={leftContents} right={rightContents} />



            <TableSales sales={sales} setSaleSelected={setSaleSelected} className="table-products" />
        </div>
    );
}
