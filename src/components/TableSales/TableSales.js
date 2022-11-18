import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { SaleService } from "../../service/SaleService";
import { ClientService } from "../../service/ClientService";

const _saleService = new SaleService();
const _clientService = new ClientService();

export const TableSales = ({ setSaleSelected, sales }) => {
    let emptySaleInfo = {
        id: null,
        idClient: null,
        saleDate: null,
        statusSale: "",
        statusPayment: "",
        totalPurchase: 0,
    };
    const [globalFilter, setGlobalFilter] = useState(null);
    const [saleInfoDialog, setSaleInfoDialog] = useState(false);
    const [saleClientInfoDialog, setSaleClientInfoDialog] = useState(false);
    const [TableSaleSelected, setTableSaleSelected] = useState([]);
    const [saleInfo, setSaleInfo] = useState(emptySaleInfo);
    const [clientInfo, setClientInfo] = useState({});
    const [productsDetailOfSale, setProductsDetailOfSale] = useState([]);

    useEffect(() => {
        if (TableSaleSelected) {
            setSaleSelected(TableSaleSelected);
        }
    }, [TableSaleSelected, setSaleSelected]);

    const getSaleDetail = (id) => {
        _saleService
            .getSaleDetailById(id)
            .then((response) => {
                setProductsDetailOfSale(response);
            })
            .catch((e) => {
                console.log("Falle desde la tabla", e);
            });
    };

    const hideDialog = () => {
        setSaleInfoDialog(false);
    };
    const hideDialogClientInfo = () => {
        setSaleClientInfoDialog(false);
    };

    const viewSaleDetail = (info) => {
        console.log(info);
        setSaleInfo({ ...info });
        setSaleInfoDialog(true);
    };

    const viewClientSaleDetail = (info) => {
        console.log(info);
        _clientService
            .getClient(info.idClient)
            .then((response) => {
                setClientInfo(response);
                setSaleClientInfoDialog(true);
            })
            .catch((e) => {
                console.error("Error al traer a info del cliente", e);
            });
    };

    useEffect(() => {
        if (saleInfo.id != null) {
            getSaleDetail(saleInfo.id);
        }
    }, [saleInfo]);

    const infoSaleDialogFooter = (
        <React.Fragment>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </React.Fragment>
    );

    const infoSaleClientDialogFooter = (
        <React.Fragment>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={hideDialogClientInfo} />
        </React.Fragment>
    );
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => viewSaleDetail(rowData)} aria-label="Detail" />
            </React.Fragment>
        );
    };
    const actionBodyTemplateClientDetail = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => viewClientSaleDetail(rowData)} aria-label="Detail" />
            </React.Fragment>
        );
    };

    return (
        <>
            <Dialog visible={saleInfoDialog} style={{ width: "60vw" }} header="Detalle de la venta" modal className="p-fluid" footer={infoSaleDialogFooter} onHide={hideDialog}>
                <Panel header="Informacion general de la venta" className="dialog-buy-panel" toggleable>
                    <div className="dialog-buy-panel-detail">
                        <div>
                            <strong>
                                <p>Id del cliente</p>
                            </strong>
                            <p>{saleInfo.idClient}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Fecha de creacion de la venta</p>
                            </strong>
                            <p>{saleInfo.saleDate}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Estado de la venta</p>
                            </strong>
                            <p>{saleInfo.statusSale}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Estado de pago</p>
                            </strong>
                            <p>{saleInfo.statusPayment}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Total Venta</p>
                            </strong>
                            <p>{saleInfo.totalPurchase}</p>
                        </div>
                    </div>
                </Panel>
                <Panel header="Informacion de los productos de la venta" className="dialog-buy-panel">
                    <div className="dialog-sale-panel-products">
                        {productsDetailOfSale.map((element) => (
                            <div className="dialog-buy-panel-products__detail" key={element.idProduct}>
                                <div className="dialog-sale-panel-products__detail-item">
                                    <strong>
                                        <p>Id producto</p>
                                    </strong>
                                    <p>{element.idProduct}</p>
                                </div>
                                <div className="dialog-sale-panel-products__detail-item">
                                    {" "}
                                    <strong>
                                        <p>Cantidad</p>
                                    </strong>
                                    <p>{element.amount}</p>
                                </div>
                                <div className="dialog-sale-panel-products__detail-item">
                                    <strong>
                                        <p>Precio de venta</p>
                                    </strong>

                                    <p>{element.price}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Panel>
            </Dialog>

            <Dialog visible={saleClientInfoDialog} style={{ width: "60vw" }} header={"Informacion general del cliente " + clientInfo.name} modal className="p-fluid" footer={infoSaleClientDialogFooter} onHide={hideDialogClientInfo}>
                {console.log(clientInfo)}
                <Panel header="Informacion general del cliente" className="dialog-buy-panel" toggleable>
                    <div className="dialog-buy-panel-detail">
                        <div>
                            <strong>
                                <p>Id del cliente</p>
                            </strong>
                            <p>{clientInfo.id}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Nombre</p>
                            </strong>
                            <p>{clientInfo.name}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Apellidos</p>
                            </strong>
                            <p>{clientInfo.lastname}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Tipo de documento</p>
                            </strong>
                            <p>{clientInfo.documentType}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Numero de documento</p>
                            </strong>
                            <p>{clientInfo.document}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Correo electronico</p>
                            </strong>
                            <p>{clientInfo.email}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Telefono</p>
                            </strong>
                            <p>{clientInfo.telephone}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Direccion de envio</p>
                            </strong>
                            <p>{clientInfo.address}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Barrio</p>
                            </strong>
                            <p>{clientInfo.neightboorhood}</p>
                        </div>
                    </div>
                </Panel>
                <Panel header="Informacion de envio" className="dialog-buy-panel" toggleable>
                    <div className="dialog-buy-panel-detail">
                        <div>
                            <strong>
                                <p>Direccion de envio</p>
                            </strong>
                            <p>{clientInfo.address}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Barrio</p>
                            </strong>
                            <p>{clientInfo.neightboorhood}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Ciudad</p>
                            </strong>
                            <p>{clientInfo.city}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Departamento</p>
                            </strong>
                            <p>{clientInfo.department}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Pais</p>
                            </strong>
                            <p>{clientInfo.country}</p>
                        </div>
                    </div>
                </Panel>
            </Dialog>

            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar venta" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

            <DataTable
                header="Ventas"
                stripedRows
                showGridlines
                value={sales}
                paginator
                responsiveLayout="scroll"
                dataKey="id"
                emptyMessage="No se encontraron ventas"
                className="table-product"
                rows={10}
                globalFilter={globalFilter}
                selection={TableSaleSelected}
                onSelectionChange={(e) => setTableSaleSelected(e.value)}
            >
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" frozen={true} sortable header="Id"></Column>
                <Column body={actionBodyTemplateClientDetail} header="Informacion del cliente"></Column>
                <Column field="saleDate" sortable header="Fecha de venta"></Column>
                <Column field="statusSale" className="" sortable header="Estado"></Column>
                <Column field="statusPayment" className="" header="Estado del pago"></Column>
                <Column field="totalPurchase" className="" header="Total venta"></Column>
                <Column field="statusPayment" className="" header="Estado de anulación"></Column>
                <Column field="statusPayment" className="" header="Tipo de venta"></Column>
                <Column header="Ver detalle de la venta" body={actionBodyTemplate} exportable={false}></Column>
            </DataTable>
        </>
    );
};
