import axios from 'axios';
import config from '../config/config';

const baseProductsBrandsURL = config.baseURL +'/productsbrands'

export class ProductsBrandsService {

    getProductsBrands() {
        return axios.get(baseProductsBrandsURL).then(res => res.data);
    }

    createProductsBrands(name) {
        
        return axios
          .post(baseProductsBrandsURL + '/create', {
            name,  
            
          });  
          
      }
    
    updateProductsBrands(id, name){
        return axios
            .put(`${baseProductsBrandsURL}/update/${id}`,{
                name: name
            })
    }

    deleteProductsBrands(id){
        return axios
        .delete(`${baseProductsBrandsURL}/delete/${id}`);
    }
    
    getProductsWhereBrand(idBrand){
        return axios.get(`${baseProductsBrandsURL}/get-products-where-brand/${idBrand}`).then(res => res.data)
    }

    changeStatusOfBrand(idBrand, status){
        return axios
        .put(`${baseProductsBrandsURL}/change-status-of-brand/${idBrand}`, status);
    }

}