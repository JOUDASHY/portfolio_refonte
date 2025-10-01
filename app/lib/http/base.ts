"use client";

import axios, { AxiosInstance } from "axios";

const BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "/api/";

export function createHttp(baseURL: string = BASE_URL): AxiosInstance {
  return axios.create({ baseURL, withCredentials: false });
}

export { BASE_URL };


