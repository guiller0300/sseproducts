import axios from 'axios'
import { mapActions } from 'vuex'

export default class NewsService{
    
    url = "http://localhost:8080/news/"
    news = null;
    insertNews(...news){
        this.news = [...news]
        return axios.post(this.url, {
            "id": null,
            "titulo": this.news[0],
            "descripcion":this.news[1],
            "suscriptor":this.news[2]
        })
    }

    getByUser(usuario){
        return axios.get(this.url + usuario)
    }
}