import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import { DataTable } from "primereact/datatable";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import "./tableRoles.css";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { RolesPermissionsService } from "../../service/RolesPermissionsService";

const _rolesPermissionsService = new RolesPermissionsService();

export const TableRoles = ({ setRolSelected, roles }) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [TableRolSelected, setTableRolSelected] = useState([]);
    const [rolInfo, setRolInfo] = useState({});
    const [rolPermissionsInfo, setRolPermissionsInfo] = useState({
        id: 0,
        name: "",
        description: "",
    });

    const [rolInfoDialog, setRolInfoDialog] = useState(false);

    useEffect(() => {
        if (TableRolSelected) {
            setRolSelected(TableRolSelected);
        }
    }, [TableRolSelected, setRolSelected]);

    const statusBodyTemplate = (rowData) => {
        if (rowData.status === true) {
            return <span className="role-badge-status-active">ACTIVO</span>;
        } else if (rowData.status === false) {
            return <span className="role-badge-status-inactive">INACTIVO</span>;
        } else {
            return <span className="role-badge-status-na">NA</span>;
        }
    };
    const hideDialog = () => {
        setRolInfoDialog(false);
    };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => viewRolDetail(rowData)} aria-label="Detail" />
            </React.Fragment>
        );
    };
    const viewRolDetail = (info) => {
        setRolInfo(info);
        _rolesPermissionsService
            .getModulesOfRolSelected(info.id)
            .then((response) => {
                let responseMapped = response.map((element) => {
                    return {
                        id: element.modules.id,
                        description: element.modules.description,
                        name: element.modules.name,
                    };
                });
                setRolPermissionsInfo(responseMapped);
                setRolInfoDialog(true);
            })
            .catch((e) => {
                console.log("Falle aqui", e);
            });
    };

    const infoRolDialogFooter = (
        <React.Fragment>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </React.Fragment>
    );

    return (
        <>
            <Dialog visible={rolInfoDialog} style={{ width: "60vw" }} header="Detalle de rol" modal className="p-fluid" footer={infoRolDialogFooter} onHide={hideDialog}>
                <Panel header="Información general del rol seleccionado" className="dialog-buy-panel" toggleable>
                    <div className="dialog-buy-panel-detail">
                        <div>
                            <strong>
                                <p>Id del rol</p>
                            </strong>
                            <p>{rolInfo.id}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Nombre del rol</p>
                            </strong>
                            <p>{rolInfo.name}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Estado del rol</p>
                            </strong>
                            <p className={rolInfo.status === true ? "role-badge-status-active-details" : "role-badge-status-inactive-details"}>{rolInfo.status === true ? "Activo" : "Inactivo"}</p>
                        </div>
                    </div>
                </Panel>
                <Panel header="Información de los permisos del rol seleccionado" className="dialog-buy-panel" toggleable>
                    <div className="dialog-buy-panel-roles">
                        <div className="dialog-buy-panel-products__detail">
                            <DataTable header="Permisos" stripedRows showGridlines value={rolPermissionsInfo} paginator responsiveLayout="scroll" dataKey="id" emptyMessage="No se encontraron datos" className="table-rol" rows={10}>
                                <Column field="id" frozen header="Id"></Column>
                                <Column field="name" header="Nombre módulo"></Column>
                                <Column field="description" className="table-rol--column-gray" header="Descripción"></Column>
                            </DataTable>
                        </div>
                    </div>
                </Panel>
            </Dialog>
            <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar rol" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>

            <DataTable
                header="Roles registrados"
                stripedRows
                showGridlines
                value={roles}
                paginator
                responsiveLayout="scroll"
                dataKey="id"
                emptyMessage="No se encontraron datos"
                className="table-rol"
                rows={10}
                globalFilter={globalFilter}
                selection={TableRolSelected}
                onSelectionChange={(e) => setTableRolSelected(e.value)}
            >
                <Column selectionMode="single" headerStyle={{ width: "3em" }}></Column>
                <Column field="id" frozen header="Id rol"></Column>
                <Column field="name" header="Nombre del rol"></Column>
                <Column field="createdAt" className="table-rol--column-gray" sortable header="Fecha de creación"></Column>
                <Column field="status" body={statusBodyTemplate} header="Estado"></Column>
                <Column field="permissions" header="Ver permisos" body={actionBodyTemplate}></Column>
            </DataTable>
        </>
    );
};
