import axios, { AxiosRequestConfig } from "axios";

interface IRequest {
  url: string;
  method: string;
  headers?: Record<string, string>;
  body?: any;
}

export async function sendRequest({ url, method, headers, body}: IRequest) {

  const start = Date.now();
  const config: AxiosRequestConfig = {
    url,
    method,
    headers,
    data: body,
    validateStatus: () => true, // so that even error statuses are returned
  };

  const resp = await axios(config);
  const time = Date.now() - start;

  return {
    status: resp.status,
    data: resp.data,
    headers: Object.fromEntries(Object.entries(resp.headers)),
    time,
  }
}
