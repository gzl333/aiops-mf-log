<script setup lang="ts">
import { ref } from 'vue'
import { navigateToUrl } from 'single-spa'
const activeItem = ref('science')
const changeTab = async (name: string) => {
  activeItem.value = name
  await navigateToUrl(`/my/log/http/storage/${name}`)
}
</script>

<template>
  <div class="row q-mt-md">
    <q-tabs
      v-model="activeItem"
      vertical
      align="justify"
      active-color="primary"
      active-bg-color="grey-3"
      style="width: 10%"
      @update:model-value="changeTab"
    >
      <q-tab no-caps name="science" class="text-weight-bold" :ripple="false">
         科技云日志
      </q-tab>
      <q-tab no-caps name="software"  class="text-weight-bold" :ripple="false">
         软件园日志
      </q-tab>
      <q-tab no-caps name="aiops"  class="text-weight-bold" :ripple="false">
        Aiops日志
      </q-tab>
    </q-tabs>
    <div style="width: 90%">
      <router-view></router-view>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Service2Page {
}
</style>
