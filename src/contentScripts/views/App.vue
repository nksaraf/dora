<template>
  <div
    class="
      text-[16px]
      z-[100000]
      fixed
      my-5
      flex
      font-sans
      select-none
      leading-1em
    "
    :style="{ right: position.right, bottom: position.bottom }"
  >
    <div
      v-if="show"
      style="box-shadow: 0 2px 9px 0 #696969"
      class="
        px-[0.75em]
        py-[0.75em]
        bg-[#2b2b2b]
        border-1 border-white
        rounded-l-md
        relative
        shadow-xl
      "
    >
      <div class="absolute right-1 top-1 flex flex-row align-center">
        <div class="text-gray-400 text-[10px] mr-2">Copy</div>
        <button
          @click="mdLinkToClipboard()"
          class="bg-[#2b2b2b] border-none cursor-pointer"
        >
          <teenyicons:markdown-outline
            class="block m-auto text-white text-lg bg-[#2b2b2b]"
          />
        </button>
        <button
          @click="titleToClipboard()"
          class="bg-[#2b2b2b] border-none cursor-pointer"
        >
          <ic:round-title
            class="block m-auto text-white text-lg bg-[#2b2b2b]"
          />
        </button>
        <button
          @click="urlToClipboard()"
          class="bg-[#2b2b2b] border-none cursor-pointer"
        >
          <ic:round-http class="block m-auto text-white text-lg bg-[#2b2b2b]" />
        </button>
        <button
          @click="toggle()"
          class="bg-[#2b2b2b] border-none cursor-pointer"
        >
          <eva:close-fill
            class="block m-auto text-white text-lg bg-[#2b2b2b]"
          />
        </button>
      </div>
      <iframe
        src="http://localhost:7681"
        class="px-[0.5em] border-none w-[36em] h-[20em]"
      />
    </div>
    <div
      v-else
      style="box-shadow: 0 2px 9px 0 #696969"
      class="
        flex
        px-[0.75em]
        min-w-[40px]
        h-[3em]
        rounded-l-md
        cursor-pointer
        flex flex-row
        space-x-[0.5em]
        justify-center
        items-center
      "
      bg="[#2b2b2b] hover:teal-700"
      @click="toggle()"
    >
      <span class="text-white">{{
        state.activities?.find((act) => act.id === state.currentActivity).text
      }}</span>
      <fa-solid:terminal class="block m-auto text-gray-500 text-[1em]" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from "@vueuse/core";
import "virtual:windi.css";
import hotkeys from "hotkeys-js";
import clipboard from "clipboardy";
import { sendMessage } from "webext-bridge";

import { ref } from "vue";

// state

const currentTab = ref(null as any);
const state = ref({} as any);
const position = ref({
  right: 0,
  bottom: "5em",
} as any);

const [show, toggle] = useToggle(false);

hotkeys("ctrl+`", function (event, handler) {
  toggle();
});

onMounted(() => {
  sendMessage("get-current-tab", {
    tabId: 1,
  }).then((d) => {
    currentTab.value = d;
    console.log(currentTab.value, d);
    const endpoint = "ws://127.0.0.1:8080";
    const socket = new WebSocket(endpoint);
    // Connection opened
    socket.addEventListener("open", function (event) {
      socket.send(JSON.stringify({ type: "INITIALIZE_TAB", data: d }));
    });

    // Listen for messages
    socket.addEventListener("message", function (event) {
      let response = JSON.parse(event.data);
      switch (response.type) {
        case "ACK_TAB": {
          console.log("ACK_TAB", response.data);
          break;
        }
        case "UPDATED_STATE": {
          console.log("UPDATED_STATE", response.data);
          state.value = response.data;
        }
      }
    });
  });

  // const endpoint = "ws://127.0.0.1:8080";
  // const socket = new WebSocket(endpoint);
  // // Connection opened
  // socket.addEventListener("open", function (event) {
  //   socket.send("Hello Server!");
  // });

  // // Listen for messages
  // socket.addEventListener("message", function (event) {
  //   console.log("Message from server ", event.data);
  // });
});

async function urlToClipboard() {
  await clipboard.write(window.location.href);
}

async function titleToClipboard() {
  await clipboard.write(document.title);
}

async function mdLinkToClipboard() {
  await clipboard.write(`[${document.title}](${window.location.href})`);
}
</script>
