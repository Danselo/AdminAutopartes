import React, { useEffect, useState, useRef } from "react";
import { UserService } from "../../service/UserService";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./myperfil.css";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";
import { AuthService } from "../../service/AuthService";
import { useHistory } from "react-router-dom";

const _userService = new UserService();
const _authService = new AuthService();


export default function MyPerfil() {
    const [users, setUsers] = useState([]);
    const [allUsers, setAllUser] = useState([]);

    const [currentPassword, setCurrentPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [passwordConfirmation, setPasswordConfirmation] = useState("");

    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState("center");
    const toast = useRef(null);

    const dialogFuncMap = {
        displayBasic2: setDisplayBasic2,
    };
    useEffect(() => {
        _userService.getUsers().then((response) => {
            setAllUser(response);
        });
    }, []);
    useEffect(() => {
        const token = localStorage.getItem("token");
        _userService
          .getPreviousUser(token)
          .then((response) => {
            setUsers(response.data);
          })
          .catch((error) => {
            console.log(error);
          });
      }, []);

    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    };
    const successChangePassword = () => {
        toast.current.show({
          severity: "success",
          summary: "Contraseña Cambiada!",
          detail:
            "La contraseña ahora fue cambiada",
          life: 4000,
        });
    
      }
      const failChangePassword = () => {
        toast.current.show({ severity: "warn", summary: "Contraseña actual incorrecta", detail: "Inténtelo de nuevo", life: 3000 });
      }
    const changePassword = () => {
        const token = localStorage.getItem("token");
        _authService
         .changePasswordUserLoged(token, currentPassword, newPassword )
         .then((res) => {
            onHideDialogEdit();
          successChangePassword();
          console.log(res);
         }).catch((error)=>{
            onHideDialogEdit();
          failChangePassword();
         })
      }

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
    };
    const onHideDialogEdit = () => {
        setCurrentPassword(null);
        setNewPassword(null);
        setPasswordConfirmation(null);
        setDisplayBasic2(false);
    };

    // const renderFooter = (name) => {
    //     return (
    //         <div>
    //             <Button label="Cancelar" icon="pi pi-times" onClick={() => onHide(name)} className="p-button-text" />
    //             <Button label="Editar" icon="pi pi-check" onClick={() => onHide(name)} autoFocus />
    //         </div>
    //     );
    // };
    //----------------------EDIT VALIDATION --------------------
    const validateEdit = (data) => {
        let errors = {};
        if (!data.password) {
            errors.password = "Debe digitar una contraseña";
        }
        if (!data.newPassword) {
            errors.newPassword = "Este campo es requerido";
        }
        if (data.newPassword !== data.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }
        

        return errors;
    };

    const initialValuesEdit = {
        password: currentPassword,
        newPassword: newPassword,
        confirmPassword: passwordConfirmation,
    };
    const onSubmitEdit = () => {
    changePassword()
        
    };
    const isFormFieldValid = (meta) => !!(meta.touched && meta.error);
    const getFormErrorMessage = (meta) => {
        return isFormFieldValid(meta) && <small className="p-error">{meta.error}</small>;
    };
    const reject = () => {
        toast.current.show({ severity: "warn", summary: "Denegado", detail: "Has cancelado el proceso", life: 3000 });
    };

    const cancelEdit = () => {
        confirmDialog({
            message: "¿Esta seguro que desea perder el progreso?",
            header: "Confirmación",
            onHide: onHideDialogEdit(),
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => onHideDialogEdit(),
            reject: () => setDisplayBasic2(true),
        });
    };
    const onHideDialogCancelEdit = () => {

        cancelEdit();
        setDisplayBasic2(false);
    };
    return (
        <div>
            <Toast ref={toast} />

            <div className="container-my-perfil-user">
                <div className="user__title">
                    <h4>Resumen de cuenta</h4>
                </div>
                <div className="form-my-perfil-users">
                    <label htmlFor=""></label>
                    <div className="form__first_my_perfil">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={users.name || ""} disabled />
                            <label htmlFor="inputtext">Nombre</label>
                        </span>
                        <span className="p-float-label">
                            <InputText className=" " id="inputtext" value={users.lastname || ""} disabled />
                            <label htmlFor="inputtext">Apellido</label>
                        </span>
                    </div>
                    <div className="form__second_my_perfil">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={users.email || ""}  disabled />
                            <label htmlFor="inputtext">Email</label>
                        </span>
                        <span className="p-float-label">
                            <InputText id="inputtext" value={users.createdAt || ""}  className="form__padding" disabled />
                            <label htmlFor="inputtext">Fecha de Registro</label>
                        </span>
                    </div>
                </div>
                <div className="buttons__users_my_perfil">
                    <Button label="Cambiar Contraseña" className="btn__users__edit_my_perfil" icon="pi pi-external-link" onClick={() => onClick("displayBasic2")} />
                    </div>

                    <Dialog header="Editar Contraseña" visible={displayBasic2} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} onHide={() => onHideDialogEdit()}>
                        <Form
                            onSubmit={onSubmitEdit}
                            initialValues={initialValuesEdit}
                            validate={validateEdit}
                            render={({ handleSubmit }) => (
                                <form onSubmit={handleSubmit}>
                                    <div className="create-user-form">
                                        <h5>Ingrese los nuevos datos</h5>
                                        <Field
                                            name="password"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span>
                                                        <label htmlFor="password" className={classNames({ "p-error": isFormFieldValid("password") })}>
                                                            Contraseña Actual
                                                        </label>
                                                        <br />
                                                        <Password id="password" {...input}
                                                         value={currentPassword}
                                                        onChange={(e) => setCurrentPassword(e.target.value)}

                                                          placeholder="Digite su contraseña" 
                                                          className={classNames({ "p-invalid": isFormFieldValid(meta), passwordUsers: true })}
                                                           toggleMask />
                                                    </span>
                                                    <br />
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="newPassword"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span>
                                                        <label htmlFor="newPassword" className={classNames({ "p-error": isFormFieldValid("newPassword") })}>
                                                            Nueva contraseña
                                                        </label>
                                                        <br />
                                                        <Password id="newPassword" 
                                                        {...input}
                                                        value={newPassword}
                                                         onChange={(e) => setNewPassword(e.target.value)}
                                                         placeholder="Digite su contraseña"
                                                          className={classNames({ "p-invalid": isFormFieldValid(meta), passwordUsers: true })}
                                                           toggleMask />
                                                    </span>
                                                    <br />
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                        <Field
                                            name="confirmPassword"
                                            render={({ input, meta }) => (
                                                <div className="field">
                                                    <span>
                                                        <label htmlFor="confirmPassword" className={classNames({ "p-error": isFormFieldValid("confirmPassword") })}>Confirmar Contraseña</label>
                                                        <br />
                                                        <Password id="confirmPassword"
                                                         {...input}
                                                          placeholder="Confirmar Contraseña" 
                                                          value={passwordConfirmation}
                                                          onChange={(e) => setPasswordConfirmation(e.target.value)}
                                                          className={classNames({ "p-invalid": isFormFieldValid(meta), passwordUsers: true })}
                                                           toggleMask />
                                                    </span>
                                                    <br />
                                                    {getFormErrorMessage(meta)}
                                                </div>
                                            )}
                                        />
                                    </div>

                                    <div className="submit-user-create">
                                        <Button label="Cancelar" icon="pi pi-times" type="button" onClick={() => onHideDialogCancelEdit()} className="p-button-text" />
                                        <Button label="Editar Usuario" icon="pi pi-check" autoFocus />
                                    </div>
                                </form>
                            )}
                        />
                    </Dialog>
            </div>
        </div>
    );
}
