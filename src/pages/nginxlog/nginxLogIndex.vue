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
  await router.push({ path: `/my/log/nginx/${name}` })
}
</script>

<template>
  <div class="PersonalIndex">
    <q-scroll-area style="height: calc(100vh - 60px);">
      <div class="column">

        <div class="col-auto">
          <div class="row justify-center">

            <div class="content-fixed-width">

              <div class="row justify-between q-pt-lg q-pb-sm">

                <div class="col-auto row items-end text-h6 q-px-none">
                  对象存储日志
                </div>

              </div>

              <div class="row">
                <div class="col">
                  <q-tabs
                    v-model="activeItem"
                    inline-label
                    align="left"
                    indicator-color="primary"
                    active-color="primary"
                  >
                    <q-tab no-caps name="list" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('logList')"
                           icon="lab la-bitbucket" @click="changeTab('list')">
                    </q-tab>
                  </q-tabs>
                </div>
              </div>
            </div>
          </div>
        </div>

        <q-separator/>

        <div class="col-auto q-pt-xl">
          <div class="row justify-center">
            <router-view class="content-fixed-width"/>
          </div>
        </div>

      </div>
    </q-scroll-area>
  </div>
</template>

<style lang="scss" scoped>
.Service2Page {
}
</style>
