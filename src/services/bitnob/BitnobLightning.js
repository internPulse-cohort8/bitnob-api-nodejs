import { BitnobApi } from "./BitnobApi.js";

class BitnobLightning extends BitnobApi {
  constructor() {
    super("lnurl");
  }

  async createAddress(addressData) {
    const response = await this.axiosService.post("", addressData);
      return response;
  }

  async getAddress(addressId) {
    const response = await this.axiosService.get(`/${addressId}`);
      return response;
  }
}

export const bitnobLightning = new BitnobLightning();