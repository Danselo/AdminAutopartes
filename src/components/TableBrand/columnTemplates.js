import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export const buttonBodyTemplate = (rowData) => {
   
    return (
        <div className="button-column p-0">
             {/* <div className="form-check form-switch button-column">
            <input className="form-check-input p-button-info" type="checkbox" id="flexSwitchCheckDefault"/>
        </div> */}

            <Link to={"/pages/EditBrand/EditBrand"}>
            <Button icon=" pi pi-pencil" className="p-button-info" />
            </Link>
            <Button icon=" pi pi-trash" className="p-button-danger" />
            <div className="form-check form-switch button-column ">
            <input className="form-check-input p-button-info" type="checkbox" id="flexSwitchCheckDefault"/>
        </div>
       

        </div>
    );
};
