import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Dialog } from "primereact/dialog";
import { Panel } from "primereact/panel";
import "./tableBuy.css";
import { BuyService } from "../../service/BuyService";

const _buyService = new BuyService();

export const TableBuys = ({ setBuySelected, buys }) => {
    let emptyBuyInfo = {
        createdAt: null,
        datePurchase: null,
        id: null,
        idProvider: null,
        invoiceUrl: null,
        provider: {},
        status: true,
        totalPurchase: 0,
    };

    const [globalFilter, setGlobalFilter] = useState(null);
    const [buyInfoDialog, setBuyInfoDialog] = useState(false);
    const [TableBuysSelected, setTableBuysSelected] = useState([]);
    const [buyInfo, setBuyInfo] = useState(emptyBuyInfo);
    const [productsDetailOfBuy, setProductsDetailOfBuy] = useState([]);
    const [buysDetail, setBuyDetails] = useState([]);
    

    useEffect(() => {
        if (TableBuysSelected) {
            setBuySelected(TableBuysSelected);
        }
    }, [TableBuysSelected, setBuySelected]);

    const getBuyDetail = (id) => {
        _buyService
            .getBuyDetailById(id)
            .then((response) => {
                console.log(response);
                setProductsDetailOfBuy(response);
            })
            .catch((e) => {
                console.log("Falle desde la tabla", e);
            });
    };

    const hideDialog = () => {
        setBuyInfoDialog(false);
    };

    const viewBuyDetails = (info) => {
        console.log(info);
        setBuyInfo({ ...info });
        setBuyInfoDialog(true);
    };
    useEffect(() => {
        if (buyInfo.id != null) {
            getBuyDetail(buyInfo.id);
        }
    }, [buyInfo]);

    useEffect(() => {
        if (buyInfo.id != null) {
            getBuyDetail(buyInfo.id);
        }
    }, [buyInfo]);


    
    const infoBuyDialogFooter = (
        <React.Fragment>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </React.Fragment>
    );

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => viewBuyDetails(rowData)} aria-label="Detail" />
            </React.Fragment>
        );
    };

    console.log(buyInfo);
    return (
        <>
            <Dialog visible={buyInfoDialog} style={{ width: "60vw" }} header="Detalle de la compra" modal className="p-fluid" footer={infoBuyDialogFooter} onHide={hideDialog}>
                <Panel header="Informacion general de la compra" className="dialog-buy-panel" toggleable>
                    <div className="dialog-buy-panel-detail">
                        <div className = "">
                            <strong>
                                <p>Numero de factura</p>
                            </strong>
                            <p>{buyInfo.id}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Fecha de compra </p>
                            </strong>
                            <p>{buyInfo.datePurchase}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Fecha de creacion de la compra</p>
                            </strong>
                            <p>{buyInfo.createdAt}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Total de la compra</p>
                            </strong>
                            <p>{buyInfo.totalPurchase}</p>
                        </div>


                        <div>
                            <strong>
                                <p>Factura</p>
                            </strong>
                            <p>{buyInfo.invoiceUrl}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Estado de la compra</p>
                            </strong>
                            <p>{buyInfo.status}</p>
                        </div>
                    </div>
                </Panel>
                <Panel header="Informacion del proveedor" className="dialog-buy-panel" toggleable>
                    <div className="dialog-buy-panel-detail">
                        <div>
                            <strong>
                                <p>Nombre del proveedor</p>
                            </strong>
                            <p>{buyInfo.provider.companyName}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Nit del proveedor</p>
                            </strong>
                            <p>{buyInfo.provider.nit}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Nombre de contacto</p>
                            </strong>
                            <p>{buyInfo.provider.contactName}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Telefono de contacto</p>
                            </strong>
                            <p>{buyInfo.provider.telephone}</p>
                        </div>
                    </div>
                </Panel>
                <Panel header="Informacion de los productos de la compra" className="dialog-buy-panel">
                    <div className="dialog-buy-panel-products">
                        {productsDetailOfBuy.map((element) => (
                            <div className="dialog-buy-panel-products__detail" key="products_detail_panel">
                                <div className = "dialog-buy-panel-products__detail-item">
                                    <strong>
                                        <p>Id producto</p>
                                    </strong>
                                    <p>{element.idProduct}</p>

                                </div>
                                <div className = "dialog-buy-panel-products__detail-item"   >                                <strong><p>Cantidad</p></strong>
                                    
                                    <p>{element.amount}</p>
                                </div>
                                <div className = "dialog-buy-panel-products__detail-item">
                                    <strong>
                                        <p>Precio neto</p>
                                    </strong>

                                    <p>{element.netPrice}</p>
                                </div>
                  
            
                                <div className = "dialog-buy-panel-products__detail-item">
                                    <strong>
                                        {" "}
                                        <p>Porcentaje de ganancia</p>
                                    </strong>

                                    <p>{element.profitPercentage}</p>
                                </div>
                                <div className = "dialog-buy-panel-products__detail-item">
                                    <strong>
                                        <p>Precio de venta</p>
                                    </strong>

                                    <p>{element.salePrice}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </Panel>
            </Dialog>

            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar compra" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

            <DataTable
                header="Compras"
                stripedRows
                showGridlines
                value={buys}
                paginator
                responsiveLayout="scroll"
                dataKey="id"
                emptyMessage="No se encontraron compras"
                className="table-product"
                rows={10}
                globalFilter={globalFilter}
                selection={TableBuysSelected}
                onSelectionChange={(e) => setTableBuysSelected(e.value)}
            >
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>

                <Column field="id" className="" header="Num factura"></Column>
                <Column field="provider.companyName" header="Id proveedor"></Column>
                <Column field="datePurchase" sortable header="Fecha de compra"></Column>
                <Column field="totalPurchase" className="table-product--column-gray" header="Total compra"></Column>
                <Column field="invoiceUrl" className="" header="Factura"></Column>
                <Column header="Ver detalle de compra" body={actionBodyTemplate} exportable={false}></Column>
            </DataTable>
        </>
    );
};
