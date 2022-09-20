import axios from 'axios';
const baseURL = 'http://localhost:5000'
const baseProductsURL = baseURL +'/products'

export class ProductService {

    getProductsSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    createProduct(name, description, idVehicle, idCategory,) {
        
        return axios
          .post(baseProductsURL + '/create', {
            idVehicle,
            idCategory,
            name,  
            description
          })
          .then((response) => {
            return response.data;           
          })  
          
      }

}