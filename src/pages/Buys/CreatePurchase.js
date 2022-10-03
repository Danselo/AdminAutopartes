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
import TableBuyDetail from "../../components/TableBuys/TableBuyDetail";

const _buyService = new BuyService();
const _providersService = new ProviderService();

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
        let cosamappeada= addedProductsAtBuy.map((p)=>{
            let {TemporalId, ...loDemas} = p
        return loDemas
        }

        )
        setProducts(cosamappeada)
    }, [addedProductsAtBuy]);


    console.log(products)

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
       
    },[buyTotalPurchase,buyDiscountsPercentage]);
    
    //Verifica si hay applicados descuentos previos y luuego aplica el iva, actualiza automaticamente el campo del formulario
    useEffect(() => {
        if (buyTotalDiscounts !== 0) {
            const buyWithDiscount = buyTotalPurchase - buyTotalDiscounts;
            const buyAfterIvaAndDiscounts = buyWithDiscount*(buyIvaPercentage/100)
            setBuyTotalIva(buyAfterIvaAndDiscounts)
        }else{
            const totalIva = buyTotalPurchase * (buyIvaPercentage/100)
            setBuyTotalIva(totalIva)
        }      
    },[buyTotalPurchase,buyIvaPercentage,buyTotalDiscounts]);
    
    const createBuy = () =>{
        _buyService.createBuy(
            buyId,
            buyProviderSelected.id, 
            buyDatePurchase, 
            buyTotalPurchase, 
            buyShippingPrice, 
            buyIvaPercentage, 
            buyTotalIva, 
            buyDiscountsPercentage,
            buyTotalDiscounts, 
            buyInvoiceUrl ).then(()=>{
                products.forEach(element => {
                    
                    _buyService.addProductsToPurchase(element.idBuy,
                        element.idProduct,
                        element.amount,
                        element.amount,
                        element.shippingPrice,
                        element.discountsPercentage,
                        element.ivaPercentage,
                        element.profitPercentage,
                        element.salePrice
                        ).then((response) =>{
                        console.log(response, "producto agregado a la tabla")
                    }).catch((e)=>{
                        console.log("no se agrego el producto")
                    })
                    
                });

                toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Compra añadida exitosamente", life: 3000 });

        }).catch(() => {
            toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
        })
    }

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
            accept: createBuy(),
            reject,
        });
    };

    const confirm2 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept,
            reject,
        });
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/Buys"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-product-tittle">
                <h3>Crear una compra</h3>
            </div>

            <div className="create-buy-form">
                <div>
                    <label htmlFor="buyProviderId">Proveedor</label>

                    <Dropdown id="buyProviderId" value={buyProviderSelected} options={providers} optionLabel="companyName" onChange={onBuyProviderChange} placeholder="Proveedor" className="create-buy-form__input" />
                </div>
                <div>
                    <label htmlFor="buyId">Numero de factura</label>
                    <InputText id="buyId" value={buyId} onChange={(e) => setBuyId(e.target.value)} placeholder="Numero o referencia de factura" className="create-buy-form__input" />
                </div> 
                <div>
                    <label htmlFor="buyDatePurchase">Fecha de compra</label>

                    {/* <Calendar id="buyDatePurchase" dateFormat="yy/mm/dd"  value={buyDatePurchase} onChange={(e) => console.log(e)} placeholder="Fecha de compra" className="create-buy-form__input" /> */}
                    <InputText id="buyDatePurchase" value={buyDatePurchase} onChange={(e) => setBuyDatePurchase(e.target.value)} placeholder="Fecha de compra" className="create-buy-form__input" />
                </div>

             
                <div>
                    <label htmlFor="buyTotalPurchase">Total neto compra</label>

                    <InputNumber id="buyTotalPurchase" value={buyTotalPurchase} onChange={(e) => setBuyTotalPurchase(e.value)} mode="currency" currency="COP" locale="es" placeholder="Total compra" className="create-buy-form__input" />
                </div>
                <div>
                    <label htmlFor="quantityProducts">Cantidad de productos</label>

                    <InputNumber id="quantityProducts" value={quantityProducts} onChange={(e) => setQuantityProducts(e.value)} placeholder="Cantidad productos" className="create-buy-form__input" />
                </div>
                <div>
                    <label htmlFor="buyShippingPrice">Valor de envio</label>
                    <InputNumber id="buyShippingPrice" value={buyShippingPrice} onChange={(e) => setBuyShippingPrice(e.value)} placeholder="Valor de envio" mode="currency" currency="COP" locale="es" className="create-buy-form__input" />
                </div>

                <div>
                    <label htmlFor="buyDiscountsPercentage">Porcentaje descuento en compra</label>
                    <InputNumber id="buyDiscountsPercentage" value={buyDiscountsPercentage} onChange={(e) => setBuyDiscountsPercentage(e.value)} placeholder="Porcentaje descuento compra" className="create-buy-form__input" suffix="%" />
                </div>
                <div>
                    <label htmlFor="buyTotalDiscounts">Total descuento</label>
                    <InputNumber id="buyTotalDiscounts" value={buyTotalDiscounts} placeholder="Total descuento" className="create-buy-form__input" mode="currency" currency="COP" locale="es" disabled />
                </div>
                <div>
                    <label htmlFor="buyIvaPercentage">Porcentaje de IVA</label>
                    <InputNumber id="buyIvaPercentage" value={buyIvaPercentage} onChange={(e) => setBuyIvaPercentage(e.value)} placeholder="Porcentaje de IVA" className="create-buy-form__input" suffix="%" />
                </div>

                <div>
                    <label htmlFor="buyTotalIva">Total IVA</label>
                    <InputNumber id="buyTotalIva" value={buyTotalIva} placeholder="Total IVA compra" className="create-buy-form__input" mode="currency" currency="COP" locale="es" disabled />
                </div>
                <div>
                    <label htmlFor="buyInvoiceUrl">URL factura</label>
                    <InputText id="buyInvoiceUrl" value={buyInvoiceUrl} onChange={(e) => setBuyinvoiceUrl(e.target.value)} placeholder="URL factura" className="create-buy-form__input" />
                </div>
            </div>
            
            <TableBuyDetail 
            idBuy ={buyId} 
            shippingPrice={buyShippingPrice} 
            quantityProducts={quantityProducts} 
            discountsPercentage={buyDiscountsPercentage} 
            ivaPercentage={buyIvaPercentage}
            setAddedProductsAtBuy={setAddedProductsAtBuy}
            />

            <div className="create-product-buttons">
                <Button onClick={create} icon="pi pi-check" label="Crear" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
