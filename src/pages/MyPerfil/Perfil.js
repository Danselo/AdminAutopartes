import React, { useEffect, useState, useRef } from "react";
import { UserService } from "../../service/UserService";
import { InputText } from "primereact/inputtext";
import { NavLink } from "react-router-dom";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import "./myperfil.css";
import { Form, Field } from "react-final-form";
import { classNames } from "primereact/utils";
import { Password } from "primereact/password";
import { confirmDialog } from "primereact/confirmdialog";
import { Toast } from "primereact/toast";

const _userService = new UserService();

export default function MyPerfil() {
    const [users, setUsers] = useState([]);
    const [value1, setValue1] = useState("Danilo");
    const [value2, setValue2] = useState("Lora");
    const [value3, setValue3] = useState("13/10/2022");
    const [value4, setValue4] = useState("email@email.com");
    const [displayBasic2, setDisplayBasic2] = useState(false);
    const [position, setPosition] = useState("center");
    const toast = useRef(null);

    const dialogFuncMap = {
        displayBasic2: setDisplayBasic2,
    };
    const [displayDialogEdit, setDisplayDialogEdit] = useState(false);

    useEffect(() => {
        _userService.getUsers().then((response) => {
            setUsers(response);
        });
    }, []);
    const onClick = (name, position) => {
        dialogFuncMap[`${name}`](true);

        if (position) {
            setPosition(position);
        }
    };

    const onHide = (name) => {
        dialogFuncMap[`${name}`](false);
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

        if (data.newPassword !== data.confirmPassword) {
            errors.confirmPassword = "Las contraseñas no coinciden";
        }
        users.forEach((element) => {
            const userPassword = element.password;

            if (data.password !== userPassword) {
                errors.password = "la contraseña no es correcta ";
            }
        });

        return errors;
    };

    const initialValuesEdit = {
        password: "",
        newPassword: " ",
        confirmPassword: "",
    };
    const onSubmitEdit = () => {
        // onHideDialogEdit();
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
            icon: "pi pi-info-circle",
            acceptClassName: "p-button-danger",
            acceptLabel: "No crear",
            rejectLabel: "Cancelar",
            accept: () => setDisplayBasic2(false),
            reject: () => reject(),
        });
    };
    const onHideDialogCancelEdit = () => {
        cancelEdit();
        setDisplayDialogEdit(false);
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
                            <InputText id="inputtext" value={value1} onChange={(e) => setValue1(e.target.value)} disabled />
                            <label htmlFor="inputtext">Nombre</label>
                        </span>
                        <span className="p-float-label">
                            <InputText className=" " id="inputtext" value={value2} onChange={(e) => setValue2(e.target.value)} disabled />
                            <label htmlFor="inputtext">Apellido</label>
                        </span>
                    </div>
                    <div className="form__second_my_perfil">
                        <span className="p-float-label">
                            <InputText id="inputtext" value={value4} onChange={(e) => setValue4(e.target.value)} disabled />
                            <label htmlFor="inputtext">Email</label>
                        </span>
                        <span className="p-float-label">
                            <InputText id="inputtext" value={value3} onChange={(e) => setValue3(e.target.value)} className="form__padding" disabled />
                            <label htmlFor="inputtext">Fecha de Registro</label>
                        </span>
                    </div>
                </div>
                <div className="buttons__users_my_perfil">
                    <Button label="Cambiar Contraseña" className="btn__users__edit_my_perfil" icon="pi pi-external-link" onClick={() => onClick("displayBasic2")} />
                    </div>

                    <Dialog header="Editar Contraseña" visible={displayBasic2} breakpoints={{ "960px": "75vw" }} style={{ width: "50vw" }} onHide={() => onHide("displayBasic2")}>
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
                                                        <Password id="password" {...input} placeholder="Digite su contraseña" className={classNames({ "p-invalid": isFormFieldValid(meta), passwordUsers: true })} toggleMask />
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
                                                        <Password id="newPassword" {...input} placeholder="Digite su contraseña" className={classNames({ "p-invalid": isFormFieldValid(meta), passwordUsers: true })} toggleMask />
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
                                                        <Password id="confirmPassword" {...input} placeholder="Confirmar Contraseña" className={classNames({ "p-invalid": isFormFieldValid(meta), passwordUsers: true })} toggleMask />
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
