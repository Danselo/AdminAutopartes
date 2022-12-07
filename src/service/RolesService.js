import axios from "axios";
import config from "../config/config";

const baseRolURL = config.baseURL + "/roles";

export class RolesService {
    getRol(id) {
        return axios.get(`${baseRolURL}/${id}`).then((res) => res.datas);
    }
    getRolByName(name) {
        return axios.get(`${baseRolURL}/find-by-name/${name}`).then((res) => res.datas);
    }

    getRoles() {
        return axios.get(baseRolURL).then((res) => res.data);
    }
    deleteRol(id) {
        return axios.delete(`${baseRolURL}/delete/${id}`).then(() => {
            console.log("Rol eliminada");
        });
    }

    createRol(name, selectedModules) {
        return axios
            .post(baseRolURL + "/create", {
                name,
                selectedModules,
            })
            .then((response) => {
                return response.data;
            });
    }

    updateRol(id, name, selectedModules) {
        console.log(name);
        return axios
            .put(baseRolURL + `/update/${id}`, {
                name,
                selectedModules,
            })
            .then((response) => {
                return response.data;
            });
    }
    updateStatus(rol, newStatus) {
        console.log(newStatus);
        const url = `${baseRolURL}/updateStatus/${rol.id}`;
        delete rol.id;
        delete rol.createdAt;
        return axios.post(url, {
            newStatus,
        });
    }
}
