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
        // console.log(vehicle.brands_vehicles)
        // delete vehicle.brands_vehicles
        // console.log(vehicle.brands_vehicles)
       const url = `${baseVehicleURL}/update/${vehicle.id}`
        delete vehicle.id
        return axios
            .put(url,vehicle)
    }

    deleteVehicle(id){
        return axios
        .delete(`${baseVehicleURL}/delete/${id}`);
    }

}