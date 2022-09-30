import axios from "axios";
import config from "../config/config";

const baseBuyURL = config.baseURL + "/buys";

export class BuyService {
    
    getBuys() {
        return axios.get(baseBuyURL).then((res) => res.data);
    }
    getVehiclesOfBuyById(idBuy) {
        return axios.get(`${baseBuyURL}/find-vehicles-of-a-product/${idBuy}`).then((res) => res.data);
    }
    getVehiclesOfBuys(){
      return axios.get(`${baseBuyURL}/find-vehicles-of-a-product`).then((res) => res.data);
    }
    createBuy(id, name, description, idCategory) {
        return axios
            .post(baseBuyURL + "/create", {
                id,
                idCategory,
                name,
                description,
            })
            .then((response) => {
                return response.data;
            });
    }
    updateBuy(id, name, description, idCategory) {
        return axios.put(`${baseBuyURL}/update/${id}`, {
            name,
            description,
            idCategory,
        });
    }

    deleteBuy(id) {
        return axios.delete(`${baseBuyURL}/delete/${id}`);
    }

    addVehicleToBuy(idBuy, idVehicle) {
        return axios
            .post(baseBuyURL + "/add-vehicle-to-product", {
                idBuy,
                idVehicle,
            })
            .then((response) => {
                return response.data;
            });
    }
}
