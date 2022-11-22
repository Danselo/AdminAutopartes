import axios from "axios";
import config from "../config/config";

const baseProductURL = config.baseURL + "/products";
const baseImageProductURL = config.baseURL + "/imagesProducts"
export class ImageProductService {
    getProductsSmall() {
        return axios.get("assets/demo/data/products-small.json").then((res) => res.data.data);
    }
    getImage(idProduct) {
        return new Promise((resolve,reject)=>{
            resolve({
                url: "/public/images/product_FG2W3.png"
            })
        })
    }

    getImages() {
        return axios.get(baseImageProductURL).then((res) => res.data);
    }
    getVehiclesOfProductById(idProduct) {
        return axios.get(`${baseProductURL}/find-vehicles-of-a-product/${idProduct}`).then((res) => res.data);
    }
      
}
