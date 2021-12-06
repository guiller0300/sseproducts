import axios from 'axios'
import { mapActions } from 'vuex'

export default class UsuarioService{
    
    url = "http://localhost:8080/usuario/"

    getAll(){
        return axios.get(this.url + "all/")
    }

    getByUser(usuario){
        return axios.get(this.url + usuario)
    }
}