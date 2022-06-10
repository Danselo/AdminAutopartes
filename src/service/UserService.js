import axios from 'axios';

export class UserService {

    getUsersSmall() {
        return axios.get('assets/demo/data/products-small.json').then(res => res.data.data);
    }

    getUsers() {
        return axios.get('assets/demo/data/products.json').then(res => res.data.data);
    }

    getUsersWithOrdersSmall() {
        return axios.get('assets/demo/data/products-orders-small.json').then(res => res.data.data);
    }
}