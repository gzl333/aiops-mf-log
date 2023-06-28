<script setup lang="ts">
console.log(2)
import { ref } from 'vue'
// import { useRoute, useRouter } from 'vue-router'
import { navigateToUrl } from 'single-spa'
const activeItem = ref('frontend')
const changeTab = async (name: string) => {
  activeItem.value = name
  await navigateToUrl(`/my/log/http/aiopsbot/${name}`)
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
      <q-tab no-caps name="frontend" class="text-weight-bold" :ripple="false">
         前端日志
      </q-tab>
      <q-tab no-caps name="backend"  class="text-weight-bold" :ripple="false">
         后端日志
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
