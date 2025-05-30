import { BitnobApi } from "./BitnobApi.js";

class BitnobOnchain extends BitnobApi {
  constructor() {
    super("addresses/generate");
  }

  async createAddress(addressData) {
    const response = await this.axiosService.post("", addressData);
      return response;
  }

  async sendBTC(sendData) {
    const response = await this.axiosService.post("/send_bitcoin", sendData);
    return response;
  }
}

export const bitnobOnchain = new BitnobOnchain();