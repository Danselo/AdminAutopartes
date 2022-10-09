import React, { useState, useEffect } from "react";
import { Button } from "primereact/button";
import "./sales.css";
import { Link } from "react-router-dom";
import { TableSales } from "../../components/TableSales/TableSales";
import { SaleService } from "../../service/SaleService";

const _saleService = new SaleService();

export default function Sales() {
    const [sales, setSales] = useState([]);
    const [saleSelected, setSaleSelected] = useState({});


    useEffect(() => {
        _saleService.getSales().then((response) => {
            setSales(response);
        });
    }, []);
    
    return (
        <div>
            <div className="text-center">
                <h3>Gestión de ventas</h3>
            </div>
            <Link to={"/CreateSales"}>
                <Button label="Crear venta" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>           
            <TableSales sales={sales} setSaleSelected={setSaleSelected} className="table-products" />
        </div>
    );
}
