import axios from 'axios';
const baseURL = 'http://localhost:5000'
const baseProductsURL = baseURL +'/users'
export class UserService {

  getUser(id) {
    return axios.get(`${baseProductsURL}/${id}`).then(res => res.data.data);
}
    createUser(email,password, name, lastname,status,idRol) {
        
        return axios
          .post(baseProductsURL + '/create', {
            email,
            password,
            name,  
            lastname,
            status,
            idRol,
          })
          .then((response) => {
            return response.data;           
          })  
          
      }

      
    updateUser(id){
        
      return axios
      .delete(`${baseProductsURL}/update/${id}`)
      .then(() => {
        console.log("Categoria Actualizada")
      });

  }
}