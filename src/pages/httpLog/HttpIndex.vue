<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
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

// const getHttpAppList = async (id?: string) => {
//   appQuery.value.category = id
//   await aiops.log.http.getlogapp({ query: appQuery.value }).then((res) => {
//     smallTabList.value = res.data.results
//   })
//   console.log(' smallTabList.value', smallTabList.value)
// }
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

// 表格内容
const date = new Date()
date.setMonth(date.getMonth())
date.setMinutes(date.getMinutes() - 10)
const date2 = new Date()
function formatDateTime (date:Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  const millisecond = date.getMilliseconds().toString().padStart(3, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}:${second}:${millisecond}`
}
function formatTimestamp (timestamp: number): string {
  const date = new Date(timestamp * 1000)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  const hours = String(date.getHours()).padStart(2, '0')
  const minutes = String(date.getMinutes()).padStart(2, '0')
  const seconds = String(date.getSeconds()).padStart(2, '0')
  const formattedDate = `${year}-${month}-${day}`
  const formattedTime = `${hours}:${minutes}:${seconds}`
  return `${formattedDate} ${formattedTime}`
}

const startDate = formatDateTime(date)
const currentDate = formatDateTime(date2)
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
// 排序方法与变量
const sortType = ref('集群分类')
// 数据表字段设计
const nginxLogColumns = computed(() => [
  { name: 'creation_time', label: '时间', align: 'center' },
  { name: 'remote_ip', label: '源IP', align: 'center' },
  { name: 'local_ip', label: '服务IP', align: 'center' },
  { name: 'bucket_name', label: '桶名称', align: 'center' },
  { name: 'upload_stream', label: '上行流量', align: 'center' },
  { name: 'down_stream', label: '下行流量', align: 'center' },
  { name: 'status', label: '状态', align: 'center' },
  { name: 'request_info', label: '请求行', align: 'center' }
])
// 分页表变量
const paginationTable = ref({
  page: 2,
  count: 20,
  rowsPerPage: 5
})
interface resultInterface {
  real_ip: string,
  datetime: number,
  user_ip: string,
  bucket: string,
  status: number,
  req_bytes: number,
  res_bytes: number,
  type: string,
  http_referer: string
}
const nginxLogTableRow = ref<resultInterface[]>()
const getObsloginfo = async () => {
  await aiops.login.obs.getAskUrl({ query: {} }).then((res) => {
    nginxLogTableRow.value = res.data.results
  })
}
// 表单筛选
const toggleSort = ref('backward')
const timeNumber = ref()
const checkdate = async (date: string) => {
  if (new Date(date) > new Date(currentDate)) {
    alert('时间选择无效')
  }
  console.log('dateFromchange', date)
}
const search = async (date2: string) => {
  const list = dateFrom.value.split(':')
  const listresult = list[3]
  if (listresult.length > 3) {
    alert('时间选择无效')
  }
  console.log('dateFromchange3', dateFrom.value)
}

const modelTimeUnit = ref({
  label: 'ms',
  value: 'millisecond'
})

const timeOption = [
  {
    label: 'ms',
    value: 'millisecond'
  },
  {
    label: 's',
    value: 'second'
  }, {
    label: 'min',
    value: 'minute'
  },
  {
    label: 'h',
    value: 'hour'
  }
]
onMounted(async () => {
  await getObsloginfo()
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
                           :key="item.id"  icon="lab la-bitbucket"  @click="changeBigTab(item.desc_name, item.id)"     style="width: 13%">
                    </q-tab>
                  </q-tabs>
                </div>
              </div>
<!--            </div>-->
<!--          </div>-->
<!--        </div>-->
        <q-separator/>
              <div class="row justify-start q-mt-lg ">
                <div class="col-3 row justify-start">
                  <div class="col-10 q-ml-lg">
                  <q-input filled dense v-model="dateFrom" >
                    <template v-slot:prepend>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                          <q-date minimal v-model="dateFrom" mask="YYYY-MM-DD HH:mm:ss:sss">
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat/>
                            </div>
                          </q-date>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                    <template v-slot:append>
                      <q-icon name="access_time" class="cursor-pointer">
                        <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                          <q-time v-model="dateFrom" format24h @update:model-value="checkdate(dateFrom)" mask="YYYY-MM-DD HH:mm:ss:SSS"  with-seconds>
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat/>
                            </div>
                          </q-time>
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                  </div>
                </div>
                <div class="col-9 row justify-start">
                  <q-toggle
                    class="col-2"
                    v-model="toggleSort"
                    :true-value="'backward'"
                    :false-value="'forward'"
                    :label="toggleSort === 'backward' ? '时间正序':'时间倒序'"
                  />
                <div class="col-3 q-ml-md justify-start row">
                  <q-input class="col-7  justify-start row" dense outlined v-model="timeNumber" label="时间跨度">
                  </q-input>
                  <q-select v-model="modelTimeUnit" :options="timeOption" label="单位"  class="col-4 q-ml-md"  outlined dense/>
                </div>
                <q-btn class="col-1 q-ml-md" style="height: 40px"  outline label="搜索" @click="search(dateFrom)" dense/>
                  <div class="col-5 row justify-end q-gutter-x-xs">
                    <q-btn
                      class="col-auto"
                      color="primary"
                      flat
                      :label="'导出当页数据'"
                      no-caps
                      dense
                      @click="exportTable()"
                    />
                    <q-btn
                      class="col-auto"
                      color="primary"
                      flat
                      :label="'导出全部数据'"
                      no-caps
                      dense
                      @click="exportAllTable"
                    />
                    <span class="text-grey"> (注: 限制导出最大记录数为 1000)</span>
                  </div>
                </div>
              </div>
<!--        <div class="col-auto q-pt-xl">-->
<!--          <div class="row justify-center">-->
<!--            <div class="content-fixed-width">-->
              <div class="row q-mt-md">
                <q-tabs
                  v-model="activeItem2"
                  vertical
                  align="justify"
                  active-color="primary"
                  active-bg-color="grey-3"
                  style="width: 16%"
                >
                  <q-tab v-model="smallTabList" v-for=" item in  smallTabList" :label="item.desc_name"  :key="item.id" no-caps :name="item.desc_name" @click="changeSmallTab(item.desc_name)" class="text-weight-bold" :ripple="false">
                  </q-tab>
                </q-tabs>
                <div style="width: 84%">
                  <div class="Service1Page q-ml-md">
                    <div class="row justify-center" >
                      <q-table
                        flat
                        class="row col-20  justify-start  q-pl-md "
                        id="StorageMeteringTable"
                        card-class="no-padding"
                        table-header-class="bg-grey-1 text-grey"
                        :rows="nginxLogTableRow"
                        :columns="nginxLogColumns"
                        row-key="name"
                        color="primary"
                        :loading-label="'notifyLoading'"
                        :no-data-label="'noData'"
                        hide-pagination
                        :pagination="{ rowsPerPage: 0 }"
                      >
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td class="no-padding"  key="sort" :props="props" :label="toggleSort">
                              {{ props.row.sort}}
                            </q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="creation_time" :props="props">{{ formatDateTime(props.row.datetime)}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="remote_ip" :props="props" style="white-space:normal;">{{ props.row.user_ip }}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="local_ip" :props="props" >{{ props.row.real_ip}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="status" :props="props">{{ props.row.bucket}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="upload_stream" :props="props">{{ props.row.req_bytes}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="down_stream" :props="props">{{ props.row.res_bytes}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="status" :props="props">{{ props.row.status}}</q-td>
                            <q-td  :class="['my-table-cell1']" class="no-padding" key="request_info" :props="props" style="white-space:normal;word-break:break-all;word-wrap:break-word;">
                              {{ props.row.http_referer }}
                            </q-td>
                          </q-tr>
                        </template>
                        <template v-slot:top-right>
                          <div class="col-auto row items-center q-gutter-x-xs">
                          </div>
                        </template>
                      </q-table>
                      <q-separator/>
                    </div>
                    <div class="text-grey q-mt-lg row justify-start q-mb-lg">
                      <div class="row col-12  justify-start ">
                        <div class="col-4 justify-start row ">
                          <span class="q-ml-xl q-pt-sm q-pr-md " >共{{ paginationTable.count }}条数据</span>
                          <q-select class="q-pt-none" color="grey" v-model="paginationTable.rowsPerPage" :options="[10,15,20,25,30]" dense options-dense
                                    borderless @update:model-value="changePageSize">
                          </q-select>
                          <span class="q-pt-sm ">页</span>
                        </div>
                        <q-pagination
                          v-model="paginationTable.page"
                          :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
                          :max-pages="9"
                          direction-links
                          outline
                          :ripple="false"
                          @click="changePagination"
                          class="col-8 justify-end q-pr-lg"
                        />
                      </div>
                    </div>
                    <q-separator></q-separator>
                  </div>
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
