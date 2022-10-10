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
        return axios.get(`${baseBuyURL}/get-buy-details/${idBuy}`).then((res) => res.data).catch((e) =>{
            console.error("Aqui falle", e)
        });
    }
   
    createBuy(id, idProvider, datePurchase, totalPurchase, shippingPrice, ivaPercentage, totalIva, discountsPercentage, totalDiscounts, invoiceUrl) {
        return axios
            .post(baseBuyURL + "/create", {
                id,
                idProvider,
                datePurchase,
                totalPurchase,
                shippingPrice,
                ivaPercentage,
                totalIva,
                discountsPercentage,
                totalDiscounts,
                invoiceUrl,
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

    addProductsToPurchase(idBuy, idProduct, amount, netPrice, shippingPrice, discountsPercentage, ivaPercentage, profitPercentage, salePrice) {
        return axios
            .post(baseBuyURL + "/assoiate-products-to-purchasse", {
                idBuy,
                idProduct,
                amount,
                netPrice,
                shippingPrice,
                discountsPercentage,
                ivaPercentage,
                profitPercentage,
                salePrice,
            })
            .then((response) => {
                return response.data;
            });
    }
}
