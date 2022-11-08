// import axios from 'axios';
// import config from '../config/config';

let permissions = JSON.parse(localStorage.getItem("permissions"));
console.log("permisos del ls", permissions)

export class PermisisonsCheckService {

    userHasPermission(permission){
        let isContained = permissions.some((element) => element.idPermissions === permission)
        console.log(isContained)
        return isContained


    }

   
}