import axios from 'axios';
// import config from './../config/config';

// const baseCategoryURL = process.env.REACT_APP_BASE_URL +'/categories'
// console.log(baseCategoryURL)

const baseProvidersURL = 'http://localhost:5000/providers'
export class ProvidersService {

    getProviders(id) {
        return axios.get(`${baseProvidersURL}/${id}`).then(res => res.data.data);
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

    deleteProviders(id){
        
        return axios
        .delete(`${baseProvidersURL}/delete/${id}`)
        .then(() => {
          console.log("Proveedor eliminado")
        });

    }

}