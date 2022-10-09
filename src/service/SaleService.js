import axios from "axios";
import config from "../config/config";

const baseSaleURL = config.baseURL + "/sales";

export class SaleService {
    getSales() {
        return axios.get(baseSaleURL).then((res) => res.data);
    }
   // getVehiclesOfBuys() {
      //return axios.get(`${baseSaleURL}/find-vehicles-of-a-product`).then((res) => res.data);
   // }
    createBuy(id, idClient, saleDate, statusSale, statusPayment, totalPurchase) {
        return axios
            .post(baseSaleURL + "/create", {
                id,
                idClient,
                saleDate,
                statusSale,
                statusPayment,
                totalPurchase,
            })
            .then((response) => {
                return response.data;
            });
    }
    updateSale(id, name, description, idCategory) {
        return axios.put(`${baseSaleURL}/update/${id}`, {
            name,
            description,
            idCategory,
        });
    }

    deleteSale(id) {
        return axios.delete(`${baseSaleURL}/delete/${id}`);
    }

    addProductsToPurchase(idBuy, idProduct, amount, netPrice, shippingPrice, discountsPercentage, ivaPercentage, profitPercentage, salePrice) {
        return axios
            .post(baseSaleURL + "/assoiate-products-to-purchasse", {
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
