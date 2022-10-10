import axios from "axios";
import config from "../config/config";

const baseRolesPermissionsURL = config.baseURL + "/rolesPermissions"

export class RolesPermissionsService {

    getRolPermission(id) {
        return axios.get(`${baseRolesPermissionsURL}/${id}`).then(res => res.datas);
    }

    getRolesPermissions(){
        return axios.get(baseRolesPermissionsURL).then(res => res.data);
        
    }
    deleteRol(id){
        
        return axios
        .delete(`${baseRolesPermissionsURL}/delete/${id}`)
        .then(() => {
          console.log("Categoria eliminada")
        });

    }

    createRolPermission(idRol,idPermissions){
        return axios
            .post(baseRolesPermissionsURL + "/create", {
                idRol,
                idPermissions              
            })
            .then((response) => {
                return response.data;
            });
    }

}