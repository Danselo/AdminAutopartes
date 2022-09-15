import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import axios from 'axios'

const url = 'http://localhost:5000/brands/create'

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
            accept: () => createBrand() ,
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
    const [brandName, setBrandName] = useState("");
    // const [newBrandData, setNewBrandData] = useState(null)
  
    function createBrand() {
        axios
          .post(url, {
            name: brandName,           
          })
          .then((response) => {
            setBrandName(response.data);
          });
      }
    

    // const [value, setValue] = useState("");

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/Brand"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="text-center">
                <h3>Agregar  Marca</h3>
            </div>           
            <div className="create-brand-form">              
                <div className="row">
                    <div className="col-sm-12 pt-5">
                            <span className="p-float-label">
                            <InputText className="brand--name" id="name" value={brandName} onChange={(e) => setBrandName(e.target.value)} />
                            <label htmlFor="name">Nombre Marca</label>
                        </span>
                    </div>
                </div>
            </div>
            <div className="create-product-buttons">
                <Button onClick={confirm1} icon="pi pi-check" label="Crear" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
