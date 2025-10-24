import axios from "axios";

// ATENÇÃO: Substitua 'SEU_IP_LOCAL' pelo endereço de IP da sua máquina.
const API_URL = 'http://10.110.12.56:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
});

export default api;