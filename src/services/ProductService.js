import axios from 'axios'
import { mapActions } from 'vuex'

export default class ProductService{
    
    url = "http://localhost:8091/product/"

    getAll(){
        return axios.get(this.url + "all/")
    }
}