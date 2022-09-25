import axios from 'axios';
// import config from './../config/config';

// const baseCategoryURL = process.env.REACT_APP_BASE_URL +'/categories'
// console.log(baseCategoryURL)

const baseCategoryURL = 'http://localhost:5000/categories'
export class CategoryService {

    getCategories() {
        return axios.get(baseCategoryURL).then(res => res.data);
    }

    createCategory(name) {
        
        return axios
          .post(baseCategoryURL + '/create', {
            name,  
            
          })
          .then();  
          
      }
    
    updateCategory(id, name){
        return axios
            .put(`${baseCategoryURL}/update/${id}`,{
                name: name
            }).then()
    }

    deleteCategory(id){
        
        return axios
        .delete(`${baseCategoryURL}/delete/${id}`)
        .then();

    }

}