import axios from 'axios';
// import config from './../config/config';

// const baseRolURL = process.env.REACT_APP_BASE_URL +'/categories'
// console.log(baseRolURL)

const baseRolURL = 'http://localhost:5000/roles'
export class RoleService {

    getRol(id) {
        return axios.get(`${baseRolURL}/${id}`).then(res => res.datas);
    }

    getRoles(){
        return axios.get(baseRolURL).then(res => res.data);
        
    }
    // createCategory(name, description, idVehicle, idCategory,) {
        
    //     return axios
    //       .post(baseRolURL + '/create', {
    //         idVehicle,
    //         idCategory,
    //         name,  
    //         description
    //       })
    //       .then((response) => {
    //         return response.data;           
    //       })  
          
    //   }

    deleteRol(id){
        
        return axios
        .delete(`${baseRolURL}/delete/${id}`)
        .then(() => {
          console.log("Categoria eliminada")
        });

    }

}