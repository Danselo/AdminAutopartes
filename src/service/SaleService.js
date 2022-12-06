import axios from "axios";
import config from "../config/config";
const baseSaleURL = config.baseURL + "/sales";

export class SaleService {
    getSales() {
        return axios.get(baseSaleURL).then((res) => res.data);
    }
    getSaleDetailById(idSale) {
        return axios
            .get(`${baseSaleURL}/get-sale-details/${idSale}`)
            .then((res) => res.data)
            .catch((e) => {
                console.error("Falle al traer los productos de la bd", e);
            });
    }
    createSale(idClient, saleDate, statusSale, statusPayment, totalPurchase, typeSale) {
        return axios
            .post(baseSaleURL + "/create", {
                idClient,
                saleDate,
                statusSale,
                statusPayment,
                totalPurchase,
                typeSale,
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

    changeStatusPayment(idSale) {
        return axios
            .post(baseSaleURL + "/change-status-payment", {
                id: idSale,
            })
            .then((response) => {
                return response.data;
            });
    }

    changeStatusSale(idSale) {
        return axios
            .post(baseSaleURL + "/change-status-sale", {
                id: idSale,
            })
            .then((response) => {
                return response.data;
            });
    }
    cancelSale(token, password, idSale, cancelReason, productsDetailOfSale) {
        let config = {
            headers: { Authorization: "Bearer " + token },
        };
        return axios
            .post(
                baseSaleURL + "/cancel-sale",
                {
                    password,
                    idSale,
                    cancelReason,
                    productsDetailOfSale,
                },
                config
            )
            .then((response) => {
                return response.data;
            });
    }

    verifyRol(token) {
        let config = {
            headers: { Authorization: "Bearer " + token },
        };
        return axios.post(baseSaleURL + "/verify-rol", {}, config).then((response) => {
            return response.data;
        });
    }
}
