import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../service/ProductService";

import { Dropdown } from "primereact/dropdown";

const lineData = {
    labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio"],
    datasets: [
        {
            label: "Ingresos mensuales",
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: "#00bb7e",
            borderColor: "#00bb7e",
            tension: 0.4,
        },
    ],
};

const Dashboard = (props) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);

    const [products, setProducts] = useState(null);
    // const menu1 = useRef(null);
    // const menu2 = useRef(null);
    const [lineOptions] = useState(null);

    const days = [
        { name: "Lunes", code: "L" },
        { name: "Martes", code: "M" },
        { name: "Miercoles", code: "W" },
        { name: "Jueves", code: "J" },
        { name: "Viernes", code: "V" },
        { name: "Sabado", code: "S" },
        { name: "Domingo", code: "D" },
    ];
    const months = [
        { name: "Enero", code: "EN" },
        { name: "Febrero", code: "FE" },
        { name: "Marzo", code: "MAR" },
        { name: "Abril", code: "ABR" },
        { name: "Mayo", code: "MAY" },
        { name: "Junio", code: "JUN" },
        { name: "Julio", code: "JUL" },
        { name: "Agosto", code: "AGO" },
        { name: "Septiembre", code: "SEP" },
        { name: "Octube", code: "OCT" },
        { name: "Noviembre", code: "NOV" },
        { name: "Diciembre", code: "DIC" },
    ];
    const years = [
        { name: "2018", code: "NY" },
        { name: "2019", code: "RM" },
        { name: "2020", code: "LDN" },
        { name: "2021", code: "IST" },
        { name: "2022", code: "PRS" },
        { name: "2023", code: "PRS" },
    ];

    const onDayChange = (e) => {
        setSelectedDay(e.value);
    };
    const onMonthChange = (e) => {
        setSelectedMonth(e.value);
    };
    const onYearChange = (e) => {
        setSelectedYear(e.value);
    };

    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    };

    const [stackedData] = useState({
        labels: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio"],
        datasets: [
            {
                type: "bar",
                label: "Producto 1",
                backgroundColor: "#42A5F5",
                data: [50, 25, 12, 48, 90, 76, 42],
            },
            {
                type: "bar",
                label: "Producto 2",
                backgroundColor: "#66BB6A",
                data: [21, 84, 24, 75, 37, 65, 34],
            },
            {
                type: "bar",
                label: "Producto 3",
                backgroundColor: "#FFA726",
                data: [41, 52, 24, 74, 23, 21, 32],
            },
        ],
    });

    const [basicData] = useState({
        labels: ["Lunes", "Martes", "Miercoles", "Jueves", "Viernes", "Sabado", "Domingo"],
        datasets: [
            {
                label: "Ingresos diarios",
                backgroundColor: "#42A5F5",
                data: [65, 59, 80, 81, 56, 55, 40],
            },
        ],
    });

    const getLightTheme = () => {
        let basicOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                legend: {
                    labels: {
                        color: "#495057",
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "#ebedef",
                    },
                },
                y: {
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "#ebedef",
                    },
                },
            },
        };
        let stackedOptions = {
            maintainAspectRatio: false,
            aspectRatio: 0.8,
            plugins: {
                tooltips: {
                    mode: "index",
                    intersect: false,
                },
                legend: {
                    labels: {
                        color: "#495057",
                    },
                },
            },
            scales: {
                x: {
                    stacked: true,
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "#ebedef",
                    },
                },
                y: {
                    stacked: true,
                    ticks: {
                        color: "#495057",
                    },
                    grid: {
                        color: "#ebedef",
                    },
                },
            },
        };

        return {
            basicOptions,
            stackedOptions,
        };
    };

    const { basicOptions, stackedOptions } = getLightTheme();

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Usuarios registrados</span>
                            <Dropdown value={selectedDay} options={days} onChange={onDayChange} optionLabel="name" placeholder="Dia" />

                            <div className="text-900 font-medium text-xl">12</div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="col-12 lg:col-6 xl:col-3"></div>
            <div className="col-12 lg:col-6 xl:col-3"></div>
            <div className="col-12 lg:col-6 xl:col-3"></div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Productos mas vendidos</h5>
                    <div>
                        <Dropdown value={selectedMonth} options={months} onChange={onMonthChange} optionLabel="name" placeholder="Mes" />
                        <Dropdown value={selectedYear} options={years} onChange={onYearChange} optionLabel="name" placeholder="Año" />
                    </div>
                    <DataTable value={products} rows={5} paginator responsiveLayout="scroll">
                        <Column header="Imagen" body={(data) => <img className="shadow-2" src={`assets/demo/images/product/${data.image}`} alt={data.image} width="50" />} />
                        <Column field="name" header="Nombre" sortable style={{ width: "35%" }} />
                        <Column field="price" header="Precio" sortable style={{ width: "35%" }} body={(data) => formatCurrency(data.price)} />
                        <Column
                            header="View"
                            style={{ width: "15%" }}
                            body={() => (
                                <>
                                    <Button icon="pi pi-search" type="button" className="p-button-text" />
                                </>
                            )}
                        />
                    </DataTable>
                </div>
                <div className="card">
                    <h5>Productos menos vendidos</h5>
                    <div>
                        <Dropdown value={selectedMonth} options={months} onChange={onMonthChange} optionLabel="name" placeholder="Mes" />
                        <Dropdown value={selectedYear} options={years} onChange={onYearChange} optionLabel="name" placeholder="Año" />
                    </div>
                    <Chart type="bar" data={stackedData} options={stackedOptions} />
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Ingresos mensuales</h5>
                    <div>
                        <Dropdown value={selectedMonth} options={months} onChange={onMonthChange} optionLabel="name" placeholder="Mes" />
                        <Dropdown value={selectedYear} options={years} onChange={onYearChange} optionLabel="name" placeholder="Año" />
                    </div>

                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
                <div className="card">
                    <h5>Ventas diarias</h5>
                    <div>
                        <Dropdown value={selectedDay} options={days} onChange={onDayChange} optionLabel="name" placeholder="Dia" />
                        <Dropdown value={selectedMonth} options={months} onChange={onMonthChange} optionLabel="name" placeholder="Mes" />
                        <Dropdown value={selectedYear} options={years} onChange={onYearChange} optionLabel="name" placeholder="Año" />
                    </div>
                    <Chart type="bar" data={basicData} options={basicOptions} />
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname && prevProps.colorMode === nextProps.colorMode;
};

export default React.memo(Dashboard, comparisonFn);
