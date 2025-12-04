import axios from "axios";

// ATENÇÃO: Substitua 'SEU_IP_LOCAL' pelo endereço de IP da sua máquina.
const API_URL = "http://10.34.255.119:8080/api/v1";

const api = axios.create({
  baseURL: API_URL,
});

export default api;
