import axios from "axios";
import { getActiveUser } from "@/app/api/storage";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:8080";

const API = axios.create({
  baseURL: API_BASE_URL,
  timeout: 12_000,
});

API.interceptors.request.use((req: any) => {
  if (typeof window !== "undefined") {
    const token = localStorage.getItem("token");
    const authUser = getActiveUser();

    if (token) {
      req.headers.Authorization = `Bearer ${token}`;
    }

    if (authUser?.zone) {
      req.headers["X-User-Zone"] = authUser.zone;
    }

    if (authUser?.role) {
      req.headers["X-User-Role"] = authUser.role;
    }
  }

  return req;
});

export default API;