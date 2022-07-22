import React, { useRef } from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
// import { ConfirmDialog, confirmDialog } from "primereact/confirmdialog";
// import { Toast } from "primereact/toast";

export default function buttonBodyTemplate() {
    // const accept = () => {
    //     toast1.current.show({ severity: "info", summary: "Confirmacion", detail: "Ha cancelado el proceso", life: 3000 });
    // };

    // const reject = () => {
    //     toast1.current.show({ severity: "info", summary: "", detail: "Has desactivado este proveedor", life: 3000 });
    // };
    // const confirm = () => {
    //     confirmDialog({
    //         message: "¿Esta seguro que desea desactivar este proveedor?",
    //         header: "Confirmacion",
    //         icon: "pi pi-exclamation-triangle",
    //         accept,
    //         reject,
    //     });
    // };

    // const toast1 = useRef(null);
    return (
        <div className="button-column">
            {/* <Toast ref={toast1} />
            <ConfirmDialog /> */}
            <Link to={"/EditProvider"}>
                <Button icon="pi pi-pencil" className="p-button-secondary" />
            </Link>
            <Button /*onClick={confirm}*/ icon="pi pi-eye-slash" />
            {/* <InputSwitch checked={checked1} onChange={(e) => setChecked1(e.value)} /> */}
        </div>
    );
}
