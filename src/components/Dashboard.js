import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../service/ProductService";
import { Dropdown } from "primereact/dropdown";
import { DashboardService } from "./../service/DashboardService";
import { ImageProductService } from "../service/ImageProductService";
import { Calendar } from "primereact/calendar";
import { locale, addLocale } from "primereact/api";

import config from "../config/config";
addLocale("es", {
    firstDayOfWeek: 1,
    dayNames: ["domingo", "lunes", "martes", "miércoles", "jueves", "viernes", "sábado"],
    dayNamesShort: ["dom", "lun", "mar", "mié", "jue", "vie", "sáb"],
    dayNamesMin: ["D", "L", "M", "X", "J", "V", "S"],
    monthNames: ["Enero", "Febrero", "Marzo", "Abril", "Mayo", "Junio", "Julio", "Agosto", "Septiembre", "Octubre", "Noviembre", "Diciembre"],
    monthNamesShort: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
    today: "Hoy",
    clear: "Limpiar",
});

locale("es");
const _dashboardService = new DashboardService();
const _imageProductService = new ImageProductService();

const Dashboard = (props) => {
    const [selectedDay, setSelectedDay] = useState(null);
    const [selectedMonth, setSelectedMonth] = useState(null);
    const [selectedYear, setSelectedYear] = useState(null);
    const [topTenMostSelled, setTopTenMostSelled] = useState([]);
    const [topTenLessSold, setTopTenLessSold] = useState([]);
    const [dailySales, setDailySales] = useState([]);
    const [imagesData, setImagesData] = useState({});
    const currentDate = new Date();
    const [topTenDate, setTopTenDate] = useState(currentDate);
    const [topTenLessDate, setTopTenLessDate] = useState(currentDate);
    const [dailyDate, setDailyDate] = useState(currentDate);
    const [monthlyIncomeDate, setMonthlyIncomeDate] = useState(null);
    const [lineOptions] = useState(null);
    const [monthlyIncome, setMonthlyIncome] = useState([]);

    let monthlyIncomeArray = monthlyIncome.map((response) => {
        return response.total_per_month;
    });
    let labelsMonthlyIncomeArray = monthlyIncome.map((response) => {
        const month = response.month;
        return ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"][month - 1];
    });
    const lineData = {
        // labels: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"],
        labels: labelsMonthlyIncomeArray,
        datasets: [
            {
                label: "Ingresos mensuales",
                data: monthlyIncomeArray,
                fill: false,
                backgroundColor: "#00bb7e",
                borderColor: "#00bb7e",
                tension: 0.4,
            },
        ],
    };
    const basicData = {
        labels: dailySales.map((response) => {
            return response.sale_date;
        }),
        datasets: [
            {
                label: "Ingresos diarios",
                backgroundColor: "#42A5F5",
                data: dailySales.map((response) => {
                    return response.total_per_day;
                }),
            },
        ],
    };

    useEffect(() => {
        _dashboardService
            .getTopTenMostSelledProducts(topTenDate)
            .then((response) => {
                setTopTenMostSelled(response[0]);
            })
            .catch((error) => {
                console.log("Ocurrio un error al traer los productos mas vendidos", error);
            });
        _dashboardService
            .getTopTenLessSoldProducts(topTenLessDate)
            .then((response) => {
                setTopTenLessSold(response[0]);
            })
            .catch((error) => {
                console.log("Ocurrio un error al traer los productos menos vendidos", error);
            });
        const getMonthlyIncomeParam = monthlyIncomeDate || currentDate;
        _dashboardService
            .getMonthlyIncome(getMonthlyIncomeParam)
            .then((response) => {
                setMonthlyIncome(response[0]);
            })
            .catch((error) => {
                console.log("Ocurrio un error al traer los ingresos mensuales", error);
            });
        _dashboardService
            .getDailySales(dailyDate)
            .then((response) => {
                setDailySales(response[0]);
            })
            .catch((error) => {
                console.log("Ocurrio un error al traer las ventas", error);
            });
    }, [topTenDate, topTenLessDate, monthlyIncomeDate, dailyDate]);
    const days = [
        { name: "Lunes", code: "L" },
        { name: "Martes", code: "M" },
        { name: "Miercoles", code: "W" },
        { name: "Jueves", code: "J" },
        { name: "Viernes", code: "V" },
        { name: "Sabado", code: "S" },
        { name: "Domingo", code: "D" },
    ];

    const onDayChange = (e) => {
        setSelectedDay(e.value);
    };

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
    useEffect(() => {
        _imageProductService.getImages().then((images) => {
            let imagesDataAux = {};
            images.forEach((image) => {
                imagesDataAux[image.idProduct] = image.url;
            });
            setImagesData(imagesDataAux);
        });
    }, []);
    const photoBodyTemplate = (rowData, info) => {
        let classBool;
        if (!rowData.id) {
            return null;
        }
        if (info) {
            classBool = false;
        } else {
            classBool = true;
        }
        let url = imagesData[rowData.id];

        return <img src={`${config.baseURL}${url}`} onError={(e) => (e.target.src = `${config.baseURL}/public/images/no-pictures.png`)} alt={rowData.id} className={!classBool ? "product-image" : "info-image info-image-not-photo"} />;
    };

    const { basicOptions } = getLightTheme();
    const [date10, setDate10] = useState(null);
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
                    <h5>Top 10 de los productos mas vendidos</h5>
                    <div className="field col-12 md:col-4">
                        <Calendar id="monthpicker" value={topTenDate} placeholder="Seleccione un mes" locale="es" onChange={(e) => setTopTenDate(e.value)} view="month" dateFormat="mm/yy" />
                    </div>
                    <DataTable emptyMessage="No se encontraron productos" value={topTenMostSelled} rows={10} responsiveLayout="scroll">
                        <Column body={photoBodyTemplate} header="Foto" style={{ width: "35%" }}></Column>
                        <Column field="name" header="Nombre" style={{ width: "35%" }} />
                        <Column field="price" header="Precio" style={{ width: "35%" }} />
                        <Column field="sold_units" header="Unidades vendidas" style={{ width: "15%" }} />
                    </DataTable>
                </div>
                <div className="card">
                    <h5>Top 10 de los productos menos vendidos</h5>
                    <div className="field col-12 md:col-4">
                        <Calendar id="monthpicker" value={topTenLessDate} placeholder="Seleccione un mes" locale="es" onChange={(e) => setTopTenLessDate(e.value)} view="month" dateFormat="mm/yy" />
                    </div>
                    <DataTable value={topTenLessSold} rows={10} responsiveLayout="scroll" emptyMessage="No se encontraron productos">
                        <Column body={photoBodyTemplate} header="Foto" style={{ width: "35%" }}></Column>
                        <Column field="name" header="Nombre" style={{ width: "35%" }} />
                        <Column field="price" header="Precio" style={{ width: "35%" }} />
                        <Column field="sold_units" header="Unidades vendidas" style={{ width: "15%" }} />
                    </DataTable>
                </div>
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Ingresos mensuales por año</h5>
                    <div className="field col-12 md:col-4">
                        <Calendar id="yearpicker" value={monthlyIncomeDate} onChange={(e) => setMonthlyIncomeDate(e.value)} view="year" dateFormat="yy" />
                    </div>

                    <Chart type="bar" data={lineData} options={lineOptions} />
                </div>
                <div className="card">
                    <h5>Ventas diarias</h5>
                    <div>
                        <Calendar id="basic" value={dailyDate} onChange={(e) => setDailyDate(e.value)} />
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
