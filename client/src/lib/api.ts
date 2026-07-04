import axios from "axios";
import { siteConfig } from "@/constants/site";

export const api = axios.create({
  baseURL: siteConfig.apiUrl,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json"
  }
});