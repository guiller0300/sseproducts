<template>
  <div class="container mt-5">
    <h3>Usuario {{ userID }}</h3>
    <b-form-group
      label="Filter"
      label-cols-sm="3"
      label-align-sm="right"
      label-size="sm"
      label-for="filterInput"
      class="mb-0"
    >
      <b-input-group size="sm">
        <b-form-input
          v-model="subscriber"
          type="search"
          id="filterInput"
          placeholder="Precio Máximo"
        ></b-form-input>
        <b-input-group-append>
          <b-button @click="setupStreamSpecific">Aceptar</b-button>
        </b-input-group-append>
      </b-input-group>
    <b-form-select v-model="notify" :options="options" multiple :select-size="4"></b-form-select>
    <div class="mt-3">Selected: <strong>{{ notify }}</strong></div>
    </b-form-group>
    <div>
      <b-table striped hover :items="productos" :fields="fields"></b-table>
      <div class="row">
        <b-form-input
          v-model="message"
          type="search"
          id="filterInput"
          placeholder="Precio Máximo"
        ></b-form-input>
        <!--<b-form-textarea
          v-model="message"
          style="width: 350px"
          class="ui input"
          placeholder="Message to Echo"
        ></b-form-textarea>-->
      </div>
      <div class="row">
        <!--<b-button id="echo" @click="echo('hola')" class="ui button"
          >Echo message</b-button
        >-->
        <b-button id="echo" @click="notificar()" class="ui button"
          >Enviar dato</b-button
        >
      </div>
      <div>{{ message2 }}</div>
    </div>
  </div>
</template>

<script>
//import func from 'vue-editor-bridge';
import ProductService from "../services/ProductService";
import NewsService from "../services/NewsService";
export default {
  data() {
    return {
      message: "",
      message2: [],
      userID: null,
      connection: null,
      productos: [],
      // Note `isActive` is left out and will not appear in the rendered table
      fields: [
        { key: "id", label: "Id" },
        { key: "description", label: "Description" },
        { key: "price", label: "Price" },
      ],
      items: [
        { name: { key: "id", sortable: true } },
        { name: { key: "description" } },
        { name: { key: "price" } },
      ],
      options: [
          { value: 'CA', text: 'CA' },
          { value: 'CF', text: 'CF' },
          { value: 'MM', text: 'MM' },
          { value: 'ML', text: 'ML'},
          { value: 'MP', text: 'MP' },
          { value: 'DE', text: 'DE' },
          { value: 'SL', text: 'SL' }
        ],
      subscriber: null,
      notify: []
    };
  },
  productosService: null,
  newsService: null,
  createData: null,

  created() {
    //this.userID = Math.floor(Math.random() * 1000 + 1);
    this.productosService = new ProductService();
    this.newsService = new NewsService();
    //this.setupStreamSpecific();
    console.log("Starting connection to WebSocket Server");
    /*this.connection = new WebSocket("ws://localhost:8080/echo");

    this.connection.onopen = function (event) {
      console.log(event);
      console.log("Successfully connected to the echo websocket server...");
    };

    this.connection.onmessage = function (event) {
      console.log(event);
    };*/
  },
  methods: {
    async cargaProductos() {
      await this.productosService.getAll().then((response) => {
        this.productos = response.data;
      });
    },
    echo: function (dato) {
      console.log(dato);
      console.log(this.connection);
      this.connection.send(dato);
      this.message2.push(dato);
    },
    setupStream() {
      /*
      let es = new EventSource("http://localhost:8091/product/stream/");
      es.addEventListener("message", (event) => {
        this.createData = JSON.parse(event.data);
        console.log(this.createData);
        this.productos.push({
          id: this.createData.id,
          description: this.createData.description,
          price: this.createData.price,
        });
      });*/
    },

    setupStreamSpecific() {
      let esSpecific = new EventSource(
        "http://localhost:8080/news/subscribe?userID=" + this.subscriber+"&departamento=CF" /*product/socket/all"
        /*"http://localhost:8091/product/streams?subscriber=" +
          `${this.subscriber == null ? "" : this.subscriber}`*/
      );
      esSpecific.addEventListener("latestNews", (event) => {
        let createData2 = JSON.parse(event.data);
        console.log(createData2);
        this.message2.push(createData2)
        /*this.productos.push({
          id: createData2.id,
          description: createData2.description,
          price: createData2.price,
        });*/
      });
      esSpecific.addEventListener("error", (event) => {
        console.log("Error : " + event.currentTarget.readyState);
        if (event.currentTarget.readyState == EventSource.connection.CLOSED) {
        } else {
          esSpecific.close();
        }
      });
    },
    mounted() {
      this.cargaProductos();
    },
    notificar(){
      if(this.notify.length > 0){
      this.notify.forEach(element => {
        console.log("insertado en "+ element);
        this.newsService.insertNews("titulo", "descripcion", element)
      });
    }else {
      this.newsService.insertNews("titulo","descripcion", "g")
    }
    }
  },
};
</script>