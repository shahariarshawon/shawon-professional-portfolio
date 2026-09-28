import axios from "axios";

import { siteConfig } from "@/constants/site";

export const api = axios.create({
  baseURL: siteConfig.apiUrl,
  withCredentials: true,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json"
  }
});