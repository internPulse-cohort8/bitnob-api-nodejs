import axios from 'axios';

export class AxiosService {
  constructor(baseURL, apiKey = null) {
    this.apiKey = apiKey;
    this.http = axios.create({
      baseURL: baseURL,
      headers: {
        'Content-Type': 'application/json',
        Accept: 'application/json',
        ...(apiKey && { Authorization: `Bearer ${apiKey}` }),
      },
    });
  }

  async get(url, config = {}) {
    const res = await this.http.get(url, config);
    return res;
  }

  async post(url, data = {}, config = {}) {
    const res = await this.http.post(url, data, config);
    return res;
  }

  async put(url, data = {}, config = {}) {
    const res = await this.http.put(url, data, config);
    return res;
  }

  async patch(url, data = {}, config = {}) {
    const res = await this.http.patch(url, data, config);
    return res;
  }

  async delete(url, config = {}) {
    const res = await this.http.delete(url, config);
    return res;
  }

  setAuthToken(token) {
    this.http.defaults.headers['Authorization'] = `Bearer ${token}`;
  }
}

