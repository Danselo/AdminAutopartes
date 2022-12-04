import axios from "axios";
import config from "../config/config";
const baseDashboardURL = config.baseURL + "/dashboard";

export class DashboardService {
    getTopTenMostSelledProducts(topTenDate) {
        return axios
            .post(`${baseDashboardURL}/top-ten-products`, {
                topTenDate: topTenDate,
            })
            .then((res) => res.data);
    }
    getTopTenLessSoldProducts(topTenDate) {
        return axios
            .post(`${baseDashboardURL}/top-ten-less-products`, {
                topTenDate: topTenDate,
            })
            .then((res) => res.data);
    }

    getMonthlyIncome(monthlyIncomeDate) {
        return axios
            .post(`${baseDashboardURL}/monthly-income`, {
                monthlyIncomeDate: monthlyIncomeDate,
            })
            .then((res) => res.data);
    }

    getDailySales(date) {
        return axios
            .post(`${baseDashboardURL}/daily-sales`, {
                date: date,
            })
            .then((res) => res.data);
    }
}
