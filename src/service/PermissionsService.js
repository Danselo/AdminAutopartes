import axios from "axios";
import config from "../config/config";

const basePermissionsURL = config.baseURL + "/permissions"

export class PermissionsService {

    getPermission(id) {
        return axios.get(`${basePermissionsURL}/${id}`).then(res => res.datas);
    }

    getPermissions(){
        return axios.get(basePermissionsURL).then(res => res.data);
        
    }
    deletePermission(id){
        
        return axios
        .delete(`${basePermissionsURL}/delete/${id}`)
        .then(() => {
          console.log("Categoria eliminada")
        });

    }

}