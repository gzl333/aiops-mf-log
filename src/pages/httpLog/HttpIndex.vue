<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { i18n } from 'boot/i18n'
import { navigateToUrl } from 'single-spa'
const { tc } = i18n.global
const activeItem = ref('storage')
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
interface bigTabListInterface {
  id: string,
  desc_name?: string,
  sort_weight?: number,
  status?: boolean
}
const dnsQuery = ref<HttpCategroyQueryInterface>({
})
const bigTabList = ref<bigTabListInterface[]>([])
const getHttpCategroyList = async () => {
  await aiops.log.http.getlogcategory({ query: dnsQuery.value }).then((res) => {
    bigTabList.value = res.data.results
  })
}
const changeBigTab = async (name: string) => {
  console.log(name)
}
onMounted(async () => {
  await getHttpCategroyList()
})
</script>

<template>
  <!--                    <q-route-tab-->
  <!--                      v-for="(item, index) in  bigTabList"-->
  <!--                      :key="index"-->
  <!--                      :name="item.desc_name"-->
  <!--                      :label="t(item.desc_name)"-->
  <!--                      :icon="item.icon"-->
  <!--                      :to="{name: item.pathName}"-->
  <!--                      :disable="item.disable"-->
  <!--                    />-->
  <!--                    <q-tab no-caps name="integrate" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('一体云')"-->
  <!--                           icon="lab la-bitbucket" @click="changeTab('integrate')">-->
  <!--                    </q-tab>-->
  <!--                    <q-tab no-caps name="aiopsbot" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('Aiops站点')"-->
  <!--                           icon="lab la-bitbucket" @click="changeTab('aiopsbot')">-->
  <!--                    </q-tab>-->
  <!--                    <q-tab no-caps name="website" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="tc('网站群')"-->
  <!--                           icon="lab la-bitbucket" @click="changeTab('website')">-->
  <!--                    </q-tab>-->
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

            </div>
          </div>
        </div>
        <q-separator/>
        <div class="col-auto q-pt-xl">
          <div class="row justify-center">
            <div class="content-fixed-width">
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
                  <q-tab no-caps name="science" class="text-weight-bold" :ripple="false" >
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
