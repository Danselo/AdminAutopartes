import { DataTable } from "primereact/datatable";
import React, { useState, useEffect } from "react";
import { Column } from "primereact/column";
// import { buttonBodyTemplate } from "./columnTemplates";
import axios from 'axios'
const url = 'http://localhost:5000/users/'



export const TableUser = () => {
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState([]);


   useEffect(() => {
    axios.get(url).then((response) => {
        console.log(response)
        setUsers(response.data);           
    });
}, []);

console.log(selectedUser);

    return (
        <div className="">
                <DataTable value={users} paginator responsiveLayout="scroll" 
        dataKey="id" 
        emptyMessage="No se encontraron datos"
         className="table-product" 
         showGridlines
         selection={selectedUser}
         onSelectionChange={e => setSelectedUser(e.value)}
        rows={10}>
            <Column selectionMode="single" headerStyle={{width: '3em'}}></Column>
            <Column field="id" sortable header="Id"></Column>
            <Column field="name" sortable header="Nombre"></Column>
            <Column field="lastname" sortable header="Apellido"></Column>
            <Column field="email" sortable header="Email"></Column>
            <Column field="idRol" sortable header="Rol"></Column>
            
        </DataTable>

        </div>
    
        
    );
};
