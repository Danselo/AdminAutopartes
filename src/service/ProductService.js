import axios from "axios";
import config from "../config/config";

const baseProductURL = config.baseURL + "/products";

export class ProductService {
    getProductsSmall() {
        return axios.get("assets/demo/data/products-small.json").then((res) => res.data.data);
    }
    getProducts() {
        return axios.get(baseProductURL).then((res) => res.data);
    }
    getVehiclesOfProductById(idProduct) {
        return axios.get(`${baseProductURL}/find-vehicles-of-a-product/${idProduct}`).then((res) => res.data);
    }
    getVehiclesOfProducts(){
      return axios.get(`${baseProductURL}/find-vehicles-of-a-product`).then((res) => res.data);
    }
    createProduct(id, name, description, idCategory, idBrand) {
        return axios
            .post(baseProductURL + "/create", {
                id,
                idCategory,
                idBrand,
                name,
                description,
            })
            .then((response) => {
                return response.data;
            });
    }
    updateProduct(product) {
        delete product.category
        let url = `${baseProductURL}/update/${product.id}`
        delete product.id
        return axios
        .put(url,product);
    }

    updateProductFromBuy(productId, newAmount, newPrice) {
        let url = `${baseProductURL}/update-product-from-buy/${productId}`
        return axios
        .put(url,{
            amount: newAmount,
            price: newPrice
        });
    }

    discountProduct(productId, amount) {
        let url = `${baseProductURL}/discount-product/${productId}`
        return axios
        .put(url,{
            amount: amount,
           
        });
    }

    updateVehiclesOfProduct(idProduct,arrayOfVehiclesOfProduct) {
                
        return axios
        .put(`${baseProductURL}/update-vehicles-of-products/${idProduct}`, arrayOfVehiclesOfProduct);
    }

    deleteProduct(id) {
        return axios.delete(`${baseProductURL}/delete/${id}`);
    }

    addVehicleToProduct(idProduct, idVehicle) {
        return axios
            .post(baseProductURL + "/add-vehicle-to-product", {
                idProduct,
                idVehicle,
            })
            .then((response) => {
                return response.data;
            });
    }

    
}
