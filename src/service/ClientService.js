import axios from 'axios';
const baseURL = 'http://localhost:5000'
const baseClientsURL = baseURL +'/clients'
export class ClientService {

  getClient(id) {
    return axios.get(`${baseClientsURL}/${id}`).then(res => res.data);
}
getClients() {
  return axios.get(baseClientsURL).then((res) => res.data);
}

    createClient(idUser,name,lastname,documentType,document,telephone,email,country,department,city,neightboorhood,address,indications,status) {
        
        return axios
          .post(baseClientsURL + '/create', {
            idUser,
            name,
            lastname,  
            documentType,
            document,
            telephone,
            email,
            country,
            department,
            city,
            neightboorhood,
            address,
            indications,
            status
            

          })
          .then((response) => {
            return response.data;           
          })  
          
      }
      updateClient(client) {
        const url = `${baseClientsURL}/update/${client.id}`
         delete client.id
         return axios
             .put(url,client)
    }
}