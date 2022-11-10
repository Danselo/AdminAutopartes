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
    const [buyDatePurchase, setBuyDatePurchase] = useState("");
    const [buyTotalPurchase, setBuyTotalPurchase] = useState(0);
    const [buyShippingPrice, setBuyShippingPrice] = useState(0);
    const [buyIvaPercentage, setBuyIvaPercentage] = useState(0);
    const [buyTotalIva, setBuyTotalIva] = useState(0);
    const [buyDiscountsPercentage, setBuyDiscountsPercentage] = useState(0);
    const [buyTotalDiscounts, setBuyTotalDiscounts] = useState(0);
    const [buyInvoiceUrl, setBuyinvoiceUrl] = useState("");
    const [quantityProducts, setQuantityProducts] = useState("");
    const [addedProductsAtBuy, setAddedProductsAtBuy] = useState([]);
    const [products, setProducts] = useState([]);

    useEffect(() => {
        let cosamappeada = addedProductsAtBuy.map((p) => {
            let { TemporalId, ...loDemas } = p;
            return loDemas;
        });
        setProducts(cosamappeada);
    }, [addedProductsAtBuy]);

    console.log(products);

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

    const onBuyProviderChange = (e) => {
        setSelectedProvider(e.value);
    };
    useEffect(() => {
        const totalDiscount = buyTotalPurchase * (buyDiscountsPercentage / 100);
        setBuyTotalDiscounts(totalDiscount);
    }, [buyTotalPurchase, buyDiscountsPercentage]);

    //Verifica si hay applicados descuentos previos y luuego aplica el iva, actualiza automaticamente el campo del formulario
    useEffect(() => {
        if (buyTotalDiscounts !== 0) {
            const buyWithDiscount = buyTotalPurchase - buyTotalDiscounts;
            const buyAfterIvaAndDiscounts = buyWithDiscount * (buyIvaPercentage / 100);
            setBuyTotalIva(buyAfterIvaAndDiscounts);
        } else {
            const totalIva = buyTotalPurchase * (buyIvaPercentage / 100);
            setBuyTotalIva(totalIva);
        }
    }, [buyTotalPurchase, buyIvaPercentage, buyTotalDiscounts]);
    let history = useHistory();

    function handleClickRedirect() {
        toast.current.show({ severity: "success", summary: "Todo ha salido bien!", detail: "Compra creada exitosamente, seras redireccionado a la pantalla principal", life: 4000 });
        setTimeout(() => {
            history.push("/buys");
        }, 4000);
    }
    const createBuy = () => {
        _buyService
            .createBuy(buyId, buyProviderSelected.id, buyDatePurchase, buyTotalPurchase, buyShippingPrice, buyIvaPercentage, buyTotalIva, buyDiscountsPercentage, buyTotalDiscounts, buyInvoiceUrl)
            .then(() => {
                products.forEach((element) => {
                    _buyService
                        .addProductsToPurchase(element.idBuy, element.idProduct, element.amount, element.netPrice, element.shippingPrice, element.discountsPercentage, element.ivaPercentage, element.profitPercentage, element.salePrice)
                        .then((response) => {
                            console.log("Response de agregar producto", response);
                            _productService.updateProductFromBuy(element.idProduct, element.amount, element.ivaPercentage, element.salePrice);
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
            header: "Confirmacion",
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
            header: "Confirmacion",
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
        id: null,
        idProvider: null,
        factureNumber: "",
        buyData: "",
        buyTotal: "",
        quantityProducts: quantityProducts,
        buyDiscountsPercentage: buyShippingPrice,
        buyShippingPrice: buyShippingPrice,
        buyTotalDiscounts: 0,
        buyIvaPercentage: 0,
        URL_factura: "",
    };

    const validate = (data) => {
        let errors = {};

        if (!data.datePurchase) {
            errors.buyData = "este campo es requerido";
        }
        if (!data.totalPurchase) {
            errors.buyTotal = "Este campo es requerido";
        }
        if(!data.datePurchase){
            errors.buyData = "este campo es requerido";
        }

        if (!data.buyShippingPrice) {
            errors.buyShippingPrice = "Este campo es requerido";
        }
        if(!quantityProducts){
            errors.quantityProducts = "este campo es requerido";
        }

        if (!data.ivaPercentage) {
            errors.buyIvaPercentage = "Este campo es requerido";
        }
        
        if (!data.totalDiscounts) {
            errors.totalDiscounts = "Este campo es requedio";
        }
        if (!data.discountsPercentage) {
            errors.buyTotalDiscounts = "Este campo es requedio";
        }
        if (!data.invoiceUrl) {
            errors.URL_factura = "Este campo es requedio";
        }
        if(!data.id){
            errors.id = "el numero de la factura es requerido";
        }



        

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
                                name="idProvider"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="idProvider" className={classNames({ "p-error": isFormFieldValid("idProvider") })}>Proveedor</label>
                                            <Dropdown id="idProvider" {...input} options={providers} optionLabel="companyName" onChange={onBuyProviderChange} placeholder="Proveedor" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="id"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="id" className={classNames({ "p-error": isFormFieldValid("id") })}>Numero de factura</label>
                                            <InputText id="id" {...input} placeholder="Numero de Factura" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="buyData"
                                render={({ input, meta }) => (
                                    <div className="field">
                                        <span>
                                            <label htmlFor="buyData" className={classNames({ "p-error": isFormFieldValid("buyData") })}>
                                                Fecha de compra
                                            </label>
                                            <InputText id="buyData" {...input} placeholder="AAAA-MM-DD" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="quantityProducts"
                                render={({ input, meta }) => (
                                    <div className="quantityProducts">
                                        <span>
                                            <label htmlFor="quantityProducts" className={classNames({ "p-error": isFormFieldValid("quantityProducts") })}>Cantidad de Productos</label>
                                            <InputNumber id="quantityProducts" {...input} onChange={(e) => setQuantityProducts(e.value)} placeholder="Cantidad productos" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                             <Field
                                name="buyShippingPrice"
                                render={({ input, meta }) => (
                                    <div className="buyShippingPrice">
                                        <span>
                                            <label htmlFor="buyShippingPrice" className={classNames({ "p-error": isFormFieldValid("buyShippingPrice") })}>Valor de envio</label>
                                            <InputNumber id="buyShippingPrice" {...input} onChange={(e) => setBuyShippingPrice(e.value)} placeholder="Valor de envio" mode="currency" currency="COP" locale="es" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })}/>
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="buyTotalDiscounts"
                                render={({ input, meta }) => (
                                    <div className="buyTotalDiscounts">
                                        <span>
                                            <label htmlFor="buyTotalDiscounts" className={classNames({ "p-error": isFormFieldValid("buyTotalDiscounts") })}>Porcentaje Descuento</label>
                                            <InputNumber id="buyTotalDiscounts" {...input} onChange={(e) => setBuyDiscountsPercentage(e.value)} placeholder="Porcentaje descuento compra" suffix="%" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })}/>
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                             <Field
                                name="totalDiscounts"
                                render={({ input, meta }) => (
                                    <div className="totalDiscounts">
                                        <span>
                                            <label htmlFor="totalDiscounts" className={classNames({ "p-error": isFormFieldValid("totalDiscounts") })}>Total Descuento</label>
                                            <InputNumber id="buyTotalDiscounts" {...input}  placeholder="Total descuento" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} mode="currency" currency="COP" locale="es" disabled />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="buyIvaPercentage"
                                render={({ input, meta }) => (
                                    <div className="buyIvaPercentage">
                                        <span>
                                            <label htmlFor="buyIvaPercentage" className={classNames({ "p-error": isFormFieldValid("buyIvaPercentage") })}>Porcentaje de Iva</label>
                                            <InputNumber id="buyIvaPercentage" {...input}  placeholder="Porcentaje de IVA" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} suffix="%"  />
                                        </span>
                                        <br />
                                        {getFormErrorMessage(meta)}
                                    </div>
                                )}
                            />
                            <Field
                                name="buyTotalIva"
                                render={({ input, meta }) => (
                                    <div className="buyTotalIva">
                                        <span>
                                            <label htmlFor="buyTotalIva" className={classNames({ "p-error": isFormFieldValid("buyTotalIva") })}>Total IVA</label>
                                            <InputNumber id="buyTotalIva" {...input} placeholder="Total IVA compra" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} mode="currency" currency="COP" locale="es" disabled />
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
                                            <InputText id="URL_factura" {...input} onChange={(e) => setBuyinvoiceUrl(e.target.value)} placeholder="URL factura" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-buy-form__input": true })} />
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

            <TableBuyDetail idBuy={buyId} shippingPrice={buyShippingPrice} quantityProducts={quantityProducts} discountsPercentage={buyDiscountsPercentage} ivaPercentage={buyIvaPercentage} setAddedProductsAtBuy={setAddedProductsAtBuy} />

            <div className="create-product-buttons">
                <Button onClick={create} icon="pi pi-check" label="Crear compra" className="mr-2"></Button>
                <Button onClick={cancelBuy} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
