import axios from "axios";

//export const API = "memesh-chat-backend-production.up
//import axios from "axios";

export const API = axios.create({
  baseURL: "https://memesh-chat-backend-production.up.railway.app/api",
  withCredentials: true,  // Penting! biar cookie terkirim
});
