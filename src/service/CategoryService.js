import axios from 'axios';
// import config from './../config/config';

// const baseCategoryURL = process.env.REACT_APP_BASE_URL +'/categories'
// console.log(baseCategoryURL)

const baseCategoryURL = 'http://localhost:5000/categories'
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
          console.log("Categoria eliminada")
        });

    }

}