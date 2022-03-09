#!/usr/bin/env deno run --no-check -A
import {
  WebSocketClient,
  StandardWebSocketClient,
} from "https://deno.land/x/websocket@v0.1.3/mod.ts";

// import OffsetSource from "https://esm.sh/@atjson/offset-annotations";
// import CommonMarkSource from "https://esm.sh/@atjson/source-commonmark";

// let document = CommonMarkSource.fromRaw(
//   Deno.readTextFileSync(
//     "/Users/nikhilsaraf/garage/dendron/vault/daily.journal.2022.03.08.md"
//   )
// );
// import { YouTubeEmbed } from "https://esm.sh/@atjson/offset-annotations";
// import HTMLRenderer from "https://esm.sh/@atjson/renderer-html";

// console.log(document);
// export default class MyHTMLRenderer extends HTMLRenderer {
//   *YoutubeEmbed(embed: YouTubeEmbed) {
//     return yield* this.$("iframe", {
//       width: embed.attributes.width,
//       height: embed.attributes.height,
//       src: embed.attributes.url,
//       frameborder: "0",
//       allow:
//         "accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture",
//       allowfullscreen: true,
//     });
//   }
// }

// console.log(MyHTMLRenderer.render(document));

const endpoint = "ws://127.0.0.1:8080";
const ws: WebSocketClient = new StandardWebSocketClient(endpoint);
ws.on("open", function () {
  console.log("ws connected!");
  ws.send(JSON.stringify({ type: "CHECK_STATE" }));
});
ws.on("message", function (ev: MessageEvent) {
  const data = JSON.parse(ev.data);
  switch (data.type) {
    case "CHECKED_STATE": {
      console.log("CHECKED_STATE", data);
      ws.close();
      Deno.exit(0);
    }
  }
});
