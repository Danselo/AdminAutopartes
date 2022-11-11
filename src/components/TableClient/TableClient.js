import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
import "./dataTableClient.css";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Panel } from "primereact/panel";
import { Dialog } from "primereact/dialog";
import { ClientService } from "../../service/ClientService";

const _clientService = new ClientService();

export const TableClient = ({setClientSelected,clients}) => {
    const [globalFilter, setGlobalFilter] = useState(null);
    const [clientsTableSelected, setClientsSelected] = useState([]);
    const [clientInfoDialog, setClientInfoDialog] = useState(false);
    const [clientInfo, setClientInfo] = useState({});
  
    useEffect(() => {   
        if (clientsTableSelected) {
            setClientSelected(clientsTableSelected)
        }
    }, [clientsTableSelected, setClientSelected])
    console.log(clientsTableSelected);
    const statusBodyTemplate = (rowData) => {
        if (rowData.status === true) {
            return <span className="role-badge-status-active">ACTIVO</span>;
        }else if(rowData.status === false){
            return <span className="role-badge-status-inactive">INACTIVO</span>;
        }else{
            return <span className="role-badge-status-na">NA</span>; 
        }
        
    }
    const hideDialog = () => {
        setClientInfoDialog(false);
    };
    const infoClientDialogFooter = (
        <React.Fragment>
            <Button label="Cerrar" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
        </React.Fragment>
    );
    // const viewClientDetail = () => {
    //     setClientInfoDialog(true);
    // };
    const actionBodyTemplate = (rowData) => {
        return (
            <React.Fragment>
                <Button icon="pi pi-eye" className="p-button-rounded p-button-info" onClick={() => viewClientDetail(rowData)}aria-label="Detail" />
            </React.Fragment>
        );
    };


    const viewClientDetail = (info) => {
        console.log(info);
        _clientService
            .getClient(info.id)
            .then((response) => {
                setClientInfo(response);
                setClientInfoDialog(true);
            })
            .catch((e) => {
                console.error("Error al traer a info del cliente", e);
            });
    };
    return (
        <>        
        <Dialog visible={clientInfoDialog} style={{ width: "60vw" }} header="Detalle de la compra" modal className="p-fluid" footer={infoClientDialogFooter} onHide={hideDialog}>
                <Panel header="Informacion general de la compra" className="dialog-buy-panel" toggleable>
                    <div className="dialog-buy-panel-detail">
                        <div>
                            <strong>
                                <p>Id del cliente</p>
                            </strong>
                            <p>{clientInfo.id}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Nombre de cliente</p>
                            </strong>
                            <p>{clientInfo.name}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Apellido del cliente</p>
                            </strong>
                            <p>{clientInfo.lastname}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Tipo de documento</p>
                            </strong>
                            <p>{clientInfo.documentType}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Numero de documento</p>
                            </strong>
                            <p>{clientInfo.document}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Numero de telefono</p>
                            </strong>
                            <p>{clientInfo.telephone}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Correo Electronico</p>
                            </strong>
                            <p>{clientInfo.email}</p>
                        </div>
                        <div>
                            <strong>
                                <p>País</p>
                            </strong>
                            <p>{clientInfo.country}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Departamento</p>
                            </strong>
                            <p>{clientInfo.department}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Ciudad</p>
                            </strong>
                            <p>{clientInfo.city}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Vecindario</p>
                            </strong>
                            <p>{clientInfo.neightboorhood}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Dirección</p>
                            </strong>
                            <p>{clientInfo.address}</p>
                        </div>
                        <div>
                            <strong>
                                <p>Indicaciones</p>
                            </strong>
                            <p>{clientInfo.indications}</p>
                        </div>
                    </div>
                </Panel>
            </Dialog>
                <div className="p-inputgroup create-brand__table">
                <InputText placeholder="Buscar Cliente" onInput={(e) => setGlobalFilter(e.target.value)} />
                <Button icon="pi pi-search" className="p-button-primary" />
            </div>
        <DataTable value={clients} paginator responsiveLayout="scroll" emptyMessage="No se encontraron datos" className="table-user" showGridlines rows={10} selection={clientsTableSelected} onSelectionChange={(e) => setClientsSelected(e.value)} dataKey="id" globalFilter={globalFilter}>
             <Column selectionMode="single" headerStyle={{width: '3em'}}></Column>
            <Column field="id" sortable header="Id"></Column>
            <Column field="status"  body={statusBodyTemplate}  sortable header="Estado"></Column>
            <Column field="idUser" sortable header="Id Usuario"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            <Column field="lastname" sortable header="Apellido"></Column>
            {/* <Column field="documentType" sortable header="Tipo Documento"></Column>
            <Column field="document" sortable header="Documento"></Column>
            <Column field="telephone" sortable header="Telefono"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="country" sortable header="Pais"></Column>
            <Column field="department" sortable header="Departamento"></Column>
            <Column field="city" sortable header="Ciudad"></Column>
            <Column field="neightboorhood" sortable header="Vecindario "></Column>
            <Column field="address" sortable header="Direccion"></Column>
            <Column field="indications" sortable header="Indicaciones"></Column> */}
            <Column header="Ver detalle de cliente" body={actionBodyTemplate} exportable={false}></Column>

        </DataTable>
        </>

    );
};