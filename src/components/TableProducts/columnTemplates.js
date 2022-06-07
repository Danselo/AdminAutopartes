import React from 'react'
import { Button } from 'primereact/button';

export const imageBodyTemplate = (rowData) => {
    return <img src={`images/product/${rowData.img}`} onError={(e) => e.target.src = 'https://www.primefaces.org/wp-content/uploads/2020/05/placeholder.png'} alt={rowData.image} className="product-image" />;
}

export const buttonBodyTemplate = (rowData) => {
    return (
        <div className=''>
            <Button icon="pi pi-pencil" className="p-button-secondary" />
            <Button icon="pi pi-eye" className="p-button-info" />
            <Button icon="pi pi-eye-slash" />
        </div>
    );
}
