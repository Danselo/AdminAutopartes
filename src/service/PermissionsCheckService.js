let modules = JSON.parse(localStorage.getItem("modules"));

export class PermisisonsCheckService {
    userHasPermission(permission) {
        if (modules !== null) {
            let isContained = modules.some((element) => element.idModule === permission);
            return isContained;
        }
    }
}
