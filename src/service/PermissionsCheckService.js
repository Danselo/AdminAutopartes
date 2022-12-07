export class PermisisonsCheckService {
    userHasPermission(permission) {
        let modules = JSON.parse(localStorage.getItem("modules"));
        if (modules !== null) {
            let isContained = modules.some((element) => element.idModule === permission);
            return isContained;
        }
        return false;
    }
}
