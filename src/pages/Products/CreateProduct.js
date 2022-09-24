import React, { useState, useRef,useEffect } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import { InputText } from "primereact/inputtext";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { FileUpload } from "primereact/fileupload";
import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import "./createProduct.css";
import axios from 'axios'
import { ProductService } from "../../service/ProductService";

const urlCategories = 'http://localhost:5000/categories/'
const urlVehicles = 'http://localhost:5000/vehicles'

export default function CreateProduct() {

    const _productService = new ProductService();

    const acceptModalConfirmation = (lifeTime) => {
       
    };

    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
  
    const createProductConfirmation = () => {
        confirmDialog({
            message: "¿Esta seguro que desea crear este producto?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            accept: createProduct,
            reject,
        });
    };

    const confirm2 = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            accept : acceptModalConfirmation,
            reject,
        });
    };
    const onBasicUpload = () => {
        toast.current.show({ severity: "info", summary: "Success", detail: "File Uploaded with Basic Mode" });
    };
    const toast = useRef(null);
    const [selectedVehicle, setSelectedVehicle] = useState([null]);
    const [selectedCategory, setSelectedCategory] = useState(null);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [vehicles, setVehicles] = useState([]);
    const [categories, setCategories] = useState([]);
    
    useEffect(() => {
        axios.get(urlVehicles).then((response) => {
            setVehicles(response.data);    
        });    
        axios.get(urlCategories).then((response) => {
            setCategories(response.data);    
        });
    }, []);

    const onVehicleChange = (e) => {
        setSelectedVehicle(e.value);
    };
    const onCategoriesChange = (e) => {
        setSelectedCategory(e.value);
    };

    function createProduct() {
        _productService.createProduct(productName, productDescription, selectedVehicle.id, selectedCategory.id )
        .then((data) => {
            const lifeTime = 3000;
            toast.current.show({ severity: "info", summary: "Confirmacion", detail: "Producto creado exitosamente", life: lifeTime });
            setTimeout(() => {
               console.log('Redirigiendo a otra pagina') 
            }, lifeTime);
            console.log('product created successfully', data);
        })      
        .catch(console.error);
      }
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
                    <InputText className="jjj" id="username" value={productName} onChange={(e) => setProductName(e.target.value)} />
                    <label htmlFor="username">Nombre producto</label>
                </span>

                <Dropdown value={selectedVehicle} options={vehicles} onChange={onVehicleChange} optionLabel="name" placeholder="Seleccione vehiculo" />
                <Dropdown value={selectedCategory} options={categories} onChange={onCategoriesChange} optionLabel="name" placeholder="Seleccione categoria" />
                <InputTextarea rows={5} cols={30} value={productDescription} onChange={(e) => setProductDescription(e.target.value)} />
            </div>
            <div className="create-product-buttons">
                <Button onClick={createProductConfirmation} icon="pi pi-check" label="Crear" className="mr-2"></Button>
                <Button onClick={confirm2} icon="pi pi-times" label="Cancelar"></Button>
            </div>
        </div>
    );
}
