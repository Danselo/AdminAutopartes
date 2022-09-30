import React, { useState, useRef, useEffect } from "react";
import { Button } from "primereact/button";
import "./buys.css";
import { Link } from "react-router-dom";
import { TableBuys } from "../../components/TableBuys/TableBuys";
import { BuyService } from "../../service/BuyService";

const _buyService = new BuyService();

export default function Buys() {
    const [buys, setBuys] = useState([]);
    const [buySelected, setBuySelected] = useState({});


    useEffect(() => {
        _buyService.getBuys().then((response) => {
            setBuys(response);
        });
    }, []);
    
    return (
        <div>
            <div className="text-center">
                <h3>Gestión de compras</h3>
            </div>
            <Link to={"/CreatePurchase"}>
                <Button label="Crear compra" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>           
            <TableBuys buys={buys} setBuySelected={setBuySelected} className="table-products" />
        </div>
    );
}
