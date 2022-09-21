import axios from 'axios';
import config from '../config/config';

const baseCategoryURL = config.baseURL +'/categories'

export class CategoryService {

    getCategory(id) {
        return axios.get(`${baseCategoryURL}/${id}`).then(res => res.data.data);
    }

    // createCategory(name, description, idVehicle, idCategory,) {
        
    //     return axios
    //       .post(baseCategoryURL + '/create', {
    //         idVehicle,
    //         idCategory,
    //         name,  
    //         description
    //       })
    //       .then((response) => {
    //         return response.data;           
    //       })  
          
    //   }

    deleteCategory(id){
        
        return axios
        .delete(`${baseCategoryURL}/delete/${id}`)
        .then(() => {
          alert("Categoria eliminada")
        });

    }

}