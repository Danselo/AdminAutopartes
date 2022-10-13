import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createSales.css";
import { Dropdown } from "primereact/dropdown";
import { InputNumber } from "primereact/inputnumber";
import { ProductService } from "../../service/ProductService";
import TableSalesProductsDetail from "../../components/TableSales/TableSalesProductsDetails";
import { useHistory } from "react-router-dom";
import { SaleService } from "../../service/SaleService";
import { ClientService } from "../../service/ClientService";

const _saleService = new SaleService();
const _clientService = new ClientService();
const _productService = new ProductService();

export default function CreateSales() {
    const toast = useRef(null);

    const [clients, setClients] = useState([]);
    const [saleClientSelected, setClientSelected] = useState([]);
    const [statusSaleSelected, setStatusSaleSelected] = useState([]);
    const [statusPaymentSelected, setStatusPaymentSelected] = useState([]);
    const [saleDate, setSaleDate] = useState("");
    const [totalSale, setTotalSale] = useState(0);
    const [addedProductsAtSale, setAddedProductsAtSale] = useState([]);
    const [products, setProducts] = useState([]);
console.log(saleClientSelected)
    useEffect(() => {
        let cosamappeada = addedProductsAtSale.map((p) => {
            let { TemporalId, ...loDemas } = p;
            return loDemas;
        });
        setProducts(cosamappeada);
    }, [addedProductsAtSale]);

    console.log(products);

    useEffect(() => {
        _clientService
            .getClients()
            .then((response) => {
                setClients(response);
            })
            .catch((e) => {
                console.log(e, "Error al traer los clientes");
            });
    }, []);
console.log(clients)
    
const onSaleClientChange = (e) => {
        setClientSelected(e.value);
    };

    const onSaleStatusChange = (e) => {
        setStatusSaleSelected(e.value);
    };

    const onSaleStatusPaymentChange = (e) => {
        setStatusPaymentSelected(e.value);
    };


    useEffect(() => {
        let total = 0;
        addedProductsAtSale.forEach(element => {
            total += element.price
            setTotalSale(total)
            
        });

       
    }, [addedProductsAtSale]);

    const statusSale = [
        { name: 'Activo', id: '1' },
        { name: 'Terminado', id: '0' },
    ];
    const statusPayment = [
        { name: 'Pagado', id: '1' },
        { name: 'Pendiente', id: '0' },
    ];
    let history = useHistory();

    function handleClickRedirect() {
        toast.current.show({ severity: "success", summary: "Todo ha salido bien!", detail: "Compra creada exitosamente, seras redireccionado a la pantalla principal", life: 4000 });
        setTimeout(() => {
            history.push("/sales");
        }, 4000);
    }
    const createSale = () => {
        _saleService
            .createSale( saleClientSelected.id, saleDate, statusSaleSelected.name, statusPaymentSelected.name, totalSale)
            .then((responseCreateSale) => {
                products.forEach((element) => {
                    _saleService
                        .addProductsToSale(responseCreateSale.id, element.idProduct, element.amount, element.price)
                        .then((response) => {
                            console.log("Response de agregar producto", response);
                            _productService.discountProduct(element.idProduct, element.amount);
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
            accept: () => createSale(),
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
console.log(clients.name)
    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/Sales"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-product-tittle">
                <h3>Crear una venta</h3>
            </div>

            <div className="create-buy-form">
                <div>
                    <label htmlFor="saleClientId">Id cliente</label>

                    <Dropdown id="saleClientId" value={saleClientSelected} options={clients} optionLabel="document" onChange={onSaleClientChange} placeholder="Cliente" className="create-buy-form__input" />
                </div>

                <div>
                    <label htmlFor="saleDate">Fecha de venta</label>
                    <InputText id="saleDate" value={saleDate} onChange={(e) => setSaleDate(e.target.value)} placeholder="aaaa-mm-dd" allowEmpty={false} required={true} className="create-buy-form__input" />
                </div>

                <div>
                    <label htmlFor="statusSale">Estado de la venta</label>
                    <Dropdown id="statusSale" value={statusSaleSelected} options={statusSale} optionLabel="name" onChange={onSaleStatusChange} placeholder="Seleccione el estado" className="create-buy-form__input" />
                </div>

                <div>
                    <label htmlFor="buyProviderId">Estado de pago</label>

                    <Dropdown id="buyProviderId" value={statusPaymentSelected} options={statusPayment} optionLabel="name" onChange={onSaleStatusPaymentChange} placeholder="Seleccione el estado de pago" className="create-buy-form__input" />
                </div>
                <div>
                    <label htmlFor="totalSale">Total venta</label>
                    <InputNumber id="totalSale" value={totalSale} placeholder="Total venta" disabled className="create-buy-form__input" mode="currency" currency="COP" locale="es" />
                </div>
            </div>

            <TableSalesProductsDetail setAddedProductsAtSale={setAddedProductsAtSale} />

            <div className="create-product-buttons">
                <Button onClick={create} icon="pi pi-check" label="Crear venta" className="mr-2"></Button>
                <Button onClick={cancelBuy} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
