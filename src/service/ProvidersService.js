import axios from 'axios';
import config from './../config/config';

const baseProvidersURL = config.baseURL+'/providers'

export class ProviderService {

    getProviders() {
        return axios.get(baseProvidersURL).then(res => res.data);
    }

    createProvider(nit, companyName, contactName, telephone, adress, email, country, status) {
        return axios
        .post(baseProvidersURL + '/create', {
            nit,
            companyName,
            contactName, 
            telephone, 
            adress,
            email,
            country,
            status
            
          }).then((respuesta)=>{return respuesta.data});
      
           }

    updateProvider(provider){
       
       const url = `${baseProvidersURL}/update/${provider.id}`
        delete provider.id
        return axios
            .put(url,provider)  

    }
    deleteProvider(id){
        return axios
        .delete(`${baseProvidersURL}/delete/${id}`);
    }

}