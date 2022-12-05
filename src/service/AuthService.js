import axios from "axios";
import config from "../config/config";

// const baseAdminURL = config.adminURL+ '/#/validation-token'
const baseRolePermissionsURL = config.baseURL + "/roles";
const baseAuthURL = config.baseURL + "/auth";

export class AuthService {
    getModules(token) {
        let config = {
            headers: { Authorization: "Bearer " + token },
        };

        return axios.get(`${baseRolePermissionsURL}/permissions`, config).then((res) => res.data);
    }
    async changePasswordUserLoged(token, currentPassword, newPassword) {
        let config = {
          headers: { Authorization: "Bearer " + token },
        };
        return axios.post(`${baseAuthURL}/change-password-user-loged`, {
          token,
          currentPassword,
          newPassword,
        }, config);
      }

    verifyToken(token) {
        return axios
            .post(`${baseAuthURL}/verify-token`, {
                token,
            })
            .then((res) => res.data);
    }
}
