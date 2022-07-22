import React from "react";
// import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import "./dataTableHistorySales.css";

export const buttonBodyTemplate = () => {
    // const [checked1, setChecked1] = useState(true);
    return (
        <div className="btn_history_sales_view_detail">
            <Link to={"/HistorySalesDetails"}>
                <Button label="Ver detalle" className="p-button-secondary " />
            </Link>
            {/* <InputSwitch checked={checked1} onChange={(e) => setChecked1(e.value)} /> */}
        </div>
    );
};
