import axios from "axios";
import config from "../config/config";

// const baseAuthURL = config.baseURL +'/auth'
// const baseAdminURL = config.adminURL+ '/#/validation-token'
const baseRolePermissionsURL = config.baseURL + "/roles";

export class AuthService {

    getPermissions(token) {
        let config ={
            headers : {'Authorization': 'Bearer ' + token}
        }
         
        return axios.get(`${baseRolePermissionsURL}/permissions`,config).then((res) => res.data);
    }
}
