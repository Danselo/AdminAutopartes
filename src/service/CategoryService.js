import axios from 'axios';
import config from './../config/config';

const baseCategoryURL = config.baseURL +'/categories'

export class CategoryService {

    getCategories() {
        return axios.get(baseCategoryURL).then(res => res.data);
    }

    createCategory(name) {
        
        return axios
          .post(baseCategoryURL + '/create', {
            name,  
            
          });  
          
      }
    
    updateCategory(id, name){
        return axios
            .put(`${baseCategoryURL}/update/${id}`,{
                name: name
            })
    }

    deleteCategory(id){
        return axios
        .delete(`${baseCategoryURL}/delete/${id}`);
    }

}