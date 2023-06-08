<script setup lang="ts">
import { onMounted, Ref, ref } from 'vue'
import { useStore } from 'stores/store'
import { useRouter } from 'vue-router'
import { i18n } from 'boot/i18n'
const { tc } = i18n.global
const store = useStore()
const activeItem = ref(store.items.currentPath[1])
const router = useRouter()
const changeTab = async (name: string) => {
  activeItem.value = name
  await router.push({ path: name })
}

</script>

<template>
  <div class="PersonalIndex">
    <div class="column q-mt-md">
      <div class="row justify-start q-ml-lg">
        <div class="">
          <q-tabs
            v-model="activeItem"
            inline-label
            align="left"
            indicator-color="primary"
            active-color="primary"
          >
            <q-tab no-caps name="realtime" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('realtime')"
                   icon="lab la-bitbucket" @click="changeTab('realtime')">
            </q-tab>
            <q-tab no-caps name="trajectory" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('trajectory')"
                   icon="las la-user-alt" @click="changeTab('trajectory')">
            </q-tab>
            <q-tab no-caps name="area" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('area')"
                   icon="las la-user-alt" @click="changeTab('area')">
            </q-tab>
          </q-tabs>
        </div>
      </div>
      <q-separator/>
      <div class="">
        <router-view />
      </div>
    </div>
  </div>
</template>

<style lang="scss" scoped>
.Service2Page {
}
</style>
