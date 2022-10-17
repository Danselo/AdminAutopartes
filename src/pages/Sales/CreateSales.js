import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createSales.css";
import { Dropdown } from "primereact/dropdown";
import { ProductService } from "../../service/ProductService";
import TableSalesProductsDetail from "../../components/TableSales/TableSalesProductsDetails";
import { useHistory } from "react-router-dom";
import { SaleService } from "../../service/SaleService";
import { ClientService } from "../../service/ClientService";
import { useForm, Controller } from "react-hook-form";
import { classNames } from "primereact/utils";
import { Calendar } from "primereact/calendar";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputNumber } from 'primereact/inputnumber';
 

const _saleService = new SaleService();
const _clientService = new ClientService();
const _productService = new ProductService();

export default function CreateSales() {
    const toast = useRef(null);
    const [clients, setClients] = useState([]);
    const [saleClientSelected, setClientSelected] = useState(null);
    const [statusSaleSelected, setStatusSaleSelected] = useState([]);
    const [statusPaymentSelected, setStatusPaymentSelected] = useState([]);
    const [saleDate, setSaleDate] = useState("");
    const [totalSale, setTotalSale] = useState(0);
    const [addedProductsAtSale, setAddedProductsAtSale] = useState([]);
    const [products, setProducts] = useState([]);
    const op = useRef(null);
    const isMounted = useRef(false);
    const [globalFilter, setGlobalFilter] = useState(null);

    console.log(op);
    console.log(isMounted);
    useEffect(() => {
        if (isMounted.current && saleClientSelected) {
            op.current.hide();
            toast.current.show({ severity: "info", summary: "Cliente seleccionado", detail: saleClientSelected.name, life: 3000 });
        }
    }, [saleClientSelected]); // eslint-disable-line react-hooks/exhaustive-deps

    useEffect(() => {
        isMounted.current = true;
        _clientService
            .getClients()
            .then((response) => {
                setClients(response);
            })
            .catch((e) => {
                console.log(e, "Error al traer los clientes");
            });
    }, []);

    const onClientSelect = (e) => {
        setClientSelected(e.value);
    };

    const defaultValues = {
        saleClientId: null,
        saleDate: "",
        statusSale: "",
        statusPayment: "",
        // totalSale: null,
    };
    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
    } = useForm({ defaultValues });

    useEffect(() => {
        let cosamappeada = addedProductsAtSale.map((p) => {
            let { TemporalId, ...loDemas } = p;
            return loDemas;
        });
        setProducts(cosamappeada);
    }, [addedProductsAtSale]);

    const onSaleClientChange = (e) => {
        setClientSelected(e.value);
    };
    const statusSale = [
        { name: "Activo", id: "1" },
        { name: "Terminado", id: "0" },
    ];
    const statusPayment = [
        { name: "Pagado", id: "1" },
        { name: "Pendiente", id: "0" },
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
            .createSale(saleClientSelected.id, saleDate, statusSaleSelected.name, statusPaymentSelected.name, totalSale)
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
            .then(() => {
                reset();
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

    const onSubmit = (data) => {
        console.log(data);
        console.log(data.saleDate);
        console.log("Me ejecute cuando le di clic en agregar productos")
        var dateSelected = new Date(data.saleDate);
        var formatDate = dateSelected.toISOString().split("T")[0];
        setSaleDate(formatDate);
        setStatusSaleSelected(data.statusSale.name);
        setStatusPaymentSelected(data.statusPayment.name);
        // setTotalSale(totalSale);
        reset();
    };

    useEffect(() => {
        let total = 0;
        addedProductsAtSale.forEach((element) => {
            total += element.price;
            setTotalSale(total);
        });
    }, [addedProductsAtSale]);

    const getFormErrorMessage = (name) => {
        return errors[name] && <small className="p-error">{errors[name].message}</small>;
    };
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
            <div className="">
                            <Button type="button" icon="pi pi-search" label={saleClientSelected ? saleClientSelected.name : "Seleccione un cliente"} onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="select-product-button" tooltip="Asociar un cliente a la venta es opcional"/>

                            <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: "500px" }} className="overlaypanel-demo">
                                <div className="p-inputgroup create-brand__table">
                                    <InputText placeholder="Buscar cliente" onInput={(e) => setGlobalFilter(e.target.value)} />
                                    <Button icon="pi pi-search" className="p-button-primary" />
                                </div>
                                <DataTable value={clients} globalFilter={globalFilter} selectionMode="single" paginator rows={5} selection={saleClientSelected} onSelectionChange={onClientSelect}>
                                    <Column field="name" sortable header="Nombre"></Column>
                                    <Column field="lastname" sortable header="Apellido"></Column>
                                    <Column field="document" sortable header="Documento"></Column>
                                    <Column field="telephone" sortable header="Telefono"></Column>
                                </DataTable>
                            </OverlayPanel>
                        </div>
            <form onSubmit={handleSubmit(onSubmit)}>
                <div className="create-sale-form">
                   
                    <div>
                        <span>
                            <label htmlFor="saleDate" className={classNames({ "p-error": !!errors.saleDate })}>
                                Fecha de venta*
                            </label>
                            <Controller
                                name="saleDate"
                                control={control}
                                rules={{ required: "Fecha de venta es requerido.", pattern: { value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i, message: "Fecha de venta invalida. E.g. 2020-10-10" } }}
                                render={({ field, fieldState }) => 
                                <Calendar value={saleDate} id={field.name} autoFocus {...field} readOnlyInput className={classNames({ "p-invalid": fieldState.error, "create-sale-form__input": true })} placeholder="aaaa-mm-dd" dateFormat="yy-mm-dd" />}
                            />
                        </span>
                        {getFormErrorMessage("saleDate")}
                    </div>

                    <div>
                        <span>
                            <label htmlFor="statusSale" className={classNames({ "p-error": !!errors.statusSale })}>
                                Estado de la venta*
                            </label>
                            <Controller
                                name="statusSale"
                                control={control}
                                rules={{ required: "Estado de la venta es requerido." }}
                                render={({ field, fieldState }) => <Dropdown value={statusSaleSelected} id={field.name} {...field} options={statusSale} placeholder="Seleccione el estado" optionLabel="name" className={classNames({ "p-invalid": fieldState.error, "create-sale-form__input": true })} />}
                            />
                        </span>
                        {getFormErrorMessage("statusSale")}
                    </div>

                    <div>
                        <span>
                            <label htmlFor="statusPayment" className={classNames({ "p-error": !!errors.statusPayment })}>
                                Estado de pago*
                            </label>
                            <Controller
                                name="statusPayment"
                                control={control}
                                rules={{ required: "Estado del pago es requerido." }}
                                render={({ field, fieldState }) => (
                                    <Dropdown value={statusPaymentSelected} id={field.name} {...field} options={statusPayment} placeholder="Seleccione el estado" optionLabel="name" className={classNames({ "p-invalid": fieldState.error, "create-sale-form__input": true })} />
                                )}
                            />
                        </span>
                        {getFormErrorMessage("statusPayment")}
                    </div>

                    {/* <div>
                        <span>
                            <label htmlFor="totalSale" className={classNames({ "p-error": !!errors.totalSale })}>
                                Total venta*
                            </label>
                            <Controller
                                name="totalSale"
                                control={control}
                                rules={{ required: "Debes asociar productos a la venta." }}
                                render={({ field, fieldState }) => (
                                <InputNumber value={totalSale} id={field.name} {...field} className={classNames({ "p-invalid": fieldState.error, "create-sale-form__input": true })} mode="currency" currency="COP" locale="es" placeholder="Total venta" disabled />
                                )}
                            />
                        </span>
                        {getFormErrorMessage("totalSale")}
                    </div> */}
                </div>
                {/* <TableSalesProductsDetail setAddedProductsAtSale={setAddedProductsAtSale} /> */}

                <div className="create-product-buttons">
                    <Button type="submit" icon="pi pi-check" label="Crear venta" className="mr-2"></Button>

                    <Button onClick={cancelBuy} icon="pi pi-times" label="Cancelar"></Button>
                </div>
            </form>
        </div>
    );
}
