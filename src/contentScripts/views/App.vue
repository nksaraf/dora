<template>
  <div class="fixed right-0 bottom-10 my-5 z-100 flex font-sans select-none leading-1em">
    <div v-if="show" class="px-2 py-2 bg-[#2b2b2b] rounded-l-md relative"><button @click="toggle()" class="absolute bg-transparent border-none right-1 top-1 cursor-pointer">
      <eva:close-fill class="block m-auto text-white text-lg bg-[#2b2b2b]"  />
      </button><iframe src="http://localhost:7681" class="px-2 border-none w-120 h-64" /></div>
    <div v-else
      class="flex w-10 h-12 rounded-l-md shadow cursor-pointer"
      bg="[#2b2b2b] hover:teal-700"
      @click="toggle()"
    >
      <fa-solid:terminal class="block m-auto text-white text-lg" />
    </div>
  </div>
</template>

<script setup lang="ts">
import { useToggle } from '@vueuse/core'
import 'virtual:windi.css'
import hotkeys from 'hotkeys-js'
import clipboard from 'clipboardy';
const [show, toggle] = useToggle(false)

hotkeys('ctrl+`', function(event, handler) {
  event.preventDefault();
  
  (async () => {
    await clipboard.write(window.location.href);

    // Prevent the default refresh event under WINDOWS system
    if (!show.value) {
      toggle()
    }
  })()

});


</script>
