import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export const buttonBodyTemplate = (rowData) => {
    return (
        <div className="button-column">
            <Link to={"/pages/EditUsers/EditUsers"}>
                <Button icon=" pi pi-user-edit" className="p-button-info" />
            </Link>
            <div className="form-check form-switch button-column">
                <input className="form-check-input p-button-info" type="checkbox" id="flexSwitchCheckDefault" />
            </div>

            <Button icon=" pi pi-circle" className="p-button-danger " />
        </div>
    );
};
