import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";

export const buttonBodyTemplate = (rowData) => {
   
    return (
        <div className="button-column">
             <div className="row">
                <div className="col-6">
                            <div className="form-check form-switch button-column">
                        <input className="form-check-input p-button-info" type="checkbox" id="flexSwitchCheckDefault"/>
                    </div>
                </div>
                <div className="col-6">
                        <Link to={"/pages/EditUsers/EditUsers"}>
                    <Button icon=" pi pi-pencil" className="p-button-info" />
                    </Link>
                </div>
                

             </div>
            
           
       

        </div>
    );
};
