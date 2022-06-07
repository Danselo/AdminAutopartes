import React from 'react';
import { TableProducts } from '../components/TableProducts/TableProducts';
import { Button } from 'primereact/button';

export default function Products() {
    return (
        <div>
            <Button label="Agregar producto" icon="pi pi-plus-circle" className="p-button-raised" />
            <TableProducts />
        </div>
    )
}