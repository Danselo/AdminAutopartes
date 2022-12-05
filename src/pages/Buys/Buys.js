import React, { useState, useEffect, useRef } from "react";
import { Button } from "primereact/button";
import "./buys.css";
import { Link } from "react-router-dom";
import { TableBuys } from "../../components/TableBuys/TableBuys";
import { BuyService } from "../../service/BuyService";
import { UserService } from "../../service/UserService";
import { Toolbar } from "primereact/toolbar";
import { Dialog } from "primereact/dialog";
import { classNames } from "primereact/utils";
import { Form, Field } from "react-final-form";
import { InputTextarea } from "primereact/inputtextarea";
import { confirmDialog,ConfirmDialog } from "primereact/confirmdialog";
import { Password } from "primereact/password";
import { Toast } from "primereact/toast";

const _buyService = new BuyService();
const _userService = new UserService();


export default function Buys() {
  const toast = useRef(null);
    const [buys, setBuys] = useState([]);
    const [buySelected, setBuySelected] = useState({});
    const [displayDialogStatus, setDisplayDialogStatus] = useState(false);
    const [displayDialogStatusPassword, setDisplayDialogStatusPassword] = useState(false);
    const [userAdmin, setUserAdmin] = useState([]);
    const [buysStatusReason, setBuysStatusReason] = useState([]);
    const [buysStatusPassword, setBuysStatusPassword] = useState([]);


    const [visibleTrue, setVisibleTrue] = useState(false);
    const [visibleFalse, setVisibleFalse] = useState(false);
    const refreshPage2 = ()=>{
        setDisplayDialogStatus(false)
        setDisplayDialogStatusPassword(false)
        setBuySelected({});
        loadBuys();
      }
      const loadBuys = () => {
        _buyService.getBuys().then((response) => {
            setBuys(response);
        });
    };
    const loadUser = () => {
        _userService.getUser(1).then((response) => {
            setUserAdmin(response);
        });
      };

      const refreshPage3 = ()=>{
        setDisplayDialogStatusPassword(true)
        
      }

      useEffect(() => {
        _userService.getUser(1).then((response) => {
            setUserAdmin(response);
        });
    }, []);
    console.log(userAdmin);
    useEffect(() => {
        _buyService.getBuys().then((response) => {
            setBuys(response);
        });
    }, []);
    const rightContents = (
        <React.Fragment>
            <Button label={buySelected.status ? "Anular" : "Anulado"} className={ buySelected.status ? "p-button-danger p-button-raised  dc-space-between" : "p-button-anulado p-button-raised  dc-space-between" }  icon="pi pi-eye-slash"   disabled={!buySelected.id || buySelected.status === false} onClick={() => onClickDialogStatus()} />
        </React.Fragment>
    );
    const leftContents = (
        <React.Fragment>
           <Link to={"/CreatePurchase"}>
                <Button label="Crear compra" icon="pi pi-plus-circle" className="p-button-raised p-button-info button-add-product" />
            </Link>           
        </React.Fragment>
    );
    function onClickDialogStatus() {
        setDisplayDialogStatus(true);
    }
    const onHideDialogStatusX = () => {
        setDisplayDialogStatus(false);
        refreshPage2();
    };
    const onHideDialogStatusPasswordX = () => {
        setDisplayDialogStatusPassword(false);
        refreshPage2();
    };
    const cancelCreate = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => refreshPage2(),
            reject: () => setDisplayDialogStatus(true),
        });
    };
    const cancelCreatePassword = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => refreshPage2(),
            reject: () => setDisplayDialogStatusPassword(true),
        });
    };
    const onHideDialogCancelStatus = () => {
        cancelCreate();
        setDisplayDialogStatus(false);
    };
    console.log();
    function EditStatus() {
       if(buySelected.status === true){
        buySelected.status = false
        _buyService
        .updateBuy(buySelected)
        .then(() => {

            toast.current.show({ severity: "success", summary: "Anulado!", detail: "La compra se anulo exitosamente", life: 3000 });
            refreshPage2();
        })
        .catch((e) => {
            toast.current.show({ severity: "error", summary: "Error", detail: "Upss algo salio mal, vuelve a intentarlo", life: 3000 });
            console.log(e);
            setBuySelected({})
            setDisplayDialogStatusPassword(false);
        });
       }else{
            toast.current.show({ severity: "error", summary: "Error", detail: "Ya se anulo lo compra", life: 3000 });
            setBuySelected({});

       }
       
   }
     

    const onHideDialogCancelPassword = () => {
      
        setVisibleFalse(false); 
        setVisibleTrue(false);
        setBuySelected({})
  
    };
     //----------------------Status VALIDATION --------------------
     const validateStatus = (data) => {
        let errors = {};

        if (!data.reason) {
            errors.reason = "Debe digitar una razón para anular una compra";
        }
        
        return errors;
    };

    const initialValuesStatus = {

        reason: buySelected.reason,
        // confirmPassword: "",
        
    };
    const onSubmitStatus = () => {
        setDisplayDialogStatusPassword(true);
        setDisplayDialogStatus(false)
    };
    const validateStatusPassword = (data) => {
        let errors = {};

        if(!data.confirmPassword){
            errors.confirmPassword = "Este campo es requerido";
        }
        
        return errors;
    };

    const initialValuesStatusPassword = {

        confirmPassword: " ",
        // confirmPassword: "",
        
    };
    
    const onSubmitStatusPassword = (data) => {
        _userService
        .getRealPassword(data.confirmPassword,userAdmin.password)
        .then((response) => {
          if(response.data){
            // setDisplayDialogStatusPassword(false);
            setDisplayDialogStatus(false);
            setVisibleTrue(true);
          }
        })
        .catch((error) => {
        //   setDisplayDialogStatusPassword(false);
        toast.current.show({ severity: "error", summary: "ACCESO DENEGADO", detail: "La contraseña de administrador no es la correcta", life: 3000 });
        refreshPage2()
            
  
        });
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    
    // const confirmBuysStatus = () => {
    //     confirmDialog({
    //         message: `Esta seguro que quieres anular esta compra`,
    //         header: 'Confirmación',
    //         icon: 'pi pi-info-circle',
    //         acceptClassName: 'p-button-danger',
    //         accept,
    //         reject
    //     });
    // };

    const onEditUserSelected = (e) => {
        const buyUpdated = {
          ...buySelected,
          [e.target.name]: e.target.value,
        };
        
        setBuySelected(buyUpdated);
      };
    return (
        <div>
      <Toast ref={toast} />

            <div className="text-center">
                <h4>Gestión de compras</h4>
            </div>
            <Toolbar left={leftContents} right={rightContents}/>
            <Dialog header="Anular compra" visible={displayDialogStatus} onHide={() => onHideDialogStatusX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitStatus}
                    initialValues={initialValuesStatus}
                    validate={validateStatus}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="create-user-form">
                                <h5>Digite los datos para anular compra </h5>
                                <p className="paragraph_buys_status_form">Debes tener en cuenta que para poder anular una compra es obligatorio  digitar la razón por la cual deseas anular una compra</p>
                            </div>
                            <Field
                                    name="reason"
                                    render={({ input, meta }) => (
                                        <div className="reason">
                                            <span>
                                                <label htmlFor="reason" className={classNames({ "p-error": isFormFieldValid("reason") })}></label>
                                                <br />
                                                <InputTextarea id="reason" {...input} onChange={onEditUserSelected}  placeholder="Digite su razón para anular la compra" className={classNames({ "p-invalid": isFormFieldValid(meta), inputBuysReason: true })} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" type="button"  className="p-button-text" onClick={() => onHideDialogCancelStatus()} />
                                <Button label="Anular Compra" icon="pi pi-check" autoFocus />
                            </div>
                        </form>
                    )}
                />
            </Dialog>
            <Dialog header="Contraseña administrador" visible={displayDialogStatusPassword} onHide={() => onHideDialogStatusPasswordX()} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }}>
                <Form
                    onSubmit={onSubmitStatusPassword}
                    initialValues={initialValuesStatusPassword}
                    validate={validateStatusPassword}
                    render={({ handleSubmit }) => (
                        <form onSubmit={handleSubmit}>
                            <div className="create-user-form">
                                <h5>Digite la contraseña de administrador para continuar </h5>
                            </div>
                            <Field
                                    name="confirmPassword"
                                    render={({ input, meta }) => (
                                        <div className="field passwordBuysStatus">
                                            <span>
                                                <label htmlFor="confirmPassword" className={classNames({ "p-error": isFormFieldValid("confirmPassword"), })}>Confirmar Contraseña Administrador</label>
                                                <br />
                                                <Password id="confirmPassword"  {...input} placeholder="Confirmar Contraseña" className={classNames({ "p-invalid": isFormFieldValid(meta),  })} feedback={false} />
                                            </span>
                                            <br />
                                            {getFormErrorMessage(meta)}
                                        </div>
                                    )}
                                />
                            <div className="submit-user-create">
                                <Button label="Cancelar" icon="pi pi-times" type="button"  className="p-button-text" onClick={() => onHideDialogStatusPasswordX()} />
                                <Button label="Anular Compra" icon="pi pi-check" autoFocus />
                            </div>
                        </form>
                    )}
                />
            </Dialog>
            {/* Validacion para la contraseña al la hora de anular compra  */}
            <ConfirmDialog visible={visibleTrue} 
            onHide={() => onHideDialogCancelPassword(true)} 
            header="Acceso concedido"
            message= "¿Desea anular la compra?"
            icon= "pi pi-exclamation-triangle"
            acceptLabel= "Anular"
            rejectLabel= "Cancelar"
            accept={EditStatus}
            reject={refreshPage2} 
             />
            <ConfirmDialog visible={visibleFalse} 
            onHide={() => onHideDialogCancelPassword(true)} 
            message= "La contraseña no coincide"
            header="Acceso denegado"
            icon= "pi pi-exclamation-triangle"
            acceptLabel= "Cerrar"
            rejectLabel= "Volver"
            accept= {refreshPage2}
            reject={refreshPage3}
             />
            <TableBuys buys={buys} setBuySelected={setBuySelected} className="table-products"  />
        </div>
    );
}
