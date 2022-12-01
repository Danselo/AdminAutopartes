import axios from "axios";
const baseURL = "http://localhost:5000";
const baseUserURL = baseURL + "/users";
export class UserService {

    getUser(id) {
        return axios.get(`${baseUserURL}/${id}`).then((res) => res.data);
    }
    getUsers() {
        return axios.get(baseUserURL).then((res) => res.data);
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
        delete user.createdAt
        delete user.roles_users
         return axios
             .put(url,user)
    }
    async getRealPassword(password,realPassword) {
        return axios.post(baseUserURL + '/post-real-password',{
            password,
            realPassword
        })
    }
}
