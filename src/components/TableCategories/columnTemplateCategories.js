import React from "react";
import { Button } from "primereact/button";
import { Link } from "react-router-dom";
import {CategoryService} from '../../service/CategoryService';


export const buttonBodyTemplate = () => {
    

    const _categoryService = new CategoryService();
    
    function deleteCategory() {
        

         _categoryService.deleteCategory()
         .then((data) => {
            
             console.log('Categoria eliminada exitosamente', data);
         })      
     } 
        
   
    return (
        <div className="button-column p-0">
          
            <Link to={"/EditCategories"}>
            <Button icon=" pi pi-pencil" className="p-button-info" />
            </Link>
            <Button icon=" pi pi-trash" className="p-button-danger" onClick={deleteCategory}/>
            <div className="form-check form-switch button-column ">
            <input className="form-check-input p-button-info" type="checkbox" id="flexSwitchCheckDefault"/>
            </div>
        </div>
    );
};