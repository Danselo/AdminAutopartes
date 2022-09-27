import axios from 'axios';
import config from '../config/config';

const baseProductURL = config.baseURL +'/products'

export class ProductService {

    getProductsSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }
    getProducts() {
      return axios.get(baseProductURL).then(res => res.data);
  }
    createProduct(name, description, idVehicle,idCategory) {
        
        return axios
          .post(baseProductURL + '/create', {
            idVehicle,
            idCategory,
            name,  
            description
          })
          .then((response) => {
            return response.data;           
          })  
          
      }
      updateProduct(id, name, description, idCategory, idVehicle){
        return axios
            .put(`${baseProductURL}/update/${id}`,{
              name, 
              description, 
              idCategory, 
              idVehicle
            })
    }

    deleteProduct(id){
        return axios
        .delete(`${baseProductURL}/delete/${id}`);
    }

}

