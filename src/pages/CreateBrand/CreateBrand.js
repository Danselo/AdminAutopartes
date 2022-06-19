import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

export default function CreateBrand() {
    const accept = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Marca creada exitosamente", life: 3000 });
    };
   
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    
    const confirm1 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta Marca?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            accept,
            reject,
        });
    };

    const confirm2 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept,
            reject,
        });
    };
   
    const toast = useRef(null);
    const [value2, setValue2] = useState("");
  


    // const [value, setValue] = useState("");



    
    

  


    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/pages/Brand/Brand"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="text-center">
                <h3>Agregar  Marca</h3>
            </div>
            
            <div className="create-product-form">
               
                <div className="row">
                    <div className="col-sm-12 pt-5">
                            <span className="p-float-label">
                            <InputText className="jjj" id="name" value={value2} onChange={(e) => setValue2(e.target.value)} />
                            <label htmlFor="text">Nombre Marca</label>
                        </span>
                    </div>
                    

                </div>
                
                
                

            </div>
            <div className="create-product-buttons">
                {/* <Button label="Crear" className="p-button-success" />
                <Link to={"/pages/Products/Products"}>
                    <Button label="Cancelar" className="p-button-danger" />
                </Link> */}
                <Button onClick={confirm1} icon="pi pi-check" label="Crear" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
