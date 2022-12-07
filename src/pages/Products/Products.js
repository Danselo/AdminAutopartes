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
import { InputTextarea } from "primereact/inputtextarea";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";
import config from "../../config/config";
import { ImageProductService } from "../../service/ImageProductService";
const _imageProductService = new ImageProductService();
const _categoryService = new CategoryService();
const _productService = new ProductService();
const _vehicleService = new VehicleService();
const _productsBrandsService = new ProductsBrandsService();

export default function Products() {
    const [productSelected, setProductSelected] = useState({});
    const [displayDialogCreate, setDisplayDialogCreate] = useState(false);
    const [displayDialogUploadImages, setDisplayDialogUploadImages] = useState(false);
    const [displayDialogEditUploadImages, setDisplayDialogEditUploadImages] = useState(false);
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);
    const toast = useRef(null);
    const [productReferenceId, setProductReferenceId] = useState("");
    const [products, setProducts] = useState([]);
    const [categories, setCategories] = useState([]);
    const [brands, setBrands] = useState([]);
    const [vehicles, setVehicles] = useState([]);
    const [selectedVehicles, setSelectedVehicles] = useState([]);
    const [selectedVehiclesOfProductEdit, setSelectedVehiclesOfProductEdit] = useState([]);
    const [imagesData, setImagesData] = useState({});

    const onUpload = () => {
        toast.current.show({ severity: "info", summary: "Success", detail: "Archivo cargado" });
        setDisplayDialogUploadImages(false);
        setDisplayDialogEditUploadImages(false);
        setProductSelected({});
        loadProducts();
    };

    let arraySelectedVehiclesOfProductEdit = selectedVehiclesOfProductEdit.map((objeto) => {
        if (objeto.idVehicle) {
            let idVehicle = objeto.idVehicle;

            return { idProduct: productSelected.id, idVehicle: idVehicle };
        }

        return { idProduct: productSelected.id, idVehicle: objeto.id };
    });

    useEffect(() => {
        _imageProductService.getImages().then((images) => {
            let imagesDataAux = {};
            images.forEach((image) => {
                imagesDataAux[image.idProduct] = image.url;
            });
            setImagesData(imagesDataAux);
        });
    }, []);
    const leftContents = (
        <React.Fragment>
            <Button label="Registrar" className="p-button-raised dc-space-between" icon="pi pi-plus-circle" onClick={() => onClickDialogCreate()} />
            <Button label="Editar" className="p-button-raised p-button-info dc-space-between" icon="pi pi-pencil" onClick={() => onClickDialogEdit()} disabled={!productSelected.name} />
        </React.Fragment>
    );
    const rightContents = (
        <React.Fragment>
            <Button
                label={productSelected.state ? "Desactivar" : "Activar"}
                className={productSelected.state ? "p-button-raised p-button-warning dc-space-between" : "p-button-raised p-button-success dc-space-between"}
                disabled={!productSelected.name}
                icon={productSelected.state ? "pi pi-eye-slash" : "pi pi-eye"}
                onClick={() => changeProductStatusDialog(productSelected)}
            />
        </React.Fragment>
    );
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };
    const createProductAlert = (data, form) => {
        confirmDialog({
            message: "¿Está seguro que desea crear este producto?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Crear",
            rejectLabel: "Cancelar",
            accept: () => CreateProduct(data, form),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const editProductAlert = (data, form) => {
        confirmDialog({
            message: "¿Está seguro que desea editar este producto?",
            header: "Confirmación",
            icon: "pi pi-exclamation-triangle",
            acceptLabel: "Editar",
            rejectLabel: "Cancelar",
            accept: () => EditProduct(data, form),
            reject: () => setDisplayDialogEdit(false),
        });
    };

    const cancelCreate = () => {
        confirmDialog({
            message: "¿Está seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => reject(),
            reject: () => setDisplayDialogCreate(true),
        });
    };

    const changeProductStatusDialog = (productData) => {
        let productState;
        if (productData.state === false) {
            productState = "activar";
        } else {
            productState = "desactivar";
        }

        confirmDialog({
            message: "¿Está seguro que desea " + productState + " este producto?",
            header: "Cambio de estado del producto " + productData.id,
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: productState,
            rejectLabel: "Cancelar",
            accept: () => changeProductStatus(productData),
            reject,
        });
    };

    const changeProductStatus = (productData) => {
        let newState;
        if (productData.state === false) {
            newState = true;
        } else if (productData.state === true) {
            newState = false;
        }

        _productService.changeStatusOfProduct(productData.id, { status: newState }).then((response) => {
            if (response.data == null) {
                loadProducts();
                toast.current.show({ severity: "error", summary: "No procede", detail: "Lo sentimos, pero no puede producto, porque la marca, categoría y/o vehículo asociados a este productos se encuentra desactivados", life: 9000 });
            } else {
                loadProducts();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Cambio de estado exitoso", life: 3000 });
            }
        });
    };
    console.log(selectedVehicles);
    function onClickDialogCreate() {
        getBrands();
        getCategories();
        setDisplayDialogCreate(true);
    }

    function onClickDialogEdit() {
        getVehiclesOfProductSelected(productSelected.id);
        getCategories();
        getBrands();
        setDisplayDialogEdit(true);
    }

    const onHideDialogEdit = (data, form) => {
        editProductAlert(data, form);
        setDisplayDialogEdit(false);
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
        _productService.getVehiclesOfProductById(idProductSelected).then((response) => {
            let unSelectedVehicles = vehicles.filter((v) => !response.some((v2) => v2.idVehicle === v.id));
            setVehicles(unSelectedVehicles);
            setSelectedVehiclesOfProductEdit(response);
        });
    }

    function EditProduct(data, form) {
        let id = productSelected.id;
        let productData = {
            id: data.productReferenceId,
            name: data.productName,
            description: data.productDescription,
            idCategory: data.selectedProductCategory.id,
            idBrand: data.selectedProductBrand.id,
        };
        _productService
            .updateProduct(productData)
            .then(() => {
                console.log(productSelected.id);
                console.log(arraySelectedVehiclesOfProductEdit);
                _productService.updateVehiclesOfProduct(id, arraySelectedVehiclesOfProductEdit).then(() => {
                    loadProducts();
                    loadVehicles();
                    setDisplayDialogEditUploadImages(true);

                    toast.current.show({ severity: "success", summary: "Confirmación", detail: "Producto editado exitosamente", life: 3000 });
                });
            })
            .catch((e) => {
                toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
                console.log(e);
            });
    }

    function CreateProduct(data, form) {
        let productData = {
            id: data.productReferenceId,
            name: data.productName,
            description: data.productDescription,
            idCategory: data.selectedProductCategory.id,
            idBrand: data.selectedProductBrand.id,
        };
        console.log(productData);

        _productService
            .createProduct(data.productReferenceId, data.productName, data.productDescription, data.selectedProductCategory.id, data.selectedProductBrand.id)
            .then(() => {
                setProductReferenceId(data.productReferenceId);
                setDisplayDialogUploadImages(true);
                selectedVehicles.forEach((vehicle) => {
                    if (!vehicle.status) {
                        _productService
                            .updateProduct({
                                id: data.productReferenceId,
                                state: false,
                            })
                            .then((e) => {
                                loadProducts();
                            })
                            .catch((error) => {
                                console.log(error);
                            });
                    }
                    _productService
                        .addVehicleToProduct(data.productReferenceId, vehicle.id)
                        .then(() => {
                            console.log("Se agrego el vehículo");
                        })
                        .catch((e) => {
                            console.log("Algo salio mal al agregar un vehículo");
                        });
                });

                loadProducts();
                toast.current.show({ severity: "success", summary: "Confirmación", detail: "Producto creado exitosamente", life: 3000 });
                setDisplayDialogCreate(false);
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
                <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialogUploadImages(false)} className="p-button-text" />
            </div>
        );
    };
    const renderFooterDialogEdit = () => {
        return (
            <div>
                <Button label="Cancelar" icon="pi pi-times" onClick={() => setDisplayDialogEditUploadImages(false)} className="p-button-text" />
            </div>
        );
    };

    const initialValues = {
        productReferenceId: "",
        productName: "",
        selectedProductCategory: "",
        selectedProductBrand: "",
        productDescription: "",
    };

    const initialValuesEdit = {
        productReferenceId: productSelected.id,
        productName: productSelected.name,
        selectedProductCategory: productSelected.category?.name,
        selectedProductBrand: productSelected.brand?.name,
        productDescription: productSelected.description,
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };

    const validate = (data) => {
        let errors = {};
        let validateExistingId = products.map((product) => {
            if (product.id === data.productReferenceId) {
                return true;
            } else {
                return false;
            }
        });
        if (selectedVehicles.length === 0) {
            errors.selectedVehicles = "Debe seleccionar al menos un vehiculo al producto.";
        }
        if (validateExistingId.includes(true)) {
            errors.productReferenceId = "El producto con referencia " + data.productReferenceId + " ya existe, ingrese una referencia diferente";
        }
        if (!data.productReferenceId) {
            errors.productReferenceId = "La referencia del producto es requerido.";
        }
        if (!data.productName) {
            errors.productName = "El nombre del producto es requerido.";
        }

        if (!data.selectedProductCategory) {
            errors.selectedProductCategory = "Debe seleccionar una categoría.";
        }

        if (!data.selectedProductBrand) {
            errors.selectedProductBrand = "Debe seleccionar una marca.";
        }
        if (!data.productDescription) {
            errors.productDescription = "La descripción del producto es requerido.";
        }

        return errors;
    };
    const validateEdit = (data) => {
        let errors = {};
        let validateExistingId = products.map((product) => {
            if (product.id === data.productReferenceId) {
                return true;
            } else {
                return false;
            }
        });
        if (validateExistingId.includes(true) && data.productReferenceId !== productSelected.id) {
            errors.productReferenceId = "El producto con referencia " + data.productReferenceId + " ya existe, ingrese una referencia diferente";
        }
        if (selectedVehiclesOfProductEdit.length === 0) {
            errors.selectedVehicles = "Debe seleccionar al menos un vehiculo al producto.";
        }
        if (!data.productReferenceId) {
            errors.productReferenceId = "La referencia del producto es requerido.";
        }
        if (!data.productName) {
            errors.productName = "El nombre del producto es requerido.";
        }

        if (!data.selectedProductCategory) {
            errors.selectedProductCategory = "Debe seleccionar una categoría.";
        }

        if (!data.selectedProductBrand) {
            errors.selectedProductBrand = "Debe seleccionar una marca.";
        }
        if (!data.productDescription) {
            errors.productDescription = "La descripción del producto es requerido.";
        }

        return errors;
    };
    const chooseOptions = { label: "Seleccionar imagen", icon: "pi pi-fw pi-images", className: "p-button-raised" };
    const uploadOptions = { label: "Guardar imagen", icon: "pi pi-fw pi-cloud-upload", className: "p-button-raised" };
    const uploadOptionsEdit = { label: "Editar imagen", icon: "pi pi-fw pi-cloud-upload", className: "p-button-raised" };
    const cancelOptions = { label: "Cancelar", icon: "pi pi-fw pi-times", className: "p-button-raised" };

    const photoBodyTemplate = (rowData, info) => {
        let classBool;
        if (!rowData.id) {
            return null;
        }
        if (info) {
            classBool = false;
        } else {
            classBool = true;
        }
        let url = imagesData[rowData.id];

        return <img src={`${config.baseURL}${url}`} onError={(e) => (e.target.src = `${config.baseURL}/public/images/no-pictures.png`)} alt={rowData.id} className={!classBool ? "product-image" : "info-image"} />;
    };

    return (
        <div>
            <Toast ref={toast} />
            <div></div>
            <div className="text-center">
                <h4>Productos registrados</h4>
            </div>

            <Toolbar left={leftContents} right={rightContents} />

            <Dialog header="Crear un nuevo producto" visible={displayDialogCreate} onHide={() => onHideDialogCreateX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }}>
                <div className="dc-create-product-form">
                    <h5>Ingrese los datos del nuevo producto</h5>
                    <p>Por favor diligencie todos los campos del formulario</p>
                    <Form
                        onSubmit={createProductAlert}
                        initialValues={initialValues}
                        validate={validate}
                        render={({ handleSubmit }) => (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <div className="create-product-form__grid">
                                        <Field
                                            name="productReferenceId"
                                            render={({ input, meta }) => (
                                                <div>
                                                    <span className="create-product-form__span">
                                                        <label htmlFor="productReferenceId" className={classNames({ "p-error": isFormFieldValid("productReferenceId"), "create-product-form__label": true })}>
                                                            Referencia*
                                                        </label>
                                                        <InputText id="productReferenceId" {...input} autoFocus className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__input": true })} placeholder="Referencia del producto" />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="productName"
                                            render={({ input, meta }) => (
                                                <div className="">
                                                    <span className="create-product-form__span">
                                                        <label htmlFor="productName" className={classNames({ "p-error": isFormFieldValid("productName") })}>
                                                            Nombre*
                                                        </label>
                                                        <InputText id="productName" {...input} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__input": true })} placeholder="Nombre del producto" />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="selectedProductCategory"
                                            render={({ input, meta }) => (
                                                <div className="">
                                                    <span className="create-product-form__span">
                                                        <label htmlFor="selectedProductCategory" className={classNames({ "p-error": isFormFieldValid("selectedProductCategory") })}>
                                                            Categoría*
                                                        </label>
                                                        <Dropdown id="selectedProductCategory" {...input} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__dropdown": true })} options={categories} optionLabel="name" placeholder="Categoria del producto" />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="selectedProductBrand"
                                            render={({ input, meta }) => (
                                                <div className="">
                                                    <span className="create-product-form__span">
                                                        <label htmlFor="selectedProductBrand" className={classNames({ "p-error": isFormFieldValid("selectedProductBrand") })}>
                                                            Marca*
                                                        </label>
                                                        <Dropdown id="selectedProductBrand" {...input} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__dropdown": true })} options={brands} optionLabel="name" placeholder="Marca del producto" />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <Field
                                        name="productDescription"
                                        render={({ input, meta }) => (
                                            <div className="create-product-form__InputTextarea">
                                                <span className="create-product-form__InputTextarea_span">
                                                    <label htmlFor="productDescription" className={classNames({ "p-error": isFormFieldValid("productDescription") })}>
                                                        Descripción*
                                                    </label>
                                                    <InputTextarea id="productDescription" {...input} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__input create-product-form__inputTextarea": true })} placeholder="Descripción del producto" />
                                                    {getFormErrorMessage(meta)}
                                                </span>
                                            </div>
                                        )}
                                    />

                                    <h5>Seleccione los vehículos compatibles con el producto</h5>
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
                                        {selectedVehicles.length > 0 ? <small className="p-success">Vehículo(s) seleccionado(s) exitosamente</small> : <small className="p-error">*Debe seleccionar al menos un vehículo</small>}
                                    </div>
                                    <div className="create-product-buttons-form">
                                        <Button onClick={() => onHideDialogCancel()} icon="pi pi-times" className="p-button-text" label="Cancelar"></Button>
                                        <Button type="submit" icon="pi pi-check" label="Crear producto" className="mr-2"></Button>
                                    </div>
                                </form>
                            </>
                        )}
                    />
                </div>
            </Dialog>

            <Dialog header="Editar producto" visible={displayDialogEdit} onHide={() => onHideDialogEditX()} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }}>
                <div className="create-product-form">
                    <Form
                        onSubmit={onHideDialogEdit}
                        initialValues={initialValuesEdit}
                        validate={validateEdit}
                        render={({ handleSubmit }) => (
                            <>
                                <form onSubmit={handleSubmit}>
                                    <div className="create-product-form__grid">
                                        <Field
                                            name="productReferenceId"
                                            render={({ input, meta }) => (
                                                <div>
                                                    <span className="create-product-form__span">
                                                        <label htmlFor="productReferenceId" className={classNames({ "p-error": isFormFieldValid("productReferenceId"), "create-product-form__label": true })}>
                                                            Referencia*
                                                        </label>
                                                        <InputText disabled id="productReferenceId" {...input} autoFocus className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__input": true })} placeholder="Referencia del producto" />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="productName"
                                            render={({ input, meta }) => (
                                                <div className="">
                                                    <span className="create-product-form__span">
                                                        <label htmlFor="productName" className={classNames({ "p-error": isFormFieldValid("productName") })}>
                                                            Nombre*
                                                        </label>
                                                        <InputText id="productName" {...input} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__input": true })} placeholder="Nombre del producto" />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="selectedProductCategory"
                                            render={({ input, meta }) => (
                                                <div className="">
                                                    <span className="create-product-form__span">
                                                        <label htmlFor="selectedProductCategory" className={classNames({ "p-error": isFormFieldValid("selectedProductCategory") })}>
                                                            Categoría*
                                                        </label>
                                                        <Dropdown
                                                            id="selectedProductCategory"
                                                            {...input}
                                                            className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__dropdown": true })}
                                                            options={categories}
                                                            optionLabel="name"
                                                            optionValue="name"
                                                            placeholder="Categoria del producto"
                                                        />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="selectedProductBrand"
                                            render={({ input, meta }) => (
                                                <div className="">
                                                    <span className="create-product-form__span">
                                                        <label htmlFor="selectedProductBrand" className={classNames({ "p-error": isFormFieldValid("selectedProductBrand") })}>
                                                            Marca*
                                                        </label>
                                                        <Dropdown id="selectedProductBrand" {...input} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__dropdown": true })} options={brands} optionLabel="name" optionValue="name" placeholder="Marca del producto" />
                                                    </span>
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                    </div>
                                    <Field
                                        name="productDescription"
                                        render={({ input, meta }) => (
                                            <div className="create-product-form__InputTextarea">
                                                <span className="create-product-form__InputTextarea_span">
                                                    <label htmlFor="productDescription" className={classNames({ "p-error": isFormFieldValid("productDescription") })}>
                                                        Descripción*
                                                    </label>
                                                    <InputTextarea id="productDescription" {...input} className={classNames({ "p-invalid": isFormFieldValid(meta), "create-product-form__input create-product-form__inputTextarea": true })} placeholder="Descripción del producto" />
                                                </span>
                                                {getFormErrorMessage(meta)}
                                            </div>
                                        )}
                                    />

                                    <h5>Seleccione los vehiculos compatibles con el producto</h5>
                                    <div className="picklist-vehicles">
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
                                        {selectedVehicles.length > 0 || selectedVehiclesOfProductEdit.length > 0 ? <small className="p-success">Vehículo(s) seleccionado(s) exitosamente</small> : <small className="p-error">*Debe seleccionar al menos un vehículo</small>}
                                    </div>
                                    <div className="create-product-buttons-form">
                                        <Button onClick={() => onHideDialogCancel()} icon="pi pi-times" className="p-button-text" label="Cancelar"></Button>
                                        <Button type="submit" icon="pi pi-check" label="Guardar e ir a editar imagen" className="mr-2"></Button>
                                    </div>
                                </form>
                            </>
                        )}
                    />
                </div>
            </Dialog>
            <Dialog header="Seleccionar la imagen del producto" visible={displayDialogUploadImages} onHide={() => setDisplayDialogUploadImages(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} footer={renderFooterDialog()}>
                <div className="dc-create-product-form">
                    <h5>Seleccione la imagen del producto</h5>
                    <FileUpload
                        name="photo"
                        url={`${config.baseURL}/imagesProducts/create/${productReferenceId}`}
                        onUpload={onUpload}
                        accept="image/*"
                        maxFileSize={1000000}
                        chooseOptions={chooseOptions}
                        uploadOptions={uploadOptions}
                        cancelOptions={cancelOptions}
                        emptyTemplate={<p className="m-0">Arrastre y suelte la imagen.</p>}
                    />
                </div>
            </Dialog>
            <Dialog header="Editar la imagen del producto" visible={displayDialogEditUploadImages} onHide={() => setDisplayDialogEditUploadImages(false)} breakpoints={{ "960px": "75vw" }} style={{ width: "65vw" }} footer={renderFooterDialogEdit()}>
                <div className="dc-create-product-form">
                    <h5>Imagen actual del producto</h5>
                    <div className="edit-product-form__img">{photoBodyTemplate(productSelected)}</div>
                    <p>Si desea modificar la imagen, seleccione una nueva, por el contrario, cierre este dialogo con normalidad</p>
                    <FileUpload
                        name="photo"
                        url={`${config.baseURL}/imagesProducts/create/${productSelected.id}`}
                        onUpload={onUpload}
                        accept="image/*"
                        maxFileSize={1000000}
                        chooseOptions={chooseOptions}
                        uploadOptions={uploadOptionsEdit}
                        cancelOptions={cancelOptions}
                        emptyTemplate={<p className="m-0">Arrastre y suelte las imagenes.</p>}
                    />
                </div>
            </Dialog>

            <TableProducts className="table-products" products={products} setProductSelected={setProductSelected} />
        </div>
    );
}
