import React from "react";
// import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export const buttonBodyTemplate = () => {
    // const [checked1, setChecked1] = useState(true);
    return (
        <div className="button-column">
            <Link to={"/SalesDetails"}>
                <Button label="Ver detalle" className="p-button-secondary" />
            </Link>
            {/* <InputSwitch checked={checked1} onChange={(e) => setChecked1(e.value)} /> */}
        </div>
    );
};
