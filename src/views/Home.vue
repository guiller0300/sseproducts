<template>
  <div>
    <div id="main-content" class="container">
      <div class="row">
        <div class="col-md-6">
          <form class="form-inline">
            <div class="form-group">
              <label for="connect">WebSocket connection:</label>
              <button
                id="connect"
                class="btn btn-default"
                type="submit"
                :disabled="connected == true"
                @click.prevent="connect()"
              >
                Connect
              </button>
              <button
                id="disconnect"
                class="btn btn-default"
                type="submit"
                :disabled="connected == false"
                @click.prevent="disconnect()"
              >
                Disconnect
              </button>
            </div>
          </form>
        </div>
        <div class="col-md-6">
          <form class="form-inline">
            <div class="form-group">
              <label for="name">What is your name?</label>
              <input
                type="text"
                id="name"
                class="form-control"
                v-model="send_message"
                placeholder="Your name here..."
              />
            </div>
            {{ message }}
            <button
              id="send"
              class="btn btn-default"
              type="submit"
              @click.prevent="send"
            >
              Send
            </button>
          </form>
        </div>
      </div>
      <div class="row">
        <div class="col-md-12">
          <table id="conversation" class="table table-striped">
            <thead>
              <tr>
                <th>Greetings</th>
              </tr>
            </thead>
            <tbody>
              <tr v-for="item in received_messages" :key="item">
                <td>{{ item }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import {
  RSocketClient,
  JsonSerializers,
  IdentitySerializer,
} from "rsocket-core";
import RSocketWebSocketClient from "rsocket-websocket-client";
export default {
  name: "websocketdemo",
  data() {
    return {
      message: null,
      websocketUrl: "ws://localhost:6565/rsocket",
      received_messages: [],
      send_message: null,
      connected: false,
    };
  },
  methods: {
    send() {
      console.log("Send message:" + this.send_message);
      if (this.connected) {
        const msg = { name: this.send_message };
        console.log(JSON.stringify(msg));
        this.socket.send(JSON.stringify(msg));
      }
    },
    connect() {
      console.log("connecting with RSocket...");
      const transport = new RSocketWebSocketClient({
        url: "ws://localhost:6565/rsocket",
      });
      const client = new RSocketClient({
        // send/receive JSON objects instead of strings/buffers
        serializers: JsonSerializers,
        metadata: IdentitySerializer,
        setup: {
          // ms btw sending keepalive to server
          keepAlive: 60000,
          // ms timeout if no keepalive response
          lifetime: 180000,
          // format of `data`
          dataMimeType: "application/json",
          // format of `metadata`
          metadataMimeType: "message/x.rsocket.routing.v0",
        },
        transport,
      });
      // error handler
      const errorHanlder = (e) => console.log(e);
      // response handler
      const responseHanlder = (payload) => {
        console.log(payload.data);
      };

      client.connect().subscribe({
        onComplete: (socket) => {
          socket
            .requestStream({
              data: null,
              metadata: encodeAndAddWellKnownMetadata(
              encodeAndAddCustomMetadata(
                Buffer.alloc(0),
                "message/x.rsocket.routing.v0",
              ),
              MESSAGE_RSOCKET_ROUTING,
              Buffer.from(String.fromCharCode("todos".length) + "todos")
            )
            })
            .subscribe({
              onComplete: () => console.log('complete'),
              onError: errorHanlder,
              onNext: responseHanlder,
              onSubscribe: (subscription) => {
                subscription.request(2147483647); // set it to some max value
              },
            });
        },
      });
    },
    /*connect() {
      this.socket = new WebSocket(this.websocketUrl);
      this.socket.onopen = () => {
        console.log("connected to " + this.websocketUrl);
        this.connected = true;
      };
      this.socket.onerror = error => {
        console.log("could not connect to " + this.websocketUrl);
        console.log(error);
      };
      this.socket.onmessage = message => {
        console.log(message.data);
        this.received_messages.push(JSON.parse(message.data).content);
      };
      this.socket.onclose = error => {
        console.log("disconnect from " + this.websocketUrl);
        this.connected = false;
        console.log(error);
      };
    },*/
    disconnect() {
      console.log("trying to disconnect..");
      this.socket.close();
    },
  },
  mounted() {
    // this.connect();
  },
};
</script>