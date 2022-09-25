import axios from 'axios';
const baseURL = 'http://localhost:5000'
const baseClientsURL = baseURL +'/clients'
export class ClientService {

  getClient(id) {
    return axios.get(`${baseClientsURL}/${id}`).then(res => res.data.data);
}

    createClient(idUser,name,lastname,documentType,document,telephone,email,country,department,city,neightboorhood,address,indications) {
        
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
            indications

          })
          .then((response) => {
            return response.data;           
          })  
          
      }
}