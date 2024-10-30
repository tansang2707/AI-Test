// @ts-ignore
import axios from "axios";

const instance = axios.create();

instance.interceptors.request.use(
  // @ts-ignore
  (config) => {
    if (typeof window !== "undefined") {
      const token = localStorage.getItem("jwt");
      if (token) {
        config.headers["Authentication"] = token;
      }
    }
    return config;
  },
  // @ts-ignore
  (error) => {
    console.error("Request error:", error);
    return Promise.reject(error);
  }
);

export default instance;
