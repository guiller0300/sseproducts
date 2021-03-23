<template>
  <div class="container mt-5">
    <h3></h3>
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
          <b-button @click="setupStream">Aceptar</b-button>
        </b-input-group-append>
      </b-input-group>
    </b-form-group>
    <div>
      <b-table striped hover :items="productos" :fields="fields"></b-table>
    </div>
  </div>
</template>

<script>
import ProductService from "../services/ProductService";
export default {
  data() {
    return {
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
      subscriber: null,
    };
  },
  productosService: null,
  created() {
    this.productosService = new ProductService();
    this.setupStream();
  },
  methods: {
    async cargaProductos() {
      await this.productosService.getAll().then((response) => {
        this.productos = response.data;
      });
    },
    setupStream() {
      let esSpecific = new EventSource(
        "http://localhost:8091/product/streams?subscriber=" +
          `${this.subscriber == null ? "" : this.subscriber}`
      );
      esSpecific.addEventListener("message", (event) => {
        let createData = JSON.parse(event.data);
        console.log(createData);
        this.productos.push({
          id: createData.id,
          description: createData.description,
          price: createData.price,
        });
      });
    },
  },
  mounted() {
    this.cargaProductos();
  },
};
</script>