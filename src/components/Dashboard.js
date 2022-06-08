import React, { useState, useEffect } from "react";

import { Button } from "primereact/button";
import { Chart } from "primereact/chart";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { ProductService } from "../service/ProductService";

const lineData = {
    labels: ["February", "March", "April", "May", "June", "July"],
    datasets: [
        {
            label: "First Dataset",
            data: [65, 59, 80, 81, 56, 55, 40],
            fill: false,
            backgroundColor: "#2f4860",
            borderColor: "#2f4860",
            tension: 0.4,
        },
        {
            label: "Second Dataset",
            data: [28, 48, 40, 19, 86, 27, 90],
            fill: false,
            backgroundColor: "#00bb7e",
            borderColor: "#00bb7e",
            tension: 0.4,
        },
    ],
};

const Dashboard = (props) => {
    const [products, setProducts] = useState(null);
    // const menu1 = useRef(null);
    // const menu2 = useRef(null);
    const [lineOptions, setLineOptions] = useState(null);

    const applyLightTheme = () => {
        const lineOptions = {
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

        setLineOptions(lineOptions);
    };

    const applyDarkTheme = () => {
        const lineOptions = {
            plugins: {
                legend: {
                    labels: {
                        color: "#ebedef",
                    },
                },
            },
            scales: {
                x: {
                    ticks: {
                        color: "#ebedef",
                    },
                    grid: {
                        color: "rgba(160, 167, 181, .3)",
                    },
                },
                y: {
                    ticks: {
                        color: "#ebedef",
                    },
                    grid: {
                        color: "rgba(160, 167, 181, .3)",
                    },
                },
            },
        };

        setLineOptions(lineOptions);
    };

    useEffect(() => {
        const productService = new ProductService();
        productService.getProductsSmall().then((data) => setProducts(data));
    }, []);

    useEffect(() => {
        if (props.colorMode === "light") {
            applyLightTheme();
        } else {
            applyDarkTheme();
        }
    }, [props.colorMode]);

    const formatCurrency = (value) => {
        return value.toLocaleString("en-US", { style: "currency", currency: "USD" });
    };

    return (
        <div className="grid">
            <div className="col-12 lg:col-6 xl:col-3">
                <div className="card mb-0">
                    <div className="flex justify-content-between mb-3">
                        <div>
                            <span className="block text-500 font-medium mb-3">Total de ventas</span>
                            <div className="text-900 font-medium text-xl">152</div>
                        </div>
                        <div className="flex align-items-center justify-content-center bg-blue-100 border-round" style={{ width: "2.5rem", height: "2.5rem" }}>
                            <i className="pi pi-shopping-cart text-blue-500 text-xl" />
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
            </div>

            <div className="col-12 xl:col-6">
                <div className="card">
                    <h5>Ventas</h5>
                    <Chart type="line" data={lineData} options={lineOptions} />
                </div>
            </div>
        </div>
    );
};

const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname && prevProps.colorMode === nextProps.colorMode;
};

export default React.memo(Dashboard, comparisonFn);
