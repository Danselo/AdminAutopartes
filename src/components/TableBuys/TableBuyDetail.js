import React, { useState, useEffect, useRef } from "react";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../../service/ProductService";
import { Toast } from "primereact/toast";
import { Button } from "primereact/button";
import { Toolbar } from "primereact/toolbar";
import { InputNumber } from "primereact/inputnumber";
import { Dialog } from "primereact/dialog";
// import { Dropdown } from "primereact/dropdown";
import { ColumnGroup } from 'primereact/columngroup';
import { Row } from 'primereact/row';
import { BuyService } from "../../service/BuyService";
import { Form, Field } from "react-final-form";
import { OverlayPanel } from "primereact/overlaypanel";
import { classNames } from "primereact/utils";
import { InputText } from "primereact/inputtext";


// import "./DataTableDemo.css";

const _productService = new ProductService();
const _buyService = new BuyService();

export default function TableBuyDetail({idBuy, setAddedProductsAtBuy, setGlobalTotal ,Provider, buyDate }) {
    
    
    let emptyProduct = {
        TemporalId: null,
        idBuy: idBuy || null,
        idProduct: null,
        amount: 0,
        netPrice: 0,
        profitPercentage: 0,
    };
    const [AddedProducts, setAddedProducts] = useState([]);
    const [productDialog, setProductDialog] = useState(false);
    const [productDialogEdit, setProductDialogEdit] = useState(false);

    const [deleteProductDialog, setDeleteProductDialog] = useState(false);
    const [product, setProduct] = useState(emptyProduct);
    const [selectedProducts, setSelectedProducts] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [salePrice, setSalePrice] = useState(0);
    const [products, setProducts] = useState([]);
    const [totalBuy, setTotalBuy] = useState(0)
    const toast = useRef(null);
    const [buys, setBuys] = useState([]);
    const [buyRepeat, setBuyRepeat] = useState([]);
    const [globalFilter, setGlobalFilter] = useState(null);
    const op = useRef(null);


    const isMountedEdit = useRef(false);
    const isMounted = useRef(false);

    const formatCurrency = (value) => {
        return value.toLocaleString( {style: 'currency', currency: 'COP'});
    }
    useEffect(() => {
        _productService.getProducts().then(data => setProducts(data));
    }, []);


    useEffect(() => {

        setAddedProductsAtBuy(AddedProducts)

    }, [AddedProducts,setAddedProductsAtBuy ]);

    useEffect(() => {

        setGlobalTotal(totalBuy)

    }, [totalBuy, setGlobalTotal]);

    useEffect(() => {
        let profitPercentage = product.profitPercentage / 100;
        let priceWithProfitPercentage = product.netPrice*(1 + profitPercentage);
        setSalePrice(priceWithProfitPercentage)

    },[product]);
    //-----CALCULAR EL TOTAL -----------
    useEffect(() => {
        let total = 0;
        for(let product of AddedProducts) {
            total += product.netPrice * product.amount ;
        }
        setTotalBuy(total)
        return formatCurrency(total);

    },[AddedProducts]);

//----------LOAD BUYS FOR VALIDATION-------
useEffect(() => {
    _buyService.getBuys().then((response) => {
        setBuys(response);
    });
}, []);
//-------------------------------------------


    const totalQuantity = () => {
        let total = 0;
        for(let product of AddedProducts) {
            total += product.amount;
        }

        return formatCurrency(total);
    }
    //_----------------------------------------------------------------
    const openNew = () => {
        setProduct(emptyProduct);
        setSubmitted(false);
        setProductDialog(true);
    };
    

    const hideDialog = () => {
        setSubmitted(false);
        setProductDialog(false);
    };
    const hideDialogEdit = () => {
        setSubmitted(false);
        setProductDialogEdit(false);
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
            setProductDialogEdit(false);

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
        setProduct({ ...product });
        setProductDialogEdit(true);
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
//---for each buys---




useEffect(() => {
    buys.forEach((element) => { 
        if(idBuy === element.id){
            setBuyRepeat(element.id)
        }
    });
}, [idBuy, setBuyRepeat]);
//---------------
    const leftToolbarTemplate = () => {
        
        return (
            <React.Fragment>
                <Button label="Agregar producto" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} disabled={!idBuy || !Provider.id || !buyDate || idBuy <= 1 || idBuy === buyRepeat}  />
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
    const onProductSelected = (e) => {

         onInputChange(e, "idProduct");
    };  
    console.log(product);
    // const productDialogFooter = (
    //     <React.Fragment>
     
    //     </React.Fragment>
    // );
    const deleteProductDialogFooter = (
        <React.Fragment>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </React.Fragment>
    );
    let footerGroup = <ColumnGroup>
    <Row>
        <Column footer="Total compra:" colSpan={3}/>
        <Column footer={totalBuy} />
        <Column footer="Cantidad total de productos:" />
        <Column footer={totalQuantity} />

        
    </Row>
    </ColumnGroup>;
    console.log(AddedProducts);
        //----------------- Validation -------------------------
        const initialValues = {
            idProduct: product.idProduct,
            amount: product.amount,
            netPrice: product.netPrice,
            profitPercentage: product.profitPercentage,
        };
    
        const validate = (data) => {
    
        let errors = {};
            
            if(!data.idProduct){
                errors.idProduct = "Seleccione un producto";
            }
            if(!data.amount){
                errors.amount = "Digite una cantidad";
            }
            if(!data.netPrice){
                errors.netPrice = "Digite un precio neto";
            }
            if(!data.profitPercentage){
                errors.profitPercentage = "Digite un porcentaje valido";
            }
    
            return errors;
        };
        const onSubmit = () => {

            saveProduct();
            // setUserEmail(data.email);
            // setUserName(data.name);
            // setUserLastname(data.lastname);
            // setUserPassword(data.password);
            // setSelectedUserRole(data.idRol);
            // const userObject = {
            //     email : data.email,
            //     name : data.name,
            //     lastname: data.lastname,
            //     password : data.password,
            //     rol: data.idRol,
            // }
        };
        const initialValuesEdit = {
            idProduct: product.idProduct,
            amount: product.amount,
            netPrice: product.netPrice,
            profitPercentage: product.profitPercentage,
        };
    
        const validateEdit = (data) => {
    
        let errors = {};
            
            if(!data.idProduct){
                errors.idProduct = "Seleccione un producto";
            }
            if(!data.amount){
                errors.amount = "Digite una cantidad";
            }
            if(!data.netPrice){
                errors.netPrice = "Digite un precio neto";
            }
            if(!data.profitPercentage){
                errors.profitPercentage = "Digite un porcentaje valido";
            }
    
            return errors;
        };
        const onSubmitEdit = () => {
            saveProduct();
            // setUserEmail(data.email);
            // setUserName(data.name);
            // setUserLastname(data.lastname);
            // setUserPassword(data.password);
            // setSelectedUserRole(data.idRol);
            // const userObject = {
            //     email : data.email,
            //     name : data.name,
            //     lastname: data.lastname,
            //     password : data.password,
            //     rol: data.idRol,
            // }
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

        if (isMounted.current && product.idProduct && !isMountedEdit.current) {
            // op.current.hide();
            toast.current.show({ severity: "info", summary: "Producto seleccionado", detail: product.idProduct, life: 3000 });

        }
    }, [product.idProduct]);

    
    return (
        <div className="datatable-crud-demo">
            <Toast ref={toast} />

            <div className="card">
                <Toolbar className="mb-4" left={leftToolbarTemplate}></Toolbar>

                <DataTable 
                value={AddedProducts} 
                selection={selectedProducts} 
                 dataKey="id" 
                paginator 
                rows={10} 
                footerColumnGroup={footerGroup}
                header="Productos agregados a la compra" responsiveLayout="scroll">
                    <Column field="idBuy" header="id_compra" hidden></Column>
                    <Column field="idProduct" header="Referencia producto" sortable></Column>
                    <Column field="amount" header="Cantidad"></Column>
                    <Column field="netPrice"  header="Precio unitario neto"></Column>
                    <Column field="profitPercentage" header="% Ganancia"></Column>
                    <Column field="salePrice" header="Precio venta"></Column>
                    <Column body={actionBodyTemplate} exportable={false}></Column>
                    
                </DataTable>
            </div>

            <Dialog visible={productDialog} style={{ width: "450px" }} header="Producto" modal className="p-fluid"  onHide={hideDialog}>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                            <Field
                                    name="idProduct"
                                    render={({ input, meta }) => (
                                        <div>
                                            <div className="create-sale-tittle__button">
                                                <Button
                                                    type="button"
                                                    icon="pi pi-search"
                                                    label={product.idProduct ? product.idProduct : "Seleccione un producto"}
                                                    onClick={(e) => op.current.toggle(e)}
                                                    aria-haspopup
                                                    aria-controls="overlay_panel"
                                                    className="select-product-button"
                                                    tooltip="Seleccionar un producto"
                                                />
                                                {product.idProduct ? <small className="p-success">Producto seleccionado</small> : <small className="p-error">*Debe seleccionar un producto</small>}
                                            </div>

                                            <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: "700px" }} className="overlaypanel-demo">
                                                <div className="p-inputgroup create-brand__table">
                                                    <InputText placeholder="Buscar Producto" onInput={(e) => setGlobalFilter(e.target.value)} />
                                                    <Button icon="pi pi-search" className="p-button-primary" />
                                                </div>
                                                <DataTable id="idProduct" value={productosFiltrados} globalFilter={globalFilter} selectionMode="single" paginator rows={5} selection={product}  onSelectionChange={onProductSelected}  >
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
                                {/* <Field
                                name="idProduct"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="idProduct" className={classNames({ "p-error": isFormFieldValid("idProduct") })}>Referencia del producto</label>
                                            <Dropdown id="idProduct" {...input}  options={products.map((p=>p.id))} value={product.idProduct} placeholder="Referencia"  onChange={(e) => onInputChange(e, "idProduct")} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            /> */}
                            <Field
                                name="amount"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="amount" className={classNames({ "p-error": isFormFieldValid("amount") })}>Cantidad</label>
                                            <InputNumber id="amount" {...input} onChange={(e) => onInputNumberChange(e, "amount")} value={product.amount} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} required integeronly  />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="netPrice"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="netPrice" className={classNames({ "p-error": isFormFieldValid("netPrice") })}>Precio neto del producto</label>
                                            <InputNumber id="netPrice" {...input} onChange={(e) => onInputNumberChange(e, "netPrice")} value={product.netPrice} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} required mode="currency" currency="COP" locale="es"  />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                             <Field
                                name="profitPercentage"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="profitPercentage" className={classNames({ "p-error": isFormFieldValid("profitPercentage") })}>Porcentaje de ganancia</label>
                                            <InputNumber id="profitPercentage" {...input} value={product.profitPercentage} onValueChange={(e) => onInputNumberChange(e, "profitPercentage")} suffix="%"  className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                             <Field
                                name="salePrice"
                                render={({ meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="salePrice">Precio de venta</label>
                                            <InputNumber id="salePrice" value={salePrice}  mode="currency" disabled currency="COP" locale="es"  />

                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                        <div className="button-table-buy-detail">
                            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" type="button" onClick={() => hideDialog()}/>
                            <Button label="Guardar" icon="pi pi-check" className="p-button-text" type="submit"  />    
                        </div>
                    </form>

                )} />
               
            </Dialog>
            <Dialog visible={productDialogEdit} style={{ width: "450px" }} header="Producto" modal className="p-fluid"  onHide={hideDialogEdit}>
            <Form
                onSubmit={onSubmitEdit}
                initialValues={initialValuesEdit}
                validate={validateEdit}
                render={({ handleSubmit }) => (
                    <form onSubmit={handleSubmit}>
                            <Field
                                    name="idProduct"
                                    render={({ input, meta }) => (
                                        <div>
                                            <div className="create-sale-tittle__button">
                                                <Button
                                                    type="button"
                                                    icon="pi pi-search"
                                                    label={product.idProduct ? product.idProduct : "Seleccione un producto"}
                                                    onClick={(e) => op.current.toggle(e)}
                                                    aria-haspopup
                                                    aria-controls="overlay_panel"
                                                    className="select-product-button"
                                                    tooltip="Seleccionar un producto"
                                                />
                                                {product.idProduct ? <small className="p-success">Producto seleccionado</small> : <small className="p-error">*Debe seleccionar un producto</small>}
                                            </div>

                                            <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: "700px" }} className="overlaypanel-demo">
                                                <div className="p-inputgroup create-brand__table">
                                                    <InputText placeholder="Buscar Producto" onInput={(e) => setGlobalFilter(e.target.value)} />
                                                    <Button icon="pi pi-search" className="p-button-primary" />
                                                </div>
                                                <DataTable id="idProduct" value={productosFiltrados} globalFilter={globalFilter} selectionMode="single" paginator rows={5} selection={product}  onSelectionChange={onProductSelected}  >
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
                                {/* <Field
                                name="idProduct"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="idProduct" className={classNames({ "p-error": isFormFieldValid("idProduct") })}>Referencia del producto</label>
                                            <Dropdown id="idProduct" {...input}  options={products.map((p=>p.id))} value={product.idProduct} placeholder="Referencia"  onChange={(e) => onInputChange(e, "idProduct")} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            /> */}
                            <Field
                                name="amount"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="amount" className={classNames({ "p-error": isFormFieldValid("amount") })}>Cantidad</label>
                                            <InputNumber id="amount" {...input} onChange={(e) => onInputNumberChange(e, "amount")} value={product.amount} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} required integeronly  />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="netPrice"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="netPrice" className={classNames({ "p-error": isFormFieldValid("netPrice") })}>Precio neto del producto</label>
                                            <InputNumber id="netPrice" {...input} onChange={(e) => onInputNumberChange(e, "netPrice")} value={product.netPrice} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} required mode="currency" currency="COP" locale="es"  />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                             <Field
                                name="profitPercentage"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="profitPercentage" className={classNames({ "p-error": isFormFieldValid("profitPercentage") })}>Porcentaje de ganancia</label>
                                            <InputNumber id="profitPercentage" {...input} value={product.profitPercentage} onValueChange={(e) => onInputNumberChange(e, "profitPercentage")} suffix="%"  className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                             <Field
                                name="salePrice"
                                render={({ meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="salePrice"> Precio de venta</label>
                                            <InputNumber id="salePrice" value={salePrice}  mode="currency" disabled currency="COP" locale="es"  />

                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                        <div className="button-table-buy-detail">
                            <Button label="Cancelar" icon="pi pi-times" className="p-button-text" type="button" onClick={() => hideDialogEdit()}/>
                            <Button label="Guardar" icon="pi pi-check" className="p-button-text" type="submit" />    
                        </div>
                    </form>

                )} />
               
            </Dialog>
            <Dialog visible={deleteProductDialog} style={{ width: "450px" }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                <div className="confirmation-content">
                    <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: "2rem" }} />
                    {product && (
                        <span>
                            Seguro que quieres eliminar el producto agregado <b>{product.name}</b>?
                        </span>
                    )}
                </div>
            </Dialog>
        </div>
        
    );


}

