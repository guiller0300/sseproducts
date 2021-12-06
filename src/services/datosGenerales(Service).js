import axios from "axios";

export default {
  buscarOrden(numeroOrden) {
    return axios.get(`/general/ordenes/numero?numeroOrden=${numeroOrden}`);
  },
};