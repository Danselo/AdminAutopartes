import React from "react";
// import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";

export const buttonBodyTemplate = () => {
    // const [checked1, setChecked1] = useState(true);
    return (
        <div className="button-column">
            <Button label="Ver detalle" className="p-button-secondary" />

            {/* <InputSwitch checked={checked1} onChange={(e) => setChecked1(e.value)} /> */}
        </div>
    );
};