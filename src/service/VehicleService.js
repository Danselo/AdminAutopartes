import axios from 'axios';
import config from '../config/config';

const baseVehicleURL = config.baseURL +'/vehicles'

export class VehicleService {

    getVehicles() {
        return axios.get(baseVehicleURL).then(res => res.data);
    }

    createVehicle(name, model, idBrand) {
        
        return axios
          .post(baseVehicleURL + '/create', {
            name,
            model,
            idBrand  
            
          });  
          
      }
    
    updateVehicle(vehicle){
      
        delete vehicle.brands_vehicles
        delete vehicle.id_brand
       
       const url = `${baseVehicleURL}/update/${vehicle.id}`
        delete vehicle.id
        return axios
            .put(url,vehicle)
    }

    deleteVehicle(id){
        return axios
        .delete(`${baseVehicleURL}/delete/${id}`);
    }
    changeStatusOfVehicle(idVehicle, status){
        return axios
        .put(`${baseVehicleURL}/change-status-of-vehicle/${idVehicle}`, status);
    }
    getProductsWhereVehicle(idVehicle){
        return axios.get(`${baseVehicleURL}/get-products-where-vehicle/${idVehicle}`).then(res => res.data).catch((e) =>{
            console.error(e)
        })
    }

}