import * as React from "react";
import { VechaiProvider, Button } from "@vechaiui/react";
import hotkeys from "hotkeys-js";
import clipboard from "clipboardy";
import { sendMessage } from "webext-bridge";
import { motion, useMotionValue } from "framer-motion";
import IconAccessibility from "~icons/carbon/accessibility";
import FaSolidTerminal from "~icons/fa-solid/terminal";

export function ContentApp() {
  const [currentTab, setCurrentTab] = React.useState(null as any);
  const [state, setState] = React.useState({} as any);
  const [position, setPosition] = React.useState({
    right: 0,
    bottom: 0,
  } as any);

  const [show, toggle] = React.useState(false);

  React.useEffect(() => {
    hotkeys("ctrl+`", function (event, handler) {
      toggle((s) => !s);
    });
  }, []);
  const containerY = useMotionValue(0);
  React.useEffect(() => {
    sendMessage("get-current-tab", {
      tabId: 1,
    }).then((d) => {
      setCurrentTab(d);
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
            setState(response.data);
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
  }, []);

  async function urlToClipboard() {
    await clipboard.write(window.location.href);
  }

  async function titleToClipboard() {
    await clipboard.write(document.title);
  }

  async function mdLinkToClipboard() {
    await clipboard.write(`[${document.title}](${window.location.href})`);
  }

  return (
    <VechaiProvider>
      <div
        className="
      text-[16px]
      z-[100000]
      fixed
      my-5
      flex
      flex-col
      font-sans
      select-none
      leading-1em
    "
        style={{
          right: "0",
          bottom: "5em",
        }}
      >
        {show ? (
          <div
            style={{ boxShadow: "0 2px 9px 0 #696969" }}
            className="
        px-[0.75em]
        py-[0.75em]
        bg-[#2b2b2b]
        border-1 border-white
        rounded-l-md
        relative
        shadow-xl
      "
          >
            <div className="h-[4px] w-full bg-red-400"></div>
            <div className="absolute right-1 top-1 flex flex-row align-center">
              <div className="text-gray-400 text-[10px] mr-2">Copy</div>
              {/* <button
                // @click="mdLinkToClipboard()"
                className="bg-[#2b2b2b] border-none cursor-pointer"
              >
                <teenyicons:markdown-outline className="block m-auto text-white text-lg bg-[#2b2b2b]" />
              </button>
              <button
                // @click="titleToClipboard()"
                className="bg-[#2b2b2b] border-none cursor-pointer"
              >
                <ic:round-title className="block m-auto text-white text-lg bg-[#2b2b2b]" />
              </button>
              <button
                // @click="urlToClipboard()"
                className="bg-[#2b2b2b] border-none cursor-pointer"
              >
                <ic:round-http className="block m-auto text-white text-lg bg-[#2b2b2b]" />
              </button>
              <button
                // @click="toggle()"
                className="bg-[#2b2b2b] border-none cursor-pointer"
              >
                <eva:close-fill className="block m-auto text-white text-lg bg-[#2b2b2b]" />
              </button> */}
            </div>
            <iframe
              src="http://localhost:7681"
              className="px-[0.5em] border-none w-[36em] h-[20em]"
            />
          </div>
        ) : (
          <motion.div
            style={{ boxShadow: "0 2px 9px 0 #696969", y: containerY }}
            className="
        flex
        min-w-[40px]
        h-[3em]
        rounded-l-md
        cursor-pointer
        flex-col
        bg-[#2b2b2b] bg-hover:teal-700"
            onClick={() => {}}
          >
            <motion.div
              onPan={(e, info) =>
                containerY.set(containerY.get() + info.delta.y)
              }
              onDoubleClick={() => {
                containerY.set(0);
              }}
              // onPanEnd={(e, info) => {
              //   setPosition({
              //     bottom: info.offset.y,
              //   });
              // }}
              className="h-[6px] w-full cursor-pointer bg-red-400 rounded-tl-md"
            ></motion.div>
            <div className="flex flex-row space-x-[0.5em] px-[0.75em] flex-1 items-center">
              <span className="text-white">
                {
                  state.activities?.find(
                    (act) => act.id === state.currentActivity
                  ).text
                }
              </span>
              <FaSolidTerminal className="block m-auto text-gray-500 text-[1em]" />
            </div>
          </motion.div>
        )}
      </div>
    </VechaiProvider>
  );
}
