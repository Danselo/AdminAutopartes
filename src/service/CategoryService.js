import axios from 'axios';
import config from '../config/config';

const baseCategoryURL = config.baseURL +'/categories'

export class CategoryService {

    getProductsSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
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
        .delete(`${baseCategoryURL}/${id}`)
        .then(() => {
          alert("Categoria eliminada")
        });

    }

}