import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../../service/ProductService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Dropdown } from "primereact/dropdown";

// import "./DataTableDemo.css";

const _productService = new ProductService();

export default function TableBuyDetail({idBuy, shippingPrice, quantityProducts, discountsPercentage, ivaPercentage, setAddedProductsAtBuy }) {
    
    
    let emptyProduct = {
        TemporalId: null,
        idBuy: idBuy || null,
        idProduct: null,
        amount: 0,
        netPrice: 0,
        shippingPrice: shippingPrice/quantityProducts || 0,
        discountsPercentage: discountsPercentage || 0,
        ivaPercentage: ivaPercentage || 0,
        profitPercentage: 0,
    };

    const [AddedProducts, setAddedProducts] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [salePrice, setSalePrice] = useState(0);
    const [products, setProducts] = useState([]);

    const toast = useRef(null);

    useEffect(() => {
        _productService.getProducts().then(data => setProducts(data));
    }, []);

    useEffect(() => {

        setAddedProductsAtBuy(AddedProducts)

    }, [AddedProducts,setAddedProductsAtBuy ]);

    useEffect(() => {
        let priceWithDiscount = product.netPrice*(1 - (product.discountsPercentage/100));
        let priceWithIva = priceWithDiscount*( 1 + (product.ivaPercentage/100));
        let priceWithProfitPercentage = priceWithIva*(1 + product.profitPercentage);
        setSalePrice(priceWithProfitPercentage)

    },[product]);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = () => {
        setSubmitted(true);
        if (product.idProduct) {
            let _AddedProducts = [...AddedProducts];
            let _product = { ...product, salePrice };
            if (product.id) {

                const index = findIndexById(product.id);
                _AddedProducts[index] = _product;
                toast.current.show({ severity: "success", summary: "Todo salio bien!", detail: "Producto editado", life: 3000 });
            } else {
                _product.id = createId();
                _AddedProducts.push(_product);
                toast.current.show({ severity: "success", summary: "Todo salio bien!!", detail: "Producto agregado a la compra", life: 3000 });
            }

            setAddedProducts(_AddedProducts);
            setProductDialog(false);
            setProduct(emptyProduct);
        }
    };
    
    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }
    const editProduct = (product) => {
        console.log(product);
        setProduct({ ...product });
        setProductDialog(true);
    };

    const confirmDeleteProduct = (product) => {
        setProduct(product);
        setDeleteProductDialog(true);
    };

    const deleteProduct = () => {
        let _AddedProducts = AddedProducts.filter((val) => val.id !== product.id);
        setAddedProducts(_AddedProducts);
        setDeleteProductDialog(false);
        setProduct(emptyProduct);
        toast.current.show({ severity: "success", summary: "Successful", detail: "Product Deleted", life: 3000 });
    };

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < AddedProducts.length; i++) {
            if (AddedProducts[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    };

    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || "";
        let _product = { 
            ...product , 
            [name]:val
        };
        setProduct(_product);
    };

    const onInputNumberChange = (e, name) => {
        const val = e.value || 0;
        let _product = { 
            ...product , 
            [name]:val
        };
        setProduct(_product);
    };

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <Button label="Agregar producto" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
            </React.Fragment>
        );
    };

    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editProduct(rowData)} />
                <Button icon="pi pi-trash" className="p-button-rounded p-button-warning" onClick={() => confirmDeleteProduct(rowData)} />
            </React.Fragment>
        );
    };

    const productDialogFooter = (
        <React.Fragment>
            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Guardar" icon="pi pi-check" className="p-button-text" onClick={saveProduct} />
        </React.Fragment>
    );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );

    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable 
                value={AddedProducts} 
                selection={selectedProducts} 
                onSelectionChange={(e) => setSelectedProducts(e.value)} dataKey="id" 
                paginator 
                rows={10} 
                header="Productos agregados a la compra" responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>
                    <Column field="idBuy" header="id_compra" hidden></Column>
                    <Column field="idProduct" header="Referencia producto" sortable></Column>
                    <Column field="amount" header="Cantidad"></Column>
                    <Column field="netPrice" header="Precio unitario neto"></Column>
                    <Column field="shippingPrice" header="Precio envio"></Column>
                    <Column field="discountsPercentage" header="% Descuento"></Column>
                    <Column field="ivaPercentage" header="% IVA"></Column>
                    <Column field="profitPercentage" header="% Ganancia"></Column>
                    <Column field="salePrice" header="Precio venta"></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: "450px" }} header="Producto" modal className="p-fluid" footer={productDialogFooter} onHide={hideDialog}>
                <div className="field">
                    <label htmlFor="idProduct">Referencia del producto</label>
                    <Dropdown id="idProduct" value={product.idProduct} options={products.map((p=>p.id))} onChange={(e) => onInputChange(e, "idProduct")} placeholder="Referencia" className="create-buy-form__input" />
                </div>
                <div className="field">
                    <label htmlFor="amount">Cantidad</label>
                    <InputNumber id="amount" value={product.amount} onChange={(e) => onInputNumberChange(e, "amount")} required integeronly/>
                </div>

                <div className="field col">
                    <label htmlFor="netPrice">Precio neto del producto</label>
                    <InputNumber id="netPrice" value={product.netPrice} onValueChange={(e) => onInputNumberChange(e, "netPrice")} required mode="currency" currency="COP" locale="es" />
                </div>

                <div className="field col">
                    <label htmlFor="shippingPrice">Precio de envio</label>
                    <InputNumber id="shippingPrice" value={product.shippingPrice} onValueChange={(e) => onInputNumberChange(e, "shippingPrice")} disabled mode="currency" currency="COP" locale="es" />
                </div>
                <div className="field col">
                    <label htmlFor="discountsPercentage">Porcentaje de descuento</label>
                    <InputNumber id="discountsPercentage" value={product.discountsPercentage} disabled suffix="%"/>
                </div>
                <div className="field col">
                    <label htmlFor="ivaPercentage">Porcentaje de IVA</label>
                    <InputNumber id="ivaPercentage" value={product.ivaPercentage} disabled  suffix="%" />
                </div>
                <div className="field col">
                    <label htmlFor="profitPercentage">Porcentaje de ganancia</label>
                    <InputNumber id="profitPercentage" value={product.profitPercentage} onValueChange={(e) => onInputNumberChange(e, "profitPercentage")} suffix="%" />
                </div>

                <div className="field col">
                    <label htmlFor="salePrice">Precio de venta</label>
                    <InputNumber id="salePrice" value={salePrice} mode="currency" disabled currency="COP" locale="es" />
                </div>
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {product && (
                        <span>
                            Are you sure you want to delete <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
