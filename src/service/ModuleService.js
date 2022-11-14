import axios from "axios";
import config from "../config/config";

const baseModulesURL = config.baseURL + "/modules"

export class ModuleService {

    getModule(id) {
        return axios.get(`${baseModulesURL}/${id}`).then(res => res.data);
    }

    getModules(){
        return axios.get(baseModulesURL).then(res => res.data);
        
    }
}
