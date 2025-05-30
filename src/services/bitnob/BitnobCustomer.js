import { BitnobApi } from "./BitnobApi.js";

class BitnobCustomer extends BitnobApi {
  constructor() {
    super("customers");
  }

  async create(customerData) {
    const response = await this.axiosService.post("", customerData);
      return response;
  }

   async get(customerId) {
    const response = await this.axiosService.get(`/${customerId}`);
      return response;
  }

  async getAll() {
    const response = await this.axiosService.get("");
      return response;
  }
}

export const bitnobCustomer = new BitnobCustomer();