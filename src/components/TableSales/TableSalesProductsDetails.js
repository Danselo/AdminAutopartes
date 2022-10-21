import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../../service/ProductService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
import { Form, Field } from "react-final-form";
import { OverlayPanel } from "primereact/overlaypanel";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";

const _productService = new ProductService();

export default function TableSalesProductsDetail({ setAddedProductsAtSale }) {
    let emptyProduct = {
        id: null,
        idProduct: null,
        amount: 0,
        price: 0,
    };

    const [AddedProducts, setAddedProducts] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [products, setProducts] = useState([]);
    const [saleProductSelected, setSaleProductSelected] = useState(null);
    const toast = useRef(null);
    const op = useRef(null);
    const isMounted = useRef(false);
    const isEdited = useRef(false);
    const [globalFilter, setGlobalFilter] = useState(null);
  

    useEffect(() => {
        isMounted.current = true;
        _productService
            .getProducts()
            .then((data) => setProducts(data))
            .catch((e) => {
                console.log("Error al traer los productos");
            });
    }, []);

    useEffect(() => {
        if (isMounted.current && saleProductSelected && !isEdited.current) {
            op.current.hide();
            toast.current.show({ severity: "info", summary: "Producto seleccionado", detail: saleProductSelected.name, life: 3000 });
        }
    }, [saleProductSelected]);

    useEffect(() => {
        setAddedProductsAtSale(AddedProducts);
    }, [AddedProducts, setAddedProductsAtSale]);

    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
        setSaleProductSelected(null);
    };

    const hideDeleteProductDialog = () => {
        setDeleteProductDialog(false);
    };

    const saveProduct = (form, product) => {
        
        setSubmitted(true);
        if (product.idProduct) {
            let _AddedProducts = [...AddedProducts];
            if (product.id) {
                const index = findIndexById(product.id);
                _AddedProducts[index] = product;
                toast.current.show({ severity: "success", summary: "Todo salio bien!", detail: "Producto editado", life: 3000 });
            } else {
                product.id = createId();
                _AddedProducts.push(product);
                toast.current.show({ severity: "success", summary: "Todo salio bien!!", detail: "Producto agregado a la venta", life: 3000 });
                setSaleProductSelected(null);
            }

            setAddedProducts(_AddedProducts);
            setProductDialog(false);
            setProduct(emptyProduct);
            form.restart();
        }
    };

    const createId = () => {
        let id = "";
        let chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    };
    const editProduct = (product) => {
        
        isEdited.current = true;
        products.forEach((productMap) => {
            if (productMap.id === product.idProduct) {
                return setSaleProductSelected(productMap);
            }
        });
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
        const val = e.value.id || "";
        const price = e.value.price || "";
        let _product = {
            ...product,
            [name]: val,
            price: price,
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

    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    const onSubmit = (data, form) => {
        if (saleProductSelected) {
            let val = data.amount.value || 0;

            let _product = {
                ...product,
                amount: val,
            };
            saveProduct(form, _product);
        }
    };

    const validate = (data) => {
        let errors = {};
        if (!data.amount) {
            errors.amount = "Debe ingresar al menos un producto";
        }

        if (saleProductSelected && data.amount.value > saleProductSelected.amount) {
            errors.amount = "Esta cantidad supera el stock disponible, " + saleProductSelected.amount + " producto(s) disponibles";
        }
        return errors;
    };

    const initialValues = {
        amount: "",
    };

    const onProductSelect = (e) => {
        onInputChange(e, "idProduct");
        setSaleProductSelected(e.value);
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    
    
    const filterProductsSelected = () => {
        if (AddedProducts.length > 0) {
            return products.filter(product => {
                return !AddedProducts.some(element => {
                  return product.id === element.idProduct;
                });
              });
        } else {
            return products
        }
    };
    const productosFiltrados = filterProductsSelected();
 
    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable value={AddedProducts} selection={selectedProducts} onSelectionChange={(e) => setSelectedProducts(e.value)} dataKey="id" paginator rows={10} header="Productos agregados a la compra" responsiveLayout="scroll">
                    <Column selectionMode="multiple" headerStyle={{ width: "3rem" }} exportable={false}></Column>
                    <Column field="idProduct" header="Referencia producto" sortable></Column>
                    <Column field="amount" header="Cantidad"></Column>
                    <Column field="price" header="Precio unitario neto"></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: "450px" }} header="Informacion del producto" modal className="p-fluid" onHide={hideDialog}>
                <Form
                    onSubmit={onSubmit}
                    initialValues={initialValues}
                    validate={validate}
                    render={({ handleSubmit }) => (
                        <>
                            <form onSubmit={handleSubmit}>
                                <Field
                                    name="statusPayment"
                                    render={({ input, meta }) => (
                                        <div>
                                            <div className="create-sale-tittle__button">
                                                <Button
                                                    type="button"
                                                    icon="pi pi-search"
                                                    label={saleProductSelected ? saleProductSelected.name : "Seleccione un producto"}
                                                    onClick={(e) => op.current.toggle(e)}
                                                    aria-haspopup
                                                    aria-controls="overlay_panel"
                                                    className="select-product-button"
                                                    tooltip="Seleccionar un producto"
                                                />
                                                {saleProductSelected ? <small className="p-success">Producto seleccionado</small> : <small className="p-error">*Debe seleccionar un producto</small>}
                                            </div>

                                            <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: "700px" }} className="overlaypanel-demo">
                                                <div className="p-inputgroup create-brand__table">
                                                    <InputText placeholder="Buscar cliente" onInput={(e) => setGlobalFilter(e.target.value)} />
                                                    <Button icon="pi pi-search" className="p-button-primary" />
                                                </div>
                                                <DataTable id="products" value={productosFiltrados} globalFilter={globalFilter} selectionMode="single" paginator rows={5} selection={saleProductSelected} onSelectionChange={onProductSelect}>
                                                    <Column field="id" sortable header="Referencia"></Column>
                                                    <Column field="name" sortable header="Nombre"></Column>
                                                    <Column field="brand.name" sortable header="Marca"></Column>
                                                    <Column field="amount" sortable header="Stock"></Column>
                                                    <Column field="price" sortable header="Precio"></Column>
                                                </DataTable>
                                            </OverlayPanel>
                                        </div>
                                    )}
                                />
                                <Field
                                    name="amount"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <label htmlFor="amount" className={classNames({ "p-error": isFormFieldValid("amount") })}>
                                                Cantidad
                                            </label>
                                            <InputNumber id="amount" {...input} autoFocus value={product.amount} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} placeholder="Cantidad de productos" required integeronly />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="price"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <label htmlFor="price">Precio del producto</label>
                                            <InputNumber
                                                id="price"
                                                {...input}
                                                value={saleProductSelected ? saleProductSelected.price : product.price}
                                                disabled
                                                required
                                                mode="currency"
                                                currency="COP"
                                                locale="es"
                                                className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })}
                                            />
                                        </div>
                                    )}
                                />
                                <React.Fragment>
                                    <Button label="Guardar" icon="pi pi-check" className="p-button-text" type="submit" />
                                    <Button label="Cancelar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
                                </React.Fragment>
                            </form>
                        </>
                    )}
                />
            </Dialog>

            <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {product && (
                        <span>
                            Seguro que deseas eliminar este producto? <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
    );
}
