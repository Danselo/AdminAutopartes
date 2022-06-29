import React, { useState, useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createProduct.css";

export default function CreateProduct() {
    const accept = () => {
        toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Producto creado exitosamente", life: 3000 });
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
  
    const confirm1 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear este producto?",
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
    const onBasicUpload = () => {
        toast.current.show({ severity: "info", summary: "Success", detail: "File Uploaded with Basic Mode" });
    };
    const toast = useRef(null);
    const [value2, setValue2] = useState("");
    const [value, setValue] = useState("");

    const [selectedBrand, setSelectedBrand] = useState(null);
    const [selectedCategory, setSelectedCategory] = useState(null);

    const brands = [
        { name: "Ford", code: "FD" },
        { name: "Toyota", code: "TY" },
        { name: "Honda", code: "HD" },
        { name: "Kia", code: "KA" },
        { name: "Chevrolet", code: "CL" },
    ];
    const categories = [
        { name: "Baterias", code: "FD" },
        { name: "Aceites", code: "TY" },
        { name: "Empaques", code: "HD" },
        { name: "Tornilleria", code: "KA" },
        { name: "Luces", code: "CL" },
    ];

    const onBrandChange = (e) => {
        setSelectedBrand(e.value);
    };

    const onCategoriesChange = (e) => {
        setSelectedCategory(e.value);
    };

    return (
        <div>
            <Toast ref={toast} />
            <ConfirmDialog />
            <Link to={"/pages/Products/Products"}>
                <Button label="Regresar" icon="pi pi-angle-left" className="p-button-sm p-button-danger" />
            </Link>
            <div className="create-product-tittle">
                <h3>Crear un nuevo producto</h3>
            </div>
            <div className="create-product-upload-img">
                <p>Cargar imagen del producto</p>
                <FileUpload mode="basic" name="demo[]" url="https://primefaces.org/primereact/showcase/upload.php" accept="image/*" maxFileSize={1000000} onUpload={onBasicUpload} />
            </div>
            <div className="create-product-form">
                <span className="p-float-label">
                    <InputText className="jjj" id="username" value={value2} onChange={(e) => setValue2(e.target.value)} />
                    <label htmlFor="username">Nombre producto</label>
                </span>

                <Dropdown value={selectedBrand} options={brands} onChange={onBrandChange} optionLabel="name" placeholder="Seleccione marca" />
                <Dropdown value={selectedCategory} options={categories} onChange={onCategoriesChange} optionLabel="name" placeholder="Seleccione categoria" />
                <InputTextarea rows={5} cols={30} value={value} onChange={(e) => setValue(e.target.value)} />
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
