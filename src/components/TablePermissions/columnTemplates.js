import React from "react";
import { Button } from "primereact/button";

export const buttonBodyTemplate = (rowData) => {
   
    return (
        <div className="button-column p-0">
            
            <Button  icon=" pi pi-trash" className="p-button-danger " />
       

        </div>
    );
};
