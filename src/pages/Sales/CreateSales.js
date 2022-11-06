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
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";
import { Calendar } from "primereact/calendar";
import { OverlayPanel } from "primereact/overlaypanel";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";


const _saleService = new SaleService();
const _clientService = new ClientService();
const _productService = new ProductService();

export default function CreateSales() {
    const toast = useRef(null);
    const [clients, setClients] = useState([]);
    const [saleClientSelected, setSaleClientSelected] = useState(null);
    // const [statusSaleSelected, setStatusSaleSelected] = useState([]);
    // const [statusPaymentSelected, setStatusPaymentSelected] = useState([]);
    // const [saleDate, setSaleDate] = useState("");
    const [totalSale, setTotalSale] = useState(0);
    const [addedProductsAtSale, setAddedProductsAtSale] = useState([]);
    const [products, setProducts] = useState([]);
    const op = useRef(null);
    const isMounted = useRef(false);
    const [globalFilter, setGlobalFilter] = useState(null);

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
        setSaleClientSelected(e.value);
    };

    const initialValues = {
        saleDate: "",
        statusSale: "",
        statusPayment: "",
        // totalSale: totalSale,
    };

    const validate = (data) => {
        let errors = {};

        if (!saleClientSelected) {
            errors.saleClientId = "Debe asociar un cliente a la venta.";
        }
        if (!data.saleDate) {
            errors.saleDate = "Fecha de venta es requerido.";
        }

        if (!data.statusSale) {
            errors.statusSale = "Estado de la venta es requerido";
        }

        if (!data.statusPayment) {
            errors.statusPayment = "El estado de pago es requerido";
        }

        // if (!data.totalSale) {
        //     errors.totalSale = "Debe asociar productos a la venta para poder continuar";
        // }

        return errors;
    };

    const onSubmit = (data, form) => {
        if (saleClientSelected) {
            setTotalSale(totalSale);
            create(form, data);
        }
    };

    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    useEffect(() => {
        let cosamappeada = addedProductsAtSale.map((p) => {
            let { TemporalId, ...loDemas } = p;
            return loDemas;
        });
        setProducts(cosamappeada);
    }, [addedProductsAtSale]);

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
        toast.current.show({ severity: "success", summary: "Todo ha salido bien!", detail: "Venta creada exitosamente, seras redireccionado a la pantalla principal", life: 4000 });
        setTimeout(() => {
            history.push("/sales");
        }, 4000);
    }

    const createSale = (form, data) => {
        var dateSelected = new Date(data.saleDate);
        var formatDate = dateSelected.toISOString().split("T")[0];
        _saleService
            .createSale(saleClientSelected.id, formatDate, data.statusSale.name, data.statusPayment.name, totalSale)
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
                form.restart();
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
    const create = (form, data) => {
        confirmDialog({
            message: "¿Esta seguro que desea crear esta compra?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => createSale(form, data),
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
    useEffect(() => {
        let total = addedProductsAtSale.reduce((acum, current) => {
            acum += current.price * current.amount;
            return acum;
        }, 0);
        setTotalSale(total);
    }, [addedProductsAtSale]);

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/Sales"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-sale-tittle">
                <h3>Crear una venta</h3>
            </div>
            <div>
                <div className="create-sale-header">
                    <div className="create-sale-tittle__button">
                        <Button type="button" icon="pi pi-search" label={saleClientSelected ? saleClientSelected.document : "Seleccione un cliente"} onClick={(e) => op.current.toggle(e)} aria-haspopup aria-controls="overlay_panel" className="select-product-button" tooltip="Seleccionar un cliente" />
                        {saleClientSelected ? <small className="p-success">Cliente asociado</small> : <small className="p-error">*Debe asociar un cliente a la compra</small>}
                    </div>
                    <div className="create-sale-header__card">
                        <h5>Total de la venta</h5>
                        $ {totalSale}
                    </div>
                </div>

                <OverlayPanel ref={op} showCloseIcon id="overlay_panel" style={{ width: "500px" }} className="overlaypanel-demo">
                    <div className="p-inputgroup create-brand__table">
                        <InputText placeholder="Buscar cliente" onInput={(e) => setGlobalFilter(e.target.value)} />
                        <Button icon="pi pi-search" className="p-button-primary" />
                    </div>
                    <DataTable id="saleClientId" value={clients} globalFilter={globalFilter} selectionMode="single" paginator rows={5} selection={saleClientSelected} onSelectionChange={onClientSelect}>
                        <Column field="name" sortable header="Nombre"></Column>
                        <Column field="lastname" sortable header="Apellido"></Column>
                        <Column field="document" sortable header="Documento"></Column>
                        <Column field="telephone" sortable header="Telefono"></Column>
                    </DataTable>
                </OverlayPanel>
            </div>

            <TableSalesProductsDetail setAddedProductsAtSale={setAddedProductsAtSale} />
            <Form
                onSubmit={onSubmit}
                initialValues={initialValues}
                validate={validate}
                render={({ handleSubmit }) => (
                    <>
                        <form onSubmit={handleSubmit}>
                            <div className="create-sale-form card">
                                <Field
                                    name="saleDate"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="create-sale-form__span">
                                                <label htmlFor="saleDate" className={classNames({ "p-error": isFormFieldValid("saleDate") })}>
                                                    Fecha de venta*
                                                </label>
                                                <Calendar id="saleDate" {...input} autoFocus readOnlyInput className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} placeholder="aaaa-mm-dd" dateFormat="yy-mm-dd" />
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="statusSale"
                                    render={({ input, meta }) => (
                                        <div className="field">
                                            <span className="create-sale-form__span">
                                                <label htmlFor="statusSale" className={classNames({ "p-error": isFormFieldValid("statusSale") })}>
                                                    Estado de la venta*
                                                </label>
                                                <Dropdown id="statusSale" {...input} options={statusSale} optionLabel="name" placeholder="Seleccione el estado" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                                <Field
                                    name="statusPayment"
                                    render={({ input, meta }) => (
                                        <div className="field ">
                                            <span className="create-sale-form__span">
                                                <label htmlFor="statusPayment" className={classNames({ "p-error": isFormFieldValid("statusPayment") })}>
                                                    Estado de pago*
                                                </label>
                                                <Dropdown id="statusPayment" {...input} options={statusPayment} optionLabel="name" placeholder="Seleccione el estado" className={classNames({ "p-invalid": isFormFieldValid(meta), "create-sale-form__input": true })} />
                                            </span>
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            </div>

                            <div className="create-product-buttons">
                                <Button type="submit" icon="pi pi-check" label="Crear venta" className="mr-2"></Button>
                                <Button onClick={cancelBuy} icon="pi pi-times" label="Cancelar"></Button>
                            </div>
                        </form>
                    </>
                )}
            />
        </div>
    );
}
