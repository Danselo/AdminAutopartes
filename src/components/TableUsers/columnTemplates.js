import React from "react";
import { Button } from "primereact/button";
import { InputSwitch } from 'primereact/inputswitch';
import { ToggleButton } from 'primereact/togglebutton';

export const buttonBodyTemplate = (rowData) => {
   
    return (
        <div className="button-column">
            <Button icon=" pi pi-user-edit" className="p-button-info" />
            <Button icon=" pi pi-circle" className="p-button-danger " />

        </div>
    );
};
