import React from "react";
// import { InputSwitch } from "primereact/inputswitch";

import { Link } from "react-router-dom";

export const buttonBodyTemplate = () => {
    // const [checked1, setChecked1] = useState(true);
    return (
        <div className="button-column">
            <Link to={"/SalesDetails"}>
                <i className="pi pi-print"></i>
            </Link>
            <Link to={"/SalesDetails"}>
                <i className="pi pi-eye"></i>
            </Link>
            {/* <InputSwitch checked={checked1} onChange={(e) => setChecked1(e.value)} /> */}
        </div>
    );
};
