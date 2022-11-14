import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createBuy.css";
import { Dropdown } from "primereact/dropdown";
import { Calendar } from "primereact/calendar";
import { InputNumber } from "primereact/inputnumber";
import { BuyService } from "../../service/BuyService";
import { ProviderService } from "../../service/ProvidersService";
import { ProductService } from "../../service/ProductService";
import TableBuyDetail from "../../components/TableBuys/TableBuyDetail";
import { useHistory } from "react-router-dom";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";

const _buyService = new BuyService();
const _providersService = new ProviderService();
const _productService = new ProductService();

export default function CreatePurchase() {
    const toast = useRef(null);

    const [providers, setProviders] = useState([]);
    const [buyProviderSelected, setSelectedProvider] = useState([]);
    const [buyId, setBuyId] = useState("");
    
  function handleChange(e) {
    setBuyId(e.target.value);
  }
    const [buyDatePurchase, setBuyDatePurchase] = useState("");
    const [buyTotalPurchase, setBuyTotalPurchase] = useState(0);
    // const [buyDiscountsPercentage, setBuyDiscountsPercentage] = useState(0);
    const [buyInvoiceUrl, setBuyinvoiceUrl] = useState("");
    const [addedProductsAtBuy, setAddedProductsAtBuy] = useState([]);
    const [globalTotal, setGlobalTotal] = useState(0);
    const [products, setProducts] = useState([]);
    const [buys, setBuys] = useState([]);
    if (addedProductsAtBuy) {
        
    }if (addedProductsAtBuy.length  > 1) {

        console.log(addedProductsAtBuy[0].discountsPercentage)
    }
    useEffect(() => {
        let cosamappeada = addedProductsAtBuy.map((p) => {
            let { TemporalId, ...loDemas } = p;
            return loDemas;
        });
        setProducts(cosamappeada);
    }, [addedProductsAtBuy]);


    useEffect(() => {
        _providersService
            .getProviders()
            .then((response) => {
                setProviders(response);
            })
            .catch((e) => {
                console.log(e, "Error al traer los provedores");
            });
    }, []);

        //---LOAD BUYS
        useEffect(() => {
            _buyService.getBuys().then((response) => {
                setBuys(response);
            });
        }, []);

    //Verifica si hay applicados descuentos previos y luuego aplica el iva, actualiza automaticamente el campo del formulario

    let history = useHistory();

    function handleClickRedirect() {
        toast.current.show({ severity: "success", summary: "Todo ha salido bien!", detail: "Compra creada exitosamente, seras redireccionado a la pantalla principal", life: 4000 });
        setTimeout(() => {
            history.push("/buys");
        }, 4000);
    }
    const createBuy = () => {
        var dateSelected = new Date(buyDatePurchase);
        var formatDate = dateSelected.toISOString().split("T")[0];
        _buyService
            .createBuy(buyId, buyProviderSelected.id, formatDate, globalTotal,buyInvoiceUrl)
            .then(() => {
                products.forEach((element) => {
                    _buyService
                        .addProductsToPurchase(element.idBuy, element.idProduct, element.amount, element.netPrice, element.profitPercentage, element.salePrice)
                        .then((response) => {
                            console.log("Response de agregar producto", response);
                            _productService.updateProductFromBuy(element.idProduct, element.amount, element.salePrice);
                        })
                        .catch((e) => {
                            toast.current.show({ severity: "warn", summary: "Error", detail: "No se pudieron agregar los productos a la compra", life: 3000 });
                        });
                });

                handleClickRedirect();
            })
            .catch(() => {
                toast.current.show({ severity: "warn", summary: "Error", detail: "Algo ha salido mal al crear la compra", life: 3000 });
            });
    };

    const accept = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const create = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear esta compra?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => createBuy(),
            reject,
        });
    };

    const cancelBuy = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "Cancelar compra",
            rejectLabel: "Volver",
            accept,
            reject,
        });
    };
    //----------------- Validation -------------------------
    const initialValues = {
        idBuy: buyId,
        providerId: buyProviderSelected.id,
        Data: buyDatePurchase,
        URL_factura: buyInvoiceUrl,
        buyTotalPurchase: buyTotalPurchase
    };

    const validate = (data) => {

        let errors = {};
        if(!data.providerId){
            errors.providerId = "el Proveedor es requerido";
        }
        if(!data.idBuy){
            errors.idBuy = "el numero de la factura es requerido";
        }else if (data.idBuy < 0){
            errors.idBuy = "el numero de la factura debe ser positivo";
        }else if (data.idBuy <=1){
            errors.idBuy = "el numero de la factura debe ser mayor que 1";
            
        }
        if (!data.buyTotalPurchase) {
            errors.buyTotalPurchase = "Este campo es requerido";
        }
        if(!data.Data){
            errors.Data = "este campo es requerido";
        }
        if (!data.URL_factura) {
            errors.URL_factura = "Este campo es requedio";
        }

        buys.forEach((element) => {
            const buyId = element.id;

            if (data.idBuy === buyId) {
                errors.idBuy = "El numero de factura existente";
            }
        });



        return errors;
    };
    const onSubmit = (data, form) => {
 
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
    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/Buys"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-buy-tittle">
                <h3>Crear una compra</h3>
            </div>
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                render={({ handleSubmit }) => (
                    <form>
                        <div className="create-buy-form">
                            <Field
                                name="providerId"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="providerId" className={classNames({ "p-error": isFormFieldValid("providerId") })}>Proveedor</label>
                                            <Dropdown id="providerId" {...input}  options={providers} value={buyProviderSelected} optionLabel="companyName" placeholder="Proveedor"  onChange={(e) => setSelectedProvider(e.value)} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="idBuy"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="idBuy" className={classNames({ "p-error": isFormFieldValid("idBuy") })}>Numero de factura</label>
                                            <InputText id="idBuy"   {...input}  placeholder="Numero de Factura"  value={buyId}  onChange={handleChange} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })}  />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="Data"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="Data" className={classNames({ "p-error": isFormFieldValid("Data") })}>
                                                Fecha de compra
                                            </label>
                                            <Calendar id="Data" {...input}  placeholder="AAAA-MM-DD" value={buyDatePurchase}  onChange={(e) => setBuyDatePurchase(e.value)} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="globalTotal"
                                render={({ input, meta }) => (
                                    <div className="globalTotal">
                                        <span>
                                            <label htmlFor="globalTotal" className={classNames({ "p-error": isFormFieldValid("globalTotal") })}>Total Compra</label>
                                            <InputNumber id="globalTotal" value={globalTotal}  placeholder="Total compra" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} mode="currency" currency="COP" locale="es" disabled />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="URL_factura"
                                render={({ input, meta }) => (
                                    <div className="URL_factura">
                                        <span>
                                            <label htmlFor="URL_factura" className={classNames({ "p-error": isFormFieldValid("URL_factura") })}>Url Factura</label>
                                            <InputText id="URL_factura" {...input} onChange={(e) => setBuyinvoiceUrl(e.target.value)} value={buyInvoiceUrl} placeholder="URL factura" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                        </div>      
                    </form>
                    
                )}
                
            />
                <TableBuyDetail   idBuy={buyId}  buyUrl={buyInvoiceUrl} Provider={buyProviderSelected} 
                setAddedProductsAtBuy={setAddedProductsAtBuy} setGlobalTotal = {setGlobalTotal} buyDate = {buyDatePurchase} />

                <div className="create-product-buttons">
                    <Button onClick={create} icon="pi pi-check" label="Crear compra" className="mr-2" disabled={addedProductsAtBuy.length<= 0} ></Button>
                    <Button onClick={cancelBuy} icon="pi pi-times" label="Cancelar"></Button>
                </div>

     
        </div>
    );
}
