import React from "react";
// import { InputSwitch } from "primereact/inputswitch";
import { Button } from "primereact/button";

export const buttonBodyTemplate = () => {
    // const [checked1, setChecked1] = useState(true);
    return (
        <div className="button-column">
            <Button icon="pi pi-pencil" className="p-button-secondary" />
            <Button icon="pi pi-eye" className="p-button-info" />
            <Button icon="pi pi-eye-slash" />
            {/* <InputSwitch checked={checked1} onChange={(e) => setChecked1(e.value)} /> */}
        </div>
    );
};
