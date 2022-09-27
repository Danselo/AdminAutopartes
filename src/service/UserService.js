import axios from "axios";
const baseURL = "http://localhost:5000";
const baseUserURL = baseURL + "/users";
export class UserService {
    getUser(id) {
        return axios.get(`${baseUserURL}/${id}`).then((res) => res.data.data);
    }
    createUser(email, password, name, lastname, status, idRol) {
        return axios
            .post(baseUserURL + "/create", {
                email,
                password,
                name,
                lastname,
                status,
                idRol,
            })
    }

    updateUser(user) {
       
        const url = `${baseUserURL}/update/${user.id}`
         delete user.id
         return axios
             .put(url,user)
    }
}
