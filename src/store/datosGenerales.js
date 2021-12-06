import servicio from "@/services/datosGenerales.js";
export default {
    namespaced: true,
    state: () => ({
        departamento_sesion:{},
        numero_empleado: 835,
        orden:{},
        recepcion_general: {
            id: 0,
            folio: "",
            fecha: Date.now(),
            id_orden: 0,
            estado_componente: "",
            entrega_ot: "",
            comentarios: "",
            creado_por: 0,
            modificado_por: 0,
        },
        default_recepcion_general: {
            id: 0,
            folio: "",
            fecha: Date.now(),
            id_orden: 0,
            estado_componente: "",
            entrega_ot: "",
            comentarios: "",
            creado_por: 0,
            modificado_por: 0,
        },
        accion: -1,
    }),
  
    mutations: {
        SET_NO_EMPLEADO(state, no_empleado) {
            state.numero_empleado = no_empleado;
        },
        SET_DEPARTAMENTO_SESION(state, depto) {
            state.departamento_sesion = depto;
        },
        SET_ORDEN(state,ordenes){
            state.orden = ordenes;
        },
        SET_ACCION(state,accion){
            state.accion = accion;
        },
        SET_RECEPCION_GENERAL(state,recepcion){
            state.recepcion_general = Object.assign({}, recepcion);
        },
    },
  
    actions: {
        async buscarOrden({ state, commit, rootGetters }, numeroOrden) {
            //let obj_depto = (rootGetters['get_departamento']);
            return servicio
              .buscarOrden(numeroOrden)
              .then(res => {
                if (res.status === 200) {
                  commit("datosGenerales/SET_ORDEN", res.data, { root: true });
                }
                return res.status
              })
              .catch(err => {
                console.log(err);
                //return 0
              });
        },
        set_departamento_sesion({ commit }, depto) {
            commit("SET_DEPARTAMENTO_SESION", depto, { root: true });
        },
        set_no_empleado({ commit }, no_empleado) {
            commit("SET_NO_EMPLEADO", no_empleado, { root: true });
        },
        set_orden_no_encontrada({ commit }) {
            commit("datosGenerales/SET_ORDEN", {}, { root: true });
        },
        set_accion({ commit }, accion) {
            commit("datosGenerales/SET_ACCION", accion, { root: true });
        },
        set_recepcion_general({ commit }, recepcion) {
            commit("datosGenerales/SET_RECEPCION_GENERAL", recepcion, { root: true });
        },
        set_update_recepcion_general({ commit }, recepcion) {
            commit("datosGenerales/SET_RECEPCION_GENERAL", recepcion, { root: true });
        },
    },
  
    getters: {
        get_no_empleado(state) {
            return state.numero_empleado
        },
        get_departamento_sesion(state) {
            return state.departamento_sesion
        },
        get_orden(state) {
            return state.orden
        },
        get_accion(state) {
            return state.accion
        },
        get_recepcion_general(state) {
            return state.recepcion_general
        },
        get_default_recepcion_general(state) {
            return state.default_recepcion_general
        }
    }
  };