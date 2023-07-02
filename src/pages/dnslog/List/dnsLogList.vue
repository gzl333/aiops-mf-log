
<script setup lang="ts">
import { ref, onMounted, computed } from 'vue'
const activeItem2 = ref<string|undefined>('')
import * as echarts from 'echarts'
import aiops from '../../../api/aiops'
// 调数据接口
interface HttpCategroyQueryInterface {
  limit?: number;
  offset?: number;
}
interface getLogInfoTabListInterface {
  start?: number | undefined;
  end?: number;
  direction?: string;
  limit?: string;
  host_id?: number;
}
const dnsQuery = ref<HttpCategroyQueryInterface>({
})
const bigTabList = ref<any[]>([])
const getHttpCategroyList = async () => {
  await aiops.log.dns.getdnslogtype({ query: dnsQuery.value }).then((res) => {
    bigTabList.value = res.data.results
    activeItem2.value = bigTabList?.value[0].name
  })
}
// 时间处理
const date = new Date()
date.setMonth(date.getMonth())
date.setMinutes(date.getMinutes() - 10)
const date2 = new Date()
function formatDateTime (date:Date): string {
  const year = date?.getFullYear().toString().padStart(4, '0')
  const month = (date?.getMonth() + 1).toString().padStart(2, '0')
  const day = date?.getDate().toString().padStart(2, '0')
  return `${year}-${month}-${day}`
}
function formatMinuteTime (date:Date): string {
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  const second = date.getSeconds().toString().padStart(2, '0')
  const millisecond = date.getMilliseconds().toString().padStart(3, '0')
  return `${hours}:${minutes}:${second}:${millisecond}`
}
const startDate = formatDateTime(date)
const startTime = formatMinuteTime(date)
const currentDate = formatDateTime(date2)
const dateFrom = ref(startDate)
const timeFrom = ref(startTime)
const toggleSort = ref('forward')
const getLogInfoQuery = ref<getLogInfoTabListInterface>({
  direction: toggleSort.value,
  start: Math.floor(new Date(dateFrom.value + ' ' + timeFrom.value).getTime() * 1000000 - 1000000000),
  end: Math.floor(new Date(dateFrom.value + ' ' + timeFrom.value).getTime() * 1000000),
  host_id: 30001
})
// 数据表字段设计
const dnsLogColumns = computed(() => [
  { name: 'query_time', label: '查询时间', align: 'center' },
  { name: 'client_ip', label: '用户IP', align: 'center' },
  { name: 'query_domain', label: '查询域名', align: 'left' },
  { name: 'query_type', label: '查询类型', align: 'center' },
  { name: 'response_type', label: '响应类型', align: 'center' },
  { name: 'response_result', label: '查询结果', align: 'left' }
])
//  解析函数
interface logInfoInterface {
  time?: string | undefined
  client_ip?: string | undefined
  query_domain?: string | undefined
  query_type?: string | undefined
  response_type?: string | undefined
  response_result?: string | undefined
  response_result_list?: string[] | undefined
}
const allResult = ref()
const logList = ref<logInfoInterface[]>([])
function parseAllResult (res:any) {
  for (let i = 0; i < res.length; i++) {
    const logInfo = res[i][1]
    logList?.value?.push(parseSingleLog(logInfo))
  }
}
function parseSingleLog (value:string) {
  const logData = ref<logInfoInterface>({})
  const valueList = value.split(' ')
  logData.value.time = logTime2Datetime(valueList[2], valueList[3])
  logData.value.client_ip = valueList[5]
  logData.value.query_domain = valueList[9]
  logData.value.query_type = valueList[11]
  logData.value.response_type = valueList[12]
  logData.value.response_result_list = []
  if (logData.value.response_type === "NXDOMAIN") {
    logData.value.response_result_list.push("-")
  } else if (logData.value.response_type === "NOERROR") {
    if (valueList.length >= 30) {
      for (let i = 30; i < valueList.length; i++) {
        if (valueList[i] === "A" || valueList[i] === "CNAME") {
          logData.value.response_result_list.push(valueList[i + 1].split(";")[0])
        }
      }
    } else {
      logData.value.response_result_list.push("null")
    }
  }
  return logData.value
}
function logTime2Datetime (logDate:string, logTime:string) {
  const dateList = logDate.split('-')
  const year = dateList[2]
  const monthStr = ref(dateList[1])
  const month = ref(0)
  const day = dateList[0]
  const hour = logTime.split(':')[0]
  const minute = logTime.split(':')[1]
  const second = ref(logTime.split(':')[2])
  console.log(second.value)
  const second2 = second.value.split('.')[0]
  console.log(second2)
  switch (monthStr.value) {
    case "Jan": {
      month.value = 1
      break
    }
    case "Feb": {
      month.value = 2
      break
    }
    case "Mar": {
      month.value = 3
      break
    }
    case "Apr": {
      month.value = 4
      break
    }
    case "May": {
      month.value = 5
      break
    }
    case "Jun": {
      month.value = 6
      break
    }
    case "Jul": {
      month.value = 7
      break
    }
    case "Aug": {
      month.value = 8
      break
    }
    case "Sept": {
      month.value = 9
      break
    }
    case "Oct": {
      month.value = 10
      break
    }
    case "Nov": {
      month.value = 11
      break
    }
    case "Dec": {
      month.value = 12
      break
    }
    default: {
      console.log("非法输入")
      break
    }
  }
  return year + '-' + month.value + '-' + day + ' ' + hour + ':' + minute + ':' + second2
}
// 获取日志数据
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 100
})
const nginxLogTableRow = ref<any[]>()
const getObsloginfo = async () => {
  await aiops.log.dns.getlogdnsinfo({ query: getLogInfoQuery.value }).then((res) => {
    allResult.value = res.data.result
    parseAllResult(allResult.value)
    paginationTable.value.count = logList.value.length
    nginxLogTableRow.value = logList.value
  })
}
// 表单筛选
const timeNumber = ref(10)
const modelTimeUnit = ref({
  label: 'ms',
  value: 'millisecond'
})
const checkdate = async (date: string) => {
  if (new Date(date) > new Date(currentDate)) {
    alert('时间选择无效')
  }
}
const changeSort = async () => {
  getLogInfoQuery.value.direction = toggleSort.value
  logList.value = []
  await getObsloginfo()
}
//  搜索
const search = async () => {
  const startString = ref<number>(0)
  const endString = ref(new Date(dateFrom.value + ' ' + timeFrom.value))
  if (modelTimeUnit.value.value === 'millisecond') {
    startString.value = Math.floor(endString.value.getTime()) - timeNumber.value
  } else if (modelTimeUnit.value.value === 'second') {
    startString.value = Math.floor(endString.value.getTime()) - timeNumber.value * 1000
  } else if (modelTimeUnit.value.value === 'minute') {
    startString.value = Math.floor(endString.value.getTime()) - timeNumber.value * 60 * 1000
  } else if (modelTimeUnit.value.value === 'hour') {
    startString.value = Math.floor(endString.value.getTime()) - timeNumber.value * 60 * 60 * 1000
  }
  getLogInfoQuery.value.start = startString.value * 1000000
  getLogInfoQuery.value.end = Math.floor(endString.value.getTime() * 1000000)
  logList.value = []
  await getObsloginfo()
}

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

function fromatTime (timestamp:string) {
  const day = timestamp.substring(0, 2)
  const month = timestamp.substring(3, 6)
  const year = timestamp.substring(7, 11)
  const time = timestamp.substring(12, 20)
  const monthMap: { [key: string]: string } = {
    Jan: '01',
    Feb: '02',
    Mar: '03',
    Apr: '04',
    May: '05',
    Jun: '06',
    Jul: '07',
    Aug: '08',
    Sep: '09',
    Oct: '10',
    Nov: '11',
    Dec: '12'
  }
  const monthNumber = monthMap[month]
  const formattedDate = `${year}-${monthNumber}-${day} ${time}`
  return formattedDate
}
// 获取时间段间隔一分钟数组
const dates = ref<string[]>([])
const getDayAll = async (starDay: string, endDay: string) => {
  const arr = []
  // 设置两个日期UTC时间
  const db = new Date(starDay)
  const de = new Date(endDay)
  // 获取两个日期GTM时间
  const s = db.getTime() - 60 * 1000
  const d = de.getTime() - 60 * 1000
  // 获取到两个日期之间的每一天的毫秒数
  for (const i = ref<number>(s); i.value <= d;) {
    i.value = i.value + 60 * 1000
    arr.push(parseInt(i.value.toString()))
  }
  // 获取每一天的时间  YY-MM-DD
  for (const j in arr) {
    const time = new Date(arr[j])
    const year = time.getFullYear()
    const mouth = (time.getMonth() + 1) >= 10 ? (time.getMonth() + 1) : ('0' + (time.getMonth() + 1))
    const day = time.getDate() >= 10 ? time.getDate() : ('0' + time.getDate())
    const hour = time.getHours() >= 10 ? time.getHours() : ('0' + time.getHours())
    const minutes = time.getMinutes() >= 10 ? time.getMinutes() : ('0' + time.getMinutes())
    const YYMMDD = year + '-' + mouth + '-' + day + ' ' + hour + ':' + minutes
    dates.value.push(YYMMDD)
  }
  return dates
}
const option = {
  title: {
    text: '趋势'
  },
  tooltip: {
    trigger: 'axis'
  },
  legend: {
    data: ['记录数']
  },
  grid: {
    left: '3%',
    right: '4%',
    bottom: '3%',
    containLabel: true
  },
  toolbox: {
    feature: {
      saveAsImage: {}
    }
  },
  xAxis: {
    type: 'category',
    boundaryGap: false,
    data: dates.value
  },
  yAxis: {
    type: 'value'
  },
  series: [
    {
      name: '记录数',
      type: 'line',
      stack: 'Total',
      data: [220, 230, 222, 234, 233, 250, 290, 220, 230, 222, 234, 233, 250, 290, 220, 230, 222, 234, 233, 250, 290]
    }
  ]
}
// 动态目录
const test2 = ref<any[]>([])
onMounted(async () => {
  await getHttpCategroyList()
  await getObsloginfo()
  await getDayAll(dateFrom.value.toString() + ' ' + '00:00:00', dateFrom.value.toString() + ' ' + '23:59:59')
  const chartDom = document.getElementById('main')!
  const myChart = echarts.init(chartDom)
  await myChart.setOption(option)
  option && myChart.setOption(option)
  myChart.resize({
    width: 1230,
    height: 400
  })
})
//
const changeSmallTab = async (name: string, id: number) => {
  activeItem2.value = name
  getLogInfoQuery.value.host_id = id
  logList.value = []
  await getObsloginfo()
}
const changePageSize = () => {
  paginationTable.value.page = 1
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
                  DNS日志
                </div>
              </div>
              <div class="row">
                <div class="col">
                </div>
              </div>
              <q-separator/>
              <div class="row justify-start q-mt-lg ">
                <div id="main" class="col-12">
                </div>
              </div>
              <div class="row justify-start q-mt-lg ">
                <div class="col-5 row justify-start">
                  <div class="col-4 q-ml-lg">
                    <q-input filled dense v-model="dateFrom" >
                      <template v-slot:prepend>
                        <q-icon name="event" class="cursor-pointer">
                          <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                            <q-date minimal v-model="dateFrom" mask="YYYY-MM-DD">
                              <div class="row items-center justify-end">
                                <q-btn v-close-popup label="确定" color="primary" flat/>
                              </div>
                            </q-date>
                          </q-popup-proxy>
                        </q-icon>
                      </template>
                    </q-input>
                  </div>
                  <q-btn class="col-2 q-ml-md"  outline label="看趋势" @click="search(dateFrom)" dense/>
                  <div class="col-4 q-ml-lg">
                    <q-input filled dense v-model="timeFrom" >
                      <template v-slot:append>
                        <q-icon name="access_time" class="cursor-pointer">
                          <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                            <q-time v-model="dateFrom" format24h @update:model-value="checkdate(dateFrom)" mask="HH:mm:ss:SSS"  with-seconds>
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
                <div class="col-6 row justify-start">
                  <q-toggle
                    class="col-3"
                    v-model="toggleSort"
                    :true-value="'forward'"
                    :false-value="'backward'"
                    :label="toggleSort === 'forward' ? '时间正序':'时间倒序'"
                    @update:model-value="changeSort(toggleSort.toString())"
                  />
                  <div class="col-5 q-ml-md justify-start row">
                    <q-input class="col-7  justify-start row" dense outlined v-model="timeNumber" label="时间跨度">
                    </q-input>
                    <q-select v-model="modelTimeUnit" :options="timeOption" label="单位"  class="col-4 q-ml-md"  outlined dense/>
                  </div>
                  <q-btn class="col-2 q-ml-md" style="height: 40px"  outline label="看明细" @click="search()" dense/>
                </div>
              </div>
              <div class="row q-mt-md">
                <q-tabs
                  v-model="activeItem2"
                  vertical
                  align="justify"
                  active-color="primary"
                  active-bg-color="grey-3"
                  style="width: 16%"
                >
                  <q-tab :activeItem2 ="item1?.name"  :name="item1?.name" v-for=" (item1, index2) in  bigTabList" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="item1?.name" @click="changeSmallTab(item1?.name, item1.id)"
                         :key="index2" no-caps>
                  </q-tab>
                </q-tabs>
                <div style="width: 84%">
                  <div class="Service1Page q-ml-md">
                    <div class="row justify-center" >
                      <q-table
                        style="width: 100%"
                        flat
                        class="row col-20  justify-start  q-pl-md "
                        id="StorageMeteringTable"
                        card-class="no-padding"
                        table-header-class="bg-grey-1 text-grey"
                        :rows="nginxLogTableRow"
                        :columns= "dnsLogColumns"
                        row-key="name"
                        color="primary"
                        :loading-label="'notifyLoading'"
                        :no-data-label="'noData'"
                        hide-pagination
                        v-model:pagination="paginationTable"
                        :pagination="{ rowsPerPage: 0 }"
                      >
                        <template v-slot:body="props">
                          <q-tr :props="props">
                            <q-td class="no-padding"  key="query_time" :props="props" :label="toggleSort">
                              {{ props.row.time }}
                            </q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="client_ip" :props="props" style="white-space:normal;">{{ props.row.client_ip}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="query_domain" :props="props" >{{ props.row.query_domain}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="query_type" :props="props">{{ props.row.query_type}}</q-td>
                            <q-td  :class="['my-table-cell']" class="no-padding" key="response_type" :props="props">{{ props.row.response_type}}</q-td>
                            <q-td  :class="['my-table-cell1']" class="no-padding" key="response_result" :props="props" style="white-space:normal;word-break:break-all;word-wrap:break-word;">
                              {{ props.row.response_result }}
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
                          <q-select class="q-pt-none" color="grey" v-model="paginationTable.rowsPerPage" :options="[100,200,300]" dense options-dense
                                    borderless @update:model-value="changePageSize">
                          </q-select>
                          <span class="q-pt-sm ">页</span>
                        </div>
                        <q-pagination
                          v-model="paginationTable.page"
                          :max="Math.ceil(paginationTable.count/paginationTable.rowsPerPage)"
                          :max-pages="12"
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
.Service1Page {
}
</style>
