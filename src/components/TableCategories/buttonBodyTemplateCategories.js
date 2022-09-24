import React from "react";
import { Button } from "primereact/button";
import {CategoryService} from '../../service/CategoryService';


export const buttonBodyTemplateCategories = (selectedProduct) => {
    

    const _categoryService = new CategoryService();
    
    function deleteCategory(id) {
        

         _categoryService.deleteCategory(id)
         .then((data) => {
            
             console.log('Categoria eliminada exitosamente', data);
         })      
     } 
        
   
    return (
        <div className="button-column p-0">
          
          
            <Button icon=" pi pi-pencil" className="p-button-info" />         
            <Button icon=" pi pi-trash" className="p-button-danger" onClick={deleteCategory(selectedProduct.id)}/>
            <div className="form-check form-switch button-column ">
            <input className="form-check-input p-button-info" type="checkbox" id="flexSwitchCheckDefault"/>
            </div>
        </div>
    );
};