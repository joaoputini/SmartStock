import axios from "axios";

const api = axios.create({
  baseURL: "http://10.110.12.76/3000", 
});

export default api;