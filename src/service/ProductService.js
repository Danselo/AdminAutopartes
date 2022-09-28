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
    createProduct(id, name, description,idCategory) {
        return axios
          .post(baseProductURL + '/create', {
            id,
            idCategory,
            name,  
            description
          })
          .then((response) => {
            return response.data;           
          })  
          
      }
      updateProduct(id, name, description, idCategory){
        return axios
            .put(`${baseProductURL}/update/${id}`,{
              name, 
              description, 
              idCategory, 
            })
    }

    deleteProduct(id){
        return axios
        .delete(`${baseProductURL}/delete/${id}`);
    }

    addVehicleToProduct(idProduct,idVehicle){
      return axios
          .post(baseProductURL + '/add-vehicle-to-product', {            
            idProduct,
            idVehicle             
          })
          .then((response) => {
            return response.data;           
          })

    }

}

