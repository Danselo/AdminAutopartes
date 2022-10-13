import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { SaleService } from "../../service/SaleService";

const _saleService = new SaleService();

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
    const [TableSaleSelected, setTableSaleSelected] = useState([]);
    const [saleInfo, setSaleInfo] = useState(emptySaleInfo);
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
                console.log(response);
                setProductsDetailOfSale(response);
            })
            .catch((e) => {
                console.log("Falle desde la tabla", e);
            });
    };

    const hideDialog = () => {
        setSaleInfoDialog(false);
    };

    const viewSaleDetail = (info) => {
        console.log(info);
        setSaleInfo({ ...info });
        setSaleInfoDialog(true);
    };
    
    useEffect(() => {
        console.log(saleInfo.id)
        if (saleInfo.id != null) {
            getSaleDetail(saleInfo.id);
        }
    }, [saleInfo]);
    
    const infoSaleDialogFooter = (
        <React.Fragment>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </React.Fragment>
    );
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => viewSaleDetail(rowData)} aria-label="Detail" />
            </React.Fragment>
        );
    };
    
    return (
        <>
         <Dialog visible={saleInfoDialog} style={{ width: "60vw" }} header="Detalle de la compra" modal className="p-fluid" footer={infoSaleDialogFooter} onHide={hideDialog}>
                <Panel header="Informacion general de la compra" className="dialog-buy-panel" toggleable>
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
                            <div className="dialog-buy-panel-products__detail" key="products_detail_panel">
                                <div className = "dialog-sale-panel-products__detail-item">
                                    <strong>
                                        <p>Id producto</p>
                                    </strong>
                                    <p>{element.idProduct}</p>
                                </div>
                                <div className = "dialog-sale-panel-products__detail-item"   >                                <strong><p>Cantidad</p></strong>
                                    
                                    <p>{element.amount}</p>
                                </div>
                                <div className = "dialog-sale-panel-products__detail-item">
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
        emptyMessage="No se encontraron ventas" className="table-product" 
        rows={10}
        globalFilter={globalFilter}
        selection={TableSaleSelected}
        
        onSelectionChange={(e) => setTableSaleSelected(e.value)}
        >
            <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
            <Column field="id" frozen={true} sortable header="Id"></Column>
            <Column field="idClient"  header="Id cliente"></Column>
            <Column field="saleDate" sortable header="Fecha de venta"></Column>
            <Column field="statusSale" className="" sortable header="Estado"></Column>
            <Column field="statusPayment" className="" header="Estado del pago"></Column>
            <Column field="totalPurchase" className="" header="Total compra"></Column>
            <Column header="Ver detalle de la venta" body={actionBodyTemplate} exportable={false}></Column>
            
        </DataTable>
        </>
    )
    
}