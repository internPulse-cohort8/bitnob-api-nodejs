import { config } from "../../configs/config.env.js";
import { AxiosService } from "../axios/AxiosService.js";

export class BitnobApi {
  constructor(path = "") {
    this.baseUrl = `${config.BITNOB_SANDBOX_API_URL}/${path}`;
    this.apiKey = config.BITNOB_API_KEY;

    this.axiosService = new AxiosService(this.baseUrl, this.apiKey);
  }
}

