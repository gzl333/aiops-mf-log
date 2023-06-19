<script setup lang="ts">
import { ref/* , computed  */ } from 'vue'
import useCopyToClipboard from 'src/composables/useCopyToClipboard'
const input = ref<string>('')
const copy = useCopyToClipboard()
</script>

<template>
  <div class="Service1Page">
    this is realtimeData
  </div>
</template>

<style lang="scss" scoped>
.Service1Page {
}
</style>
