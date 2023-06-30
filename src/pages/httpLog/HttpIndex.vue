<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { i18n } from 'boot/i18n'
import { navigateToUrl } from 'single-spa'
const { tc } = i18n.global
const activeItem = ref('对象存储')
const activeItem2 = ref<string|undefined>('科技云服务单元')
const changeTab = async (name: string) => {
  activeItem.value = name
  await navigateToUrl(`/my/log/http/${name}`)
}
import aiops from '../../api/aiops'
// 调数据接口
interface HttpCategroyQueryInterface {
  page?: number;
  page_size?: number;
}
interface HttpAppQueryInterface {
  page?: number;
  page_size?: number;
  status?: string;
  category?: string;
}
interface bigTabListInterface {
  id: string,
  desc_name?: string,
  sort_weight?: number,
  status?: boolean
}
const dnsQuery = ref<HttpCategroyQueryInterface>({
})
const bigTabList = ref<bigTabListInterface[]>([])
const smallTabList = ref<bigTabListInterface[]>([])
const appQuery = ref<HttpAppQueryInterface>({
  category: 'fb7b8295-0811-4662-9c3b-afa220e71568'
})
const getHttpCategroyList = async () => {
  await aiops.log.http.getlogcategory({ query: dnsQuery.value }).then((res) => {
    bigTabList.value = res.data.results
  })
  await aiops.log.http.getlogapp({ query: appQuery.value }).then((res) => {
    smallTabList.value = res.data.results
  })
}

const getHttpAppList = async (id?: string) => {
  appQuery.value.category = id
  await aiops.log.http.getlogapp({ query: appQuery.value }).then((res) => {
    smallTabList.value = res.data.results
  })
  console.log(' smallTabList.value', smallTabList.value)
}
const changeBigTab = async (name: string, id: string) => {
  activeItem.value = name
  delete appQuery.value.category
  appQuery.value.category = id
  await aiops.log.http.getlogapp({ query: appQuery.value }).then((res) => {
    smallTabList.value = res.data.results
    activeItem2.value = smallTabList?.value[0]?.desc_name
  })
  console.log(' smallTabList.value', smallTabList.value)
}
const changeSmallTab = async (name: string) => {
  activeItem2.value = name
  console.log(name)
}
onMounted(async () => {
  await getHttpCategroyList()
})
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
                  HTTP日志
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
                    <q-tab no-caps :name="item.desc_name" v-for=" item in  bigTabList" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="item.desc_name"
                           :key="item.id"  icon="lab la-bitbucket"  @click="changeBigTab(item.desc_name, item.id)"     style="width: 10%">
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
            <div class="content-fixed-width">
              <div class="row q-mt-md">
                <q-tabs
                  v-model="activeItem2"
                  vertical
                  align="justify"
                  active-color="primary"
                  active-bg-color="grey-3"
                  style="width: 15%"
                >
                  <q-tab v-model="smallTabList" v-for=" item in  smallTabList" :label="item.desc_name"  :key="item.id" no-caps :name="item.desc_name" @click="changeSmallTab(item.desc_name)" class="text-weight-bold" :ripple="false">
                  </q-tab>
                </q-tabs>
                <div style="width: 90%">
                </div>
              </div>
            </div>
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
