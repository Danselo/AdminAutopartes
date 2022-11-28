// import axios from 'axios';
// import config from '../config/config';

let modules = JSON.parse(localStorage.getItem("modules"));
console.log("permisos del ls", modules);

export class PermisisonsCheckService {
    userHasPermission(permission) {
        if (modules !== null) {
            let isContained = modules.some((element) => element.idModule === permission);
            return isContained;
        }
    }
}
