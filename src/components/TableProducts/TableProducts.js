import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./dataTableProduct.css";
import config from "../../config/config";
import { Dialog } from "primereact/dialog";
import { ProductService } from "../../service/ProductService";
import { ImageProductService } from "../../service/ImageProductService";

const _imageProductService = new ImageProductService();
const _productService = new ProductService();
export const TableProducts = ({ setProductSelected, products }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [TableProductSelected, setTableProductSelected] = useState([]);
    const [vehiclesInfo, setVehiclesInfo] = useState([]);
    const [productSelectedInfo, setProductSelectedInfo] = useState([]);
    const [vehicleInfoDialog, setVehicleInfoDialog] = useState(false);

    const [imagesData, setImagesData] = useState({})
    useEffect(() => {
        _imageProductService.getImages().then((images) => {
            let imagesDataAux = {}
            images.forEach((image) => {
                imagesDataAux[image.idProduct] = image.url;
            });
            setImagesData(imagesDataAux);

        });
    }, []);

    useEffect(() => {
        if (TableProductSelected) {
            setProductSelected(TableProductSelected);
        }
    }, [TableProductSelected, setProductSelected]);

    const statusBodyTemplate = (rowData) => {
        if (rowData.state === true) {
            return <span className="product-badge-state-active">ACTIVO</span>;
        } else if (rowData.state === false) {
            return <span className="product-badge-state-inactive">INACTIVO</span>;
        } else {
            return <span className="product-badge-state-na">NA</span>;
        }
    };
    const viewVehiclesDetail = (info) => {
        setProductSelectedInfo(info);
        _productService
            .getVehiclesOfProductById(info.id)
            .then((response) => {
                setVehiclesInfo(response);
                setVehicleInfoDialog(true);
            })
            .catch((e) => {
                console.error("Error al traer a info del cliente", e);
            });
    };

    const photoBodyTemplate = (rowData, info) => {
        let classBool;
        if (!rowData.id ) {
            return null
        }
        if (info) {
            classBool = false;
        } else {
            classBool = true;
        }
        let url = imagesData[rowData.id];
        
        return <img src={`${config.baseURL}${url}`} onError={(e) => (e.target.src =`${config.baseURL}/public/images/no-pictures.png`)} alt={rowData.id} className={!classBool ? "product-image" : "info-image info-image-not-photo"} />;
    };

    const actionBodyTemplateDetail = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => viewVehiclesDetail(rowData)} aria-label="Detail" />
            </React.Fragment>
        );
    };
    const vehiclesDialogFooter = (
        <div className="info-dialog__footer">
            {statusBodyTemplate(productSelectedInfo)}
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={() => setVehicleInfoDialog(false)} />
        </div>
    );
    return (
        <>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar vehiculo" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

            <Dialog visible={vehicleInfoDialog} style={{ width: "60vw" }} header={"Información completa del producto " + productSelectedInfo.id} modal className="p-fluid" footer={vehiclesDialogFooter} onHide={() => setVehicleInfoDialog(false)}>
                <div className="info-dialog__image-container">{photoBodyTemplate(productSelectedInfo, false)}</div>
                <hr></hr>
                <div className="info-dialog__body">
                    <h5 className="info-dialog__tittle">Información general del producto</h5>
                    <div className="info-dialog__body-data">
                        <div>
                            <h6>Referencia</h6>
                            <p>{productSelectedInfo.id}</p>
                        </div>
                        <div>
                            <h6>Nombre</h6>
                            <p>{productSelectedInfo.name}</p>
                        </div>
                        <div>
                            <h6>Categoría</h6>
                            <p>{productSelectedInfo.length > 0 ? productSelectedInfo.category.name : "hola"}</p>
                        </div>
                        <div>
                            <h6>Marca</h6>
                            {/* <p>{productSelectedInfo.brand.name}</p> */}
                            <p>hola</p>
                        </div>
                        <div>
                            <h6>Precio de venta</h6>
                            <p>{productSelectedInfo.price}</p>
                        </div>
                        <div>
                            <h6>Cantidad en stock</h6>
                            <p>{productSelectedInfo.amount}</p>
                        </div>
                    </div>
                </div>
                <hr></hr>
                <h6>Descripcion</h6>
                <p>{productSelectedInfo.description}</p>
                <hr></hr>

                <h6>Vehículos compatibles con este producto</h6>
                <DataTable header="Vehículos" stripedRows showGridlines value={vehiclesInfo} className="table-product" paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron vehículos compatibles" rows={10}>
                    <Column field="vehicles.id" header="Id"></Column>
                    <Column field="vehicles.name" header="Nombre"></Column>
                    <Column field="vehicles.model" header="Modelo"></Column>
                    <Column field="vehicles.brands_vehicles.name" sortable header="Marca"></Column>
                </DataTable>
            </Dialog>

            <DataTable
                header="Productos"
                stripedRows
                showGridlines
                value={products}
                className="table-product"
                paginator
                responsiveLayout="scroll"
                dataKey="id"
                emptyMessage="No se encontraron datos"
                rows={10}
                globalFilter={globalFilter}
                selection={TableProductSelected}
                onSelectionChange={(e) => setTableProductSelected(e.value)}
            >
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" frozen sortable header="Id"></Column>
                <Column body={photoBodyTemplate} header="Foto"></Column>
                <Column field="name" sortable header="Nombre"></Column>
                <Column field="category.name" sortable header="Categoria"></Column>
                <Column field="brand.name" sortable header="Marca producto"></Column>
                <Column field="amount" className="table-product--column-gray" sortable header="Cantidad en stock"></Column>
                <Column field="price" className="table-product--column-gray" sortable header="Precio"></Column>
                <Column field="state" body={statusBodyTemplate} header="Estado"></Column>
                <Column field="state" body={actionBodyTemplateDetail} header="Ampliar info"></Column>
            </DataTable>
        </>
    );
};
