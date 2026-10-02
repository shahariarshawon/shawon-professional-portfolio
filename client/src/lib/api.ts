import axios from "axios";

import { siteConfig } from "@/constants/site";

/**
 * Browser-side API client (admin dashboard, contact form). The public pages
 * read data on the server via lib/public-api instead. The timeout leaves room
 * for a cold-starting free-tier backend.
 */
export const api = axios.create({
  baseURL: siteConfig.apiUrl,
  withCredentials: true,
  timeout: 30000,
  headers: {
    "Content-Type": "application/json"
  }
});
