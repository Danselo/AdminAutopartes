import axios from 'axios';
import config from '../config/config';

const baseBrandURL = config.baseURL +'/brands'

export class BrandService {

    getBrands() {
        return axios.get(baseBrandURL).then(res => res.data);
    }

    createBrand(name) {
        
        return axios
          .post(baseBrandURL + '/create', {
            name,  
            
          });  
          
      }
    
    updateBrand(id, name){
        return axios
            .put(`${baseBrandURL}/update/${id}`,{
                name: name
            })
    }

    deleteBrand(id){
        return axios
        .delete(`${baseBrandURL}/delete/${id}`);
    }

    getVehiclesWhereBrand(idBrand){
        return axios.get(`${baseBrandURL}/get-vehicles-where-brand/${idBrand}`).then(res => res.data)
    }

    changeStatusOfBrand(idBrand, status){
        return axios
        .put(`${baseBrandURL}/change-status-of-brand/${idBrand}`, status);
    }

}