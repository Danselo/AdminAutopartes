import axios from "axios";
import config from "../config/config";

const baseBuyURL = config.baseURL + "/buys";

export class BuyService {
    getBuys() {
        return axios.get(baseBuyURL).then((res) => res.data);
    }
    getVehiclesOfBuys() {
        return axios.get(`${baseBuyURL}/find-vehicles-of-a-product`).then((res) => res.data);
    }

    getBuyDetailById(idBuy) {
        return axios
            .get(`${baseBuyURL}/get-buy-details/${idBuy}`)
            .then((res) => res.data)
            .catch((e) => {
                console.error("Aqui falle", e);
            });
    }

    createBuy(id, idProvider, datePurchase, totalPurchase) {
        return axios
            .post(baseBuyURL + "/create", {
                id,
                idProvider,
                datePurchase,
                totalPurchase,
            })
            .then((response) => {
                return response.data;
            });
    }
    updateBuy(buy) {
        const url = `${baseBuyURL}/update/${buy.id}`;
        delete buy.id;
        delete buy.provider;
        delete buy.createdAt;

        return axios.put(url, buy);
    }
    cancelBuy(buy, reason, productsDetailOfBuy) {
        console.log("buy", buy);
        console.log("products", productsDetailOfBuy);
        const url = `${baseBuyURL}/cancel-buy/${buy.id}`;
        return axios.post(url, { reason, productsDetailOfBuy });
    }

    deleteBuy(id) {
        return axios.delete(`${baseBuyURL}/delete/${id}`);
    }

    addProductsToPurchase(idBuy, idProduct, amount, netPrice, profitPercentage, salePrice) {
        return axios
            .post(baseBuyURL + "/assoiate-products-to-purchasse", {
                idBuy,
                idProduct,
                amount,
                netPrice,
                profitPercentage,
                salePrice,
            })
            .then((response) => {
                return response.data;
            });
    }
}
