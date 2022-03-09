#!/usr/bin/env deno run --allow-net
import {
  WebSocketClient,
  WebSocketServer,
} from "https://deno.land/x/websocket@v0.1.3/mod.ts";

let clients: any = {};
let state = {
  currentActivity: 1,
  activities: [
    {
      id: 1,
      text: "Hello",
    },
  ],
};
const wss = new WebSocketServer(8080);
wss.on("connection", function (ws: WebSocketClient) {
  let id: string;
  ws.on("close", () => {
    if (id) {
      console.log("disconnecting", id);
      delete clients[id];
    }
  });
  ws.on("message", (ev: string) => {
    let data = JSON.parse(ev) as any;
    switch (data.type) {
      case "INITIALIZE_TAB": {
        clients[data.data.id] = { ws, data: data.data };
        console.log("connecting", data, data.data.id);
        id = data.data.id;
        ws.send(JSON.stringify({ type: "ACK_TAB", data: data.data }));
        ws.send(JSON.stringify({ type: "UPDATED_STATE", data: state }));
        break;
      }
      case "CHECK_STATE": {
        ws.send(JSON.stringify({ type: "CHECKED_STATE", data: state }));
        break;
      }
      case "SET_STATE": {
        state = data.data;
        for (var client of Object.keys(clients)) {
          clients[client].ws.send(
            JSON.stringify({ type: "UPDATED_STATE", data: state })
          );
        }
      }
    }
  });
});
