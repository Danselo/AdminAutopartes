import React, { useState, useRef, useEffect } from "react";
import "./products.css";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { TableProducts } from "../../components/TableProducts/TableProducts";
import { Dialog } from "primereact/dialog";
import { Toast } from "primereact/toast";
import { confirmDialog } from "primereact/confirmdialog";
import { Toolbar } from "primereact/toolbar";
import { Dropdown } from "primereact/dropdown";
import { CategoryService } from "./../../service/CategoryService";
import { ProductService } from "../../service/ProductService";
import { ProductsBrandsService } from "../../service/ProductsBrandsService";
import { VehicleService } from "../../service/VehicleService";
import { PickList } from "primereact/picklist";
import { FileUpload } from "primereact/fileupload";
import { ProgressBar } from 'primereact/progressbar';
import { Tag } from 'primereact/tag';
import config from "../../config/config";

const uploadProductImageURL = config.baseURL + "/imagesProducts/create";

const _categoryService = new CategoryService();
const _productService = new ProductService();
const _vehicleService = new VehicleService();
const _productsBrandsService = new ProductsBrandsService();

export default function Products() {
    const [productSelected, setProductSelected] = useState({});
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [productName, setProductName] = useState("");
    const [productDescription, setProductDescription] = useState("");
    const [productReferenceId, setProductReferenceId] = useState("");
    const [selectedProductCategory, setSelectedProductCategory] = useState("");
    const [selectedProductBrand, setSelectedProductBrand] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [selectedVehiclesOfProductEdit, setSelectedVehiclesOfProductEdit] = useState([]);
    const [totalSize, setTotalSize] = useState(0);
    const fileUploadRef = useRef(null);
    const chooseOptions = {icon: 'pi pi-fw pi-images', iconOnly: true, className: 'custom-choose-btn p-button-rounded p-button-outlined'};
    const uploadOptions = {icon: 'pi pi-fw pi-cloud-upload', iconOnly: true, className: 'custom-upload-btn p-button-success p-button-rounded p-button-outlined'};
    const cancelOptions = {icon: 'pi pi-fw pi-times', iconOnly: true, className: 'custom-cancel-btn p-button-danger p-button-rounded p-button-outlined'};

    const onTemplateUpload = (e) => {
        let _totalSize = 0;
        e.files.forEach((file) => {
            _totalSize += file.size || 0;
        });

        setTotalSize(_totalSize);
        toast.current.show({ severity: "info", summary: "Success", detail: "File Uploaded" });
    };

    const onTemplateSelect = (e) => {
        console.log(e)
        let _totalSize = totalSize;
        e.files.forEach((file) => {
            _totalSize += file.size;
        });

        setTotalSize(_totalSize);
    };
    const onTemplateClear = () => {
        setTotalSize(0);
    };

    const headerTemplate = (options) => {
        const { className, chooseButton, uploadButton, cancelButton } = options;
        const value = totalSize/10000;
        const formatedValue = fileUploadRef && fileUploadRef.current ? fileUploadRef.current.formatSize(totalSize) : '0 B';

        return (
            <div className={className} style={{backgroundColor: 'transparent', display: 'flex', alignItems: 'center'}}>
                {chooseButton}
                {uploadButton}
                {cancelButton}
                <ProgressBar value={value} displayValueTemplate={() => `${formatedValue} / 1 MB`} style={{width: '300px', height: '20px', marginLeft: 'auto'}}></ProgressBar>
            </div>
        );
    }
    const onTemplateRemove = (file, callback) => {
        setTotalSize(totalSize - file.size);
        callback();
    }

    const itemTemplate = (file, props) => {
        return (
            <div className="flex align-items-center flex-wrap">
                <div className="flex align-items-center" style={{width: '40%'}}>
                    <img alt={file.name} role="presentation" src={file.objectURL} width={100} />
                    <span className="flex flex-column text-left ml-3">
                        {file.name}
                        <small>{new Date().toLocaleDateString()}</small>
                    </span>
                </div>
                <Tag value={props.formatSize} severity="warning" className="px-3 py-2" />
                <Button type="button" icon="pi pi-times" className="p-button-outlined p-button-rounded p-button-danger ml-auto" onClick={() => onTemplateRemove(file, props.onRemove)} />
            </div>
        )
    }

    const emptyTemplate = () => {
        return (
            <div className="flex align-items-center flex-column">
                <i className="pi pi-image mt-3 p-5" style={{'fontSize': '5em', borderRadius: '50%', backgroundColor: 'var(--surface-b)', color: 'var(--surface-d)'}}></i>
                <span style={{'fontSize': '1.2em', color: 'var(--text-color-secondary)'}} className="my-5">Drag and Drop Image Here</span>
            </div>
        )
    }

    const customBase64Uploader = async (event) => {
        // convert file to base64 encoded
        const file = event.files[0];
        const reader = new FileReader();
        let blob = await fetch(file.objectURL).then(r => r.blob()); //blob:url
        reader.readAsDataURL(blob);
        reader.onloadend = function () {
            const base64data = reader.result;
            console.log("hola", base64data);
        }
    }



    let arraySelectedVehiclesOfProductEdit = selectedVehiclesOfProductEdit.map((objeto) => {
        if (objeto.idVehicle) {
            let idVehicle = objeto.idVehicle;

            return { idProduct: productSelected.id, idVehicle: idVehicle };
        }

        return { idProduct: productSelected.id, idVehicle: objeto.id };
    });

    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-trash" onClick={() => onClickDialogEdit()} disabled={!productSelected.name} />
        </React.Fragment>
    );
    const rightContents = (
        <React.Fragment>            
            <Button 
            label={productSelected.state ? "Desactivar": "Activar"} 
            className={productSelected.state? "p-button-raised p-button-warning dc-space-between" : "p-button-raised p-button-success dc-space-between"}
            disabled = {!productSelected.name}
            icon={productSelected.state? "pi pi-eye-slash": "pi pi-eye"} 
            onClick={() => changeProductStatusDialog(productSelected)} />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createProductAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea agregar esta vehiculo?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateProduct(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editProductAlert = () => {
        confirmDialog({
            message: "¿Esta seguro que desea editar esta vehiculo?",
            header: "Confirmacion",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditProduct(),
            reject: () => setDisplayDialogEdit(false),
        });
    };

    const cancelCreate = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmacion",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => reject(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const changeProductStatusDialog = (productData) => {
        let productState
        if (productData.state === false) {
            productState = "activar"
        }else{
            productState = "desactivar"
        }

        confirmDialog({
            message: "¿Esta seguro que desea " + productState +" este producto?",
            header: "Cambio de estado del producto " + productData.id,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: productState,
            rejectLabel: "Cancelar",
            accept: () => changeProductStatus(productData),
            reject,
        });
    };

    const changeProductStatus = (productData) =>{
        let newState
        if (productData.state === false) {
            newState = true
            
        }else if(productData.state === true){
            newState = false
        }

        _productService.updateProduct({
            id: productData.id, 
            state: newState}).then((e) =>{
                loadProducts();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Cambio de estado exitoso", life: 3000 }); 
            }).catch((eror) =>{
                toast.current.show({ severity: "error", summary: "Error", detail: eror, life: 3000 });
            })

    }
    function onClickDialogCreate() {
        getBrands();
        getCategories();
        setDisplayDialogCreate(true);
    }

   

    function onClickDialogEdit() {
        getVehiclesOfProductSelected(productSelected.id);
        getCategories();
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = () => {
        editProductAlert();
        setDisplayDialogEdit(false);
    };

    const onHideDialogCreate = () => {
        createProductAlert();
        setDisplayDialogCreate(false);
    };
    const onHideDialogCreateX = () => {
        setDisplayDialogCreate(false);
    };
    const onHideDialogEditX = () => {
        setDisplayDialogEdit(false);
    };
    const onHideDialogCancel = () => {
        cancelCreate();
        setDisplayDialogCreate(false);
    };

    const onHideDialogCancelEdit = () => {
        cancelCreate();
        setDisplayDialogEdit(false);
    };

    const onProductCategoryChange = (e) => {
        setSelectedProductCategory(e.value);
    };
    const onProductBrandChange = (e) => {
        setSelectedProductBrand(e.value);
    };

    function getCategories() {
        _categoryService.getCategories().then((response) => {
            setCategories(response);
        });
    }

    function getBrands() {
        _productsBrandsService.getProductsBrands().then((response) => {
            setBrands(response);
        });
    }

    function getVehiclesOfProductSelected(idProductSelected) {
        console.log(idProductSelected);
        _productService.getVehiclesOfProductById(idProductSelected).then((response) => {
            let unSelectedVehicles = vehicles.filter((v) => !response.some((v2) => v2.idVehicle === v.id));
            setVehicles(unSelectedVehicles);
            setSelectedVehiclesOfProductEdit(response);
        });
    }

    function EditProduct() {
        let id = productSelected.id;
        _productService
            .updateProduct(productSelected)
            .then(() => {
                console.log(productSelected.id);
                console.log(arraySelectedVehiclesOfProductEdit);
                _productService.updateVehiclesOfProduct(id, arraySelectedVehiclesOfProductEdit).then(() => {
                    setProductSelected({});
                    loadProducts();
                    loadVehicles();
                    toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Producto editado exitosamente", life: 3000 });
                });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    function CreateProduct() {
        _productService
            .createProduct(productReferenceId, productName, productDescription, selectedProductCategory.id, selectedProductBrand.id)
            .then(() => {
                selectedVehicles.forEach((vehicle) => {
                    _productService
                        .addVehicleToProduct(productReferenceId, vehicle.id)
                        .then(() => {
                            console.log("Se agrego el vehiculo");
                        })
                        .catch((e) => {
                            console.log("Algo salio mal al agregar un vehiculo");
                        });
                });
                setProductName("");
                loadProducts();
                toast.current.show({ severity: "success", summary: "Confirmacion", detail: "Categoria creada exitosamente", life: 3000 });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    const loadProducts = () => {
        _productService.getProducts().then((response) => {
            setProducts(response);
        });
    };
    const loadVehicles = () => {
        _vehicleService.getVehicles().then((data) => setVehicles(data));
    };

    const onChangeProductSelectedEditForm = (eventOnChange) => {
        console.log(eventOnChange.target);
        const productUpdated = {
            ...productSelected,
            [eventOnChange.target.name]: eventOnChange.target.value,
        };
        console.log(productUpdated);
        setProductSelected(productUpdated);
    };
    useEffect(() => {
        _productService.getProducts().then((response) => {
            setProducts(response);
        });
    }, []);

    useEffect(() => {
        _vehicleService.getVehicles().then((data) => setVehicles(data));
    }, []);

    const onChange = (event) => {
        setVehicles(event.source);
        setSelectedVehicles(event.target);
    };

    const onChangeEdit = (event) => {
        setVehicles(event.source);
        setSelectedVehiclesOfProductEdit(event.target);
    };

    const vehicleTemplate = (item) => {
        return (
            <div className="vehicle-item">
                <p>
                    {item.name} {item.model} <strong>{item.brands_vehicles.name}</strong>
                </p>
            </div>
        );
    };
    const vehicleTemplateEditForm = (item) => {
        return (
            <div className="vehicle-item">
                {item.vehicles ? (
                    <p>
                        {item.vehicles.name} {item.vehicles.model} <strong>{item.vehicles.brands_vehicles.name}</strong>
                    </p>
                ) : (
                    <p>
                        {item.name} {item.model} <strong>{item.brands_vehicles.name}</strong>
                    </p>
                )}
            </div>
        );
    };
    const renderFooterDialog = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancel()} className="p-button-text" />
                <Button label="Crear vehiculo" icon="pi pi-check" onClick={() => onHideDialogCreate()} autoFocus />
            </div>
        );
    };

    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                <Button label="Editar producto" icon="pi pi-check" onClick={() => onHideDialogEdit()} autoFocus />
            </div>
        );
    };
    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Productos registrados</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear un nuevo producto" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} footer={renderFooterDialog()}>
                <div className="create-product-form">
                    <FileUpload
                        ref={fileUploadRef}
                        name="demo[]"
                        url= {uploadProductImageURL}
                        multiple
                        accept="image/*"
                        maxFileSize={1000000}
                        onUpload={onTemplateUpload}
                        onSelect={onTemplateSelect}
                        onError={onTemplateClear}
                        onClear={onTemplateClear}
                        headerTemplate={headerTemplate}
                        itemTemplate={itemTemplate}
                        emptyTemplate={emptyTemplate}
                        chooseOptions={chooseOptions}
                        uploadOptions={uploadOptions}
                        cancelOptions={cancelOptions}
                        customUpload
                        uploadHandler={customBase64Uploader}
                    />
                    <h5>Ingrese los datos del nuevo producto</h5>
                    <InputText value={productReferenceId} onChange={(e) => setProductReferenceId(e.target.value)} placeholder="Referencia del producto" className="create-product-form__input" />
                    <InputText value={productName} onChange={(e) => setProductName(e.target.value)} placeholder="Nombre del producto" className="create-product-form__input" />
                    <InputText value={productDescription} onChange={(e) => setProductDescription(e.target.value)} placeholder="Descripcion del producto" className="create-product-form__input" />
                    <Dropdown value={selectedProductCategory} options={categories} onChange={onProductCategoryChange} optionLabel="name" placeholder="Categoria del producto" className="create-product-form__dropdown" />
                    <Dropdown value={selectedProductBrand} options={brands} onChange={onProductBrandChange} optionLabel="name" placeholder="Marca del producto" className="create-product-form__dropdown" />
                    <h5>Seleccione los vehiculos compatibles con el producto</h5>
                    <div className="picklist-vehicles">
                        <div className="card">
                            <PickList
                                source={vehicles}
                                target={selectedVehicles}
                                itemTemplate={vehicleTemplate}
                                sourceHeader="Vehiculos"
                                targetHeader="Seleccionados"
                                sourceStyle={{ height: "342px" }}
                                targetStyle={{ height: "342px" }}
                                onChange={onChange}
                                filterBy="name"
                                sourceFilterPlaceholder="Buscar"
                                targetFilterPlaceholder="Buscar"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>

            <Dialog header="Editar producto" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} footer={renderFooterDialogEdit()}>
                <div className="create-product-form">
                    <h5>Ingrese los datos del nuevo producto</h5>

                    <InputText value={productSelected.id} onChange={onChangeProductSelectedEditForm} name="id" placeholder="Nueva referencia del producto" className="create-product-form__input" />
                    <InputText value={productSelected.name} onChange={onChangeProductSelectedEditForm} name="name" placeholder="Nuevo nombre del producto" className="create-product-form__input" />
                    <InputText value={productSelected.description} onChange={onChangeProductSelectedEditForm} name="description" placeholder="Nueva descripcion del producto" className="create-product-form__input" />

                    <Dropdown value={productSelected.idCategory} options={categories} onChange={onChangeProductSelectedEditForm} optionLabel="name" placeholder="Categoria del producto" className="create-product-form__dropdown" />
                    <h5>Edicion de vehiculos compatibles con el producto</h5>
                    <div className="picklist-vehicles">
                        <div className="card">
                            <PickList
                                source={vehicles}
                                target={selectedVehiclesOfProductEdit}
                                itemTemplate={vehicleTemplateEditForm}
                                targetItemTemplate={vehicleTemplateEditForm}
                                sourceHeader="Vehiculos"
                                targetHeader="Seleccionados"
                                sourceStyle={{ height: "342px" }}
                                targetStyle={{ height: "342px" }}
                                onChange={onChangeEdit}
                                filterBy="name"
                                sourceFilterPlaceholder="Buscar"
                                targetFilterPlaceholder="Buscar"
                            />
                        </div>
                    </div>
                </div>
            </Dialog>

            <TableProducts className="table-products" products={products} setProductSelected={setProductSelected} />
        </div>
    );
}
