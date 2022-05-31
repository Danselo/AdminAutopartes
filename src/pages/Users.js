import React, { useState, useEffect, useRef } from 'react';
import classNames from 'classnames';
import { DataTable } from 'primereact/datatable';
import { Column } from 'primereact/column';
import { Toast } from 'primereact/toast';
import { Button } from 'primereact/button';
import { FileUpload } from 'primereact/fileupload';
import { Rating } from 'primereact/rating';
import { Toolbar } from 'primereact/toolbar';
import { InputTextarea } from 'primereact/inputtextarea';
import { RadioButton } from 'primereact/radiobutton';
import { InputNumber } from 'primereact/inputnumber';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
//import { ProductService } from '../service/ProductService';

const Users = () => {
    let emptyUser = {
        id: null,
        nombre: '',
        apellido: '',
        direccion: '',
        email: '',
        fechaRegistro: '',
        userStatus: 'Habilitado'
    };

    const [users, setUsers] = useState(null);
    const [userDialog, setUserDialog] = useState(false);
    const [deleteUserDialog, setDeleteUserDialog] = useState(false);
    const [deleteUsersDialog, setDeleteUsersDialog] = useState(false);
    const [user, setUser] = useState(emptyUser);
    const [selectedUser, setSelectedUser] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [globalFilter, setGlobalFilter] = useState(null);
    const toast = useRef(null);
    const dt = useRef(null);

    /*useEffect(() => {
        const UserService = new ProductService();
        UserService.getProducts().then(data => setUsers(data));
    }, []); */

    

    const openNew = () => {
        setUser(emptyUser);
        setSubmitted(false);
        setUserDialog(true);
    }

    const hideDialog = () => {
        setSubmitted(false);
        setUserDialog(false);
    }

    const hideDeleteUserDialog = () => {
        setDeleteUserDialog(false);
    }

    const hideDeleteProductsDialog = () => {
        setDeleteUserDialog(false);
    }

    const saveUser = () => {
        setSubmitted(true);

        if (user.nombre.trim()) {
            let _users = [...users];
            let _user= { ...user };
            if (users.id) {
                const index = findIndexById(user.id);

                _user[index] = _user;
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product ', life: 3000 });
            }
            else {
                _user.id = createId();
                _user.push(_user);
                toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Created', life: 3000 });
            }

            setUser(_user);
            setUser(emptyUser);
        }
    }

    const editUser = (user) => {
        setUser({ ...user });
        setUserDialog(true);
    }
/*
    const confirmDeleteUser = (user) => {
        setUser(user);
        setDeleteUserDialog(true);
    }
    */

   /* const deleteUser = () => {
        let _users = users.filter(val => val.id !== user.id);
        setUsers(_users);
        setDeleteUserDialog(false);
        setUser(emptyUser);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Product Deleted', life: 3000 });
    } */

    const findIndexById = (id) => {
        let index = -1;
        for (let i = 0; i < users.length; i++) {
            if (users[i].id === id) {
                index = i;
                break;
            }
        }

        return index;
    }

    const createId = () => {
        let id = '';
        let chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
        for (let i = 0; i < 5; i++) {
            id += chars.charAt(Math.floor(Math.random() * chars.length));
        }
        return id;
    }

    const exportCSV = () => {
        dt.current.exportCSV();
    }

    const confirmDeleteSelected = () => {
        setDeleteUserDialog(true);
    }

     /* const deleteSelectedUsers = () => {
        let _users = users.filter(val => !selectedUser.includes(val));
        setUsers(_users);
        setDeleteUsersDialog(false);
        setSelectedUser(null);
        toast.current.show({ severity: 'success', summary: 'Successful', detail: 'Products Deleted', life: 3000 });
    } */

   

   
   

    const leftToolbarTemplate = () => {
        return (
            <React.Fragment>
                <div className="my-2">
                    <Button label="New" icon="pi pi-plus" className="p-button-success mr-2" onClick={openNew} />
                    <Button label="Delete" icon="pi pi-trash" className="p-button-danger" onClick={confirmDeleteSelected} disabled={!selectedUser || !selectedUser.length} />
                </div>
            </React.Fragment>
        )
    }
    const rightToolbarTemplate = () => {
        return (
            <React.Fragment>
                <FileUpload mode="basic" accept="image/*" maxFileSize={1000000} label="Import" chooseLabel="Import" className="mr-2 inline-block" />
                <Button label="Export" icon="pi pi-upload" className="p-button-help" onClick={exportCSV} />
            </React.Fragment>
        )
    }

    const codeBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Code</span>
                {rowData.code}
            </>
        );
    }

    const nameBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Nombre</span>
                {rowData.nombre}
            </>
        );
    }
    const lastBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Apellido</span>
                {rowData.apellido}
            </>
        );
    }

    const telefonoBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Telefono</span>
                {rowData.telefono}
            </>
        );
    }
    const emailBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">email</span>
                {rowData.email}
            </>
        );
    }
    const fechaBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Fecha Registro</span>
                {rowData.fechaRegistro}
            </>
        );
    }

    

    


    const statusBodyTemplate = (rowData) => {
        return (
            <>
                <span className="p-column-title">Estado</span>
                <span className={`user-badge status-${rowData.userStatus.toLowerCase()}`}>{rowData.userStatus}</span>
            </>
        )
    }

    const actionBodyTemplate = (rowData) => {
        return (
            <div className="actions">
                <Button icon="pi pi-pencil" className="p-button-rounded p-button-success mr-2" onClick={() => editUser(rowData)} />

            </div>
        );
    } 
    const onInputChange = (e, name) => {
        const val = (e.target && e.target.value) || '';
        let _user = { ...user };
        _user[`${name}`] = val;

        setUser(_user);
    }

    const header = (
        <div className="flex flex-column md:flex-row md:justify-content-between md:align-items-center">
            <h5 className="m-0">Lista Usuarios</h5>
            <span className="block mt-2 md:mt-0 p-input-icon-left">
                <i className="pi pi-search" />
                <InputText type="search" onInput={(e) => setGlobalFilter(e.target.value)} placeholder="Search..." />
            </span>
        </div>
    );

    const userDialogFooter = (
        <>
            <Button label="Cancel" icon="pi pi-times" className="p-button-text" onClick={hideDialog} />
            <Button label="Save" icon="pi pi-check" className="p-button-text" onClick={saveUser} />
        </>
    );
   /* const deleteProductDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteUserDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteProduct} />
        </>
    ); */
   /* const deleteProductsDialogFooter = (
        <>
            <Button label="No" icon="pi pi-times" className="p-button-text" onClick={hideDeleteProductsDialog} />
            <Button label="Yes" icon="pi pi-check" className="p-button-text" onClick={deleteSelectedUsers} />
        </>
    ); */

    return (
        <div className="grid crud-demo">
            <div className="col-12">
                <div className="card">
                    <Toast ref={toast} />
                    <Toolbar className="mb-4" left={leftToolbarTemplate} right={rightToolbarTemplate}></Toolbar>

                    <DataTable ref={dt} value={users} selection={selectedUser} onSelectionChange={(e) => setSelectedUser(e.value)}
                        dataKey="id" paginator rows={10} rowsPerPageOptions={[5, 10, 25]} className="datatable-responsive"
                        paginatorTemplate="FirstPageLink PrevPageLink PageLinks NextPageLink LastPageLink CurrentPageReport RowsPerPageDropdown"
                        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} products"
                        globalFilter={globalFilter} emptyMessage="No products found." header={header} responsiveLayout="scroll">
                        <Column selectionMode="multiple" headerStyle={{ width: '3rem'}}></Column>
                        <Column field="code" header="Code" sortable body={codeBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="nombre" header="Nombre" sortable body={nameBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="apellido" header="Apellido" sortable body={lastBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="telefono" header="Telefono" sortable body={telefonoBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="email" header="Email" sortable body={emailBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column field="fechaRegistro" header="fechaRegistro " sortable body={fechaBodyTemplate} headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>



                        
                        <Column field="userStatus" header="Status" body={statusBodyTemplate} sortable headerStyle={{ width: '14%', minWidth: '10rem' }}></Column>
                        <Column body={actionBodyTemplate}></Column>
                    </DataTable>

                    <Dialog visible={userDialog} style={{ width: '450px' }} header="Detalles usuario" modal className="p-fluid" footer={userDialogFooter} onHide={hideDialog}>
                        <div className="field">
                            <label htmlFor="name">Nombre</label>
                            <InputText id="name" value={user.nombre} onChange={(e) => onInputChange(e, 'nombre')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.nombre })} />
                            {submitted && !user.nombre && <small className="p-invalid">El nombre es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Apellido</label>
                            <InputText id="apellido" value={user.apellido} onChange={(e) => onInputChange(e, 'apellido')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.apellido })} />
                            {submitted && !user.apellido && <small className="p-invalid">El apellido es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Telefono</label>
                            <InputText id="telefono" value={user.telefono} onChange={(e) => onInputChange(e, 'telefono')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.telefono })} />
                            {submitted && !user.telefono && <small className="p-invalid">El telefono es requerido.</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Direccion</label>
                            <InputText id="direccion" value={user.direccion} onChange={(e) => onInputChange(e, 'direccion')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.direccion })} />
                            {submitted && !user.direccion  && <small className="p-invalid">La direccion es requerida</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Email</label>
                            <InputText id="email" value={user.email} onChange={(e) => onInputChange(e, 'email')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.email })} />
                            {submitted && !user.email && <small className="p-invalid">Email requerido</small>}
                        </div>
                        <div className="field">
                            <label htmlFor="name">Fecha Registro</label>
                            <InputText id="name" value={user.fechaRegistro} onChange={(e) => onInputChange(e, 'fechaRegistro')} required autoFocus className={classNames({ 'p-invalid': submitted && !user.fechaRegistro })} />
                            {submitted && !user.fechaRegistro && <small className="p-invalid">requerida.</small>}
                        </div>
                        
                    </Dialog>

                      {/* <Dialog visible={deleteProductDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductDialogFooter} onHide={hideDeleteProductDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete <b>{product.name}</b>?</span>}
                        </div>
                    </Dialog> */}

                    
                    {/* 
                    <Dialog visible={deleteProductsDialog} style={{ width: '450px' }} header="Confirm" modal footer={deleteProductsDialogFooter} onHide={hideDeleteProductsDialog}>
                        <div className="flex align-items-center justify-content-center">
                            <i className="pi pi-exclamation-triangle mr-3" style={{ fontSize: '2rem' }} />
                            {product && <span>Are you sure you want to delete the selected products?</span>}
                        </div>
                    </Dialog> */}
                </div>
            </div>
        </div>
    );
}
const comparisonFn = function (prevProps, nextProps) {
    return prevProps.location.pathname === nextProps.location.pathname;
};

export default React.memo(Users, comparisonFn);