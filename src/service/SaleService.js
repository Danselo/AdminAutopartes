import axios from "axios";
import config from "../config/config";

const baseSaleURL = config.baseURL + "/sales";

export class SaleService {
    getSales() {
        return axios.get(baseSaleURL).then((res) => res.data);
    }
    getSaleDetailById(idSale) {
        return axios.get(`${baseSaleURL}/get-sale-details/${idSale}`).then((res) => res.data).catch((e) =>{
            console.error("Falle al traer los productos de la bd", e)
        });
    }
    createSale(idClient, saleDate, statusSale, statusPayment, totalPurchase) {
        return axios
            .post(baseSaleURL + "/create", {              
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

    addProductsToSale(idSale, idProduct, amount, price) {
        return axios
            .post(baseSaleURL + "/associate-products-to-sale", {
                idSale,
                idProduct,
                amount,
                price,
            })
            .then((response) => {
                return response.data;
            });
    }
}
