import axios from "axios";
import config from "../config/config";

const baseModulesURL = config.baseURL + "/modules";

export class ModulesService {
    getModules() {
        return axios.get(baseModulesURL).then((res) => res.data);
    }

    // createCategory(name) {

    //     return axios
    //       .post(baseModulesURL + '/create', {
    //         name,

    //       });

    //   }

    // updateCategory(id, name){
    //     return axios
    //         .put(`${baseModulesURL}/update/${id}`,{
    //             name: name
    //         })
    // }

    // deleteCategory(id){
    //     return axios
    //     .delete(`${baseModulesURL}/delete/${id}`);
    // }

    // getProductsWhereCategory(idCategory){
    //     return axios.get(`${baseModulesURL}/get-products-where-category/${idCategory}`).then(res => res.data)
    // }
    // changeStatusOfCategory(idCategory, status){
    //     return axios
    //     .put(`${baseModulesURL}/change-status-of-category/${idCategory}`, status);
    // }
}
