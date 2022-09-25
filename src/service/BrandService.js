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

}