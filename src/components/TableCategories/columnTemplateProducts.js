import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export const buttonBodyTemplate2 = (rowData) => {
   
    return (
        <div className="button-column p-0">
             
            <Link to={"/pages/Products/Products"}>
            <Button label="Productos"  className="p-button-raised. p-button-secondary"/>

            </Link>
       

        </div>
    );
};