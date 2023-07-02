<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { getNowFormatDate, payRecordUtcToBeijingYMDHM } from '../../../hooks/processTime'
import aiops from '../../../api/aiops'

// 时间选择
const date = new Date()
date.setMinutes(date.getMinutes() - 1)
const date2 = new Date()
date2.setMinutes(date2.getMinutes() - 2)
const startDate = payRecordUtcToBeijingYMDHM(date2.toISOString())
interface logInfoInterface {
  time?: string | undefined
  client_ip?: string | undefined
  query_domain?: string | undefined
  query_type?: string | undefined
  response_type?: string | undefined
  response_result?: string | undefined
  response_result_list?: string[] | undefined
}
interface logQueryInterface {
  direction?: string;
  host_id?: number;
  limit?: number;
  start?: number;
  end?: number;
}
const direction = ref<string>('forward')
const hostid = ref<number>(30001)
const limit = ref<number>(2)
const start = ref<number>(1688201100)
const end = ref<number>(1688201197)
const dnsLogQuery = ref<logQueryInterface>({
  direction: direction.value,
  host_id: hostid.value,
  limit: limit.value,
  start: start.value,
  end: end.value
})
const allResult = ref()
const getDnsLogInfo = async () => {
  aiops.log.dns.getlogdnsinfo({ query: dnsLogQuery.value }).then((res) => {
    allResult.value = res.data.result
    parseAllResult(allResult.value)
    console.log('res.data.result', res.data.result)
    console.log('allResult1', allResult.value)
    console.log('type(res.data.result)', typeof res.data.result)
    console.log('type(allResult.value)', typeof allResult.value)
  })
}
function parseAllResult (res:any) {
  for (let i = 0; i < res.length; i++) {
    const logInfo = res[i][1]
    logList?.value?.push(parseSingleLog(logInfo))
    console.log('parseSingleLog(logInfo)', parseSingleLog(logInfo))
  }
}
const logList = ref<logInfoInterface[]>([])
function parseSingleLog (value:string) {
  const logData = ref<logInfoInterface>({})
  const valueList = value.split('')
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
  console.log(logDate)
  const dateList = logDate.split('-')
  const year = dateList[2]
  const monthStr = ref(dateList[1])
  const month = ref(0)
  const day = dateList[0]
  const hour = logTime.split(':')[0]
  const minute = logTime.split(':')[1]
  const second = ref(logTime.split(':')[2].split('.')[0])
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
  return year + '-' + month.value + '-' + day + ' ' + hour + ':' + minute + ':' + second.value
}
// function handleDateChange () {
//   const currentDate = new Date() // 获取当前北京时间
//   const utcOffset = currentDate.getTimezoneOffset() / 60 // 获取时区偏移量（分钟转小时）
//   const selectedFromDate = new Date(dateFrom.value)
//   console.log('1', selectedFromDate)
//   const selectedToDate = new Date(dateTo.value)
//   const selectedFromDateNum = selectedFromDate.getTime()
//   console.log('2', selectedFromDateNum)
//   const selectedToDateNum = selectedToDate.getTime()
//   // 判断 dateFrom 是否大于 dateTo，若是则调整为 dateTo
//   if (selectedFromDate > selectedToDate) {
//     dateFrom.value = dateTo.value
//   }
//   // 调整 dateFrom 和 dateTo 不超过当前北京时间
//   const adjustedFromDate = addHours(currentDate, -2 - utcOffset) // 当前时间减去 2 小时
//   const adjustedToDate = addHours(currentDate, -1 - utcOffset) // 当前时间减去 1 小时
//
//   if (selectedFromDate > adjustedFromDate) {
//     dateFrom.value = payRecordUtcToBeijingYMDHM(adjustedFromDate.toISOString())
//   }
//   if (selectedToDate > adjustedToDate) {
//     dateTo.value = payRecordUtcToBeijingYMDHM(adjustedToDate.toISOString())
//   }
//   // 判断 dateFrom 和 dateTo 的时间差是否超过 6 小时，若是则保留一个，调整另一个时间
//   const timeDifference = (selectedToDateNum - selectedFromDateNum) / (1000 * 60 * 60) // 计算时间差（小时）
//   // const timeDifference = Math.abs(selectedToDate - selectedFromDate) / (1000 * 60 * 60) // 计算时间差（小时）
//   if (timeDifference > 6) {
//     if (selectedToDate > selectedFromDate) {
//       const sixHoursLater = addHours(selectedFromDate, 6)
//       dateTo.value = sixHoursLater > currentDate ? payRecordUtcToBeijingYMDHM(currentDate.toISOString()) : payRecordUtcToBeijingYMDHM(sixHoursLater.toISOString())
//     } else {
//       const sixHoursEarlier = addHours(selectedToDate, -6)
//       dateFrom.value = sixHoursEarlier > currentDate ? payRecordUtcToBeijingYMDHM(currentDate.toISOString()) : payRecordUtcToBeijingYMDHM(sixHoursEarlier.toISOString())
//     }
//   }
// }
// 解析函数
// function parseFunction() {
//
// }
// 下拉部分
const pullModel = ref<string>()
const pullOptions = ref<any>([
  { label: '1min', label_en: '1min', value: 'all' },
  { label: '5mins', label_en: '5mins', value: 'all' },
  { label: '15mins', label_en: '15mins', value: 'all' },
  { label: '30mins', label_en: '30mins', value: 'all' },
  { label: '1h', label_en: '1h', value: 'all' },
  { label: '2h', label_en: '2h', value: 'all' },
  { label: '6h', label_en: '6h', value: 'all' }])
// 表格部分
const dnsLogTableRow = ref()
// 数据表字段设计
const dnsLogColumns = computed(() => [
  { name: 'query_time', label: '查询时间', align: 'center' },
  { name: 'client_ip', label: '用户IP', align: 'center' },
  { name: 'query_domain', label: '查询域名', align: 'left' },
  { name: 'query_type', label: '查询类型', align: 'center' },
  { name: 'response_type', label: '响应类型', align: 'center' },
  { name: 'response_result', label: '查询结果', align: 'left' }
])
// 日志筛选——srcIP
// interface SearchInterface {
//   sourceIP?: string,
//   domain?: string,
// }
// const search = ref< SearchInterface >({ sourceIP: '', domain: '' })
// const filterFn = (dnsLogTableRow: any[], search: { sourceIP: string; domain: string }) => {
//   if (search.sourceIP !== '' || search.domain !== '') {
//     dnsLogTableRow = dnsLogTableRow.filter(group =>
//       group?.client_ip.toLowerCase().includes(search.sourceIP || search.domain))
//   }
// }
// 分页表变量
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
// 选择部分    // } else {
//  return dnsLogTableRow.filter((dnsLogTableRow: { sourceIP: string | any[]; domain: string | any[] }) => {
//   // 根据选择框的值筛选出匹配的行
//   const matchesSourceIP = !search.sourceIP || row.sourceIP.includes(search.sourceIP)
//   const matchesDomain = !search.domain || row.domain.includes(search.domain)
//
//   return matchesSourceIP && matchesDomain
// })
// }
const textSrcip = ref('')
const textDomain = ref('')
const selectType = ref('选择')
onMounted(async () => {
  setTimeout(async () => {
    console.log("fuck")
    // 一坨结果传给allResult
    await getDnsLogInfo()
    // 解析allResult，拆分为单个map(logData)，汇总到logList
    console.log('logList.value', logList.value)
    dnsLogTableRow.value = logList.value
  }, 50)
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
                  DNS日志
                </div>
              </div>
              <div class="row">
                <div class="col">
                  <!--                  <q-tabs-->
                  <!--                    v-model="activeItem"-->
                  <!--                    inline-label-->
                  <!--                    align="left"-->
                  <!--                    indicator-color="primary"-->
                  <!--                    active-color="primary"-->
                  <!--                  >-->
                  <!--                    <q-tab no-caps :name="item?.desc_name" v-model="test1" v-for=" (item, index) in bigTabList" class="q-px-none q-py-md q-mr-md" :ripple="false" :label="item?.desc_name"-->
                  <!--                           :key="index"   style="width: 13%" @click="changeBigTabIndex(index,item.desc_name)">-->
                  <!--                    </q-tab>-->
                  <!--                  </q-tabs>-->
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
                        :rows="logList"
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
                            <q-td class="no-padding"  key="sort" :props="props" :label="toggleSort">
                              {{ props.row.time }}
                            </q-td>
                            <!--                            <q-td  :class="['my-table-cell']" class="no-padding" key="creation_time" :props="props">{{ fromatTime(props.row.creation_time.slice(1, -1))}}</q-td>-->
                            <!--                            <q-td  :class="['my-table-cell']" class="no-padding" key="remote_ip" :props="props" style="white-space:normal;">{{ props.row.user_ip }}</q-td>-->
                            <!--                            <q-td  :class="['my-table-cell']" class="no-padding" key="local_ip" :props="props" >{{ props.row.real_ip}}</q-td>-->
                            <!--                            <q-td  :class="['my-table-cell']" class="no-padding" key="upload_stream" :props="props">{{ props.row.upload_stream}}</q-td>-->
                            <!--                            <q-td  :class="['my-table-cell']" class="no-padding" key="down_stream" :props="props">{{ props.row.down_stream}}</q-td>-->
                            <!--                            <q-td  :class="['my-table-cell']" class="no-padding" key="status" :props="props">{{ props.row.status}}</q-td>-->
                            <!--                            <q-td  :class="['my-table-cell1']" class="no-padding" key="request_info" :props="props" style="white-space:normal;word-break:break-all;word-wrap:break-word;">-->
                            <!--                              {{ props.row.request_info }}-->
                            <!--                            </q-td>-->
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
  <div class="Service1Page">
    <div class="row justify-start">
      <!-- 时间选择1 -->
      <div class="col-2">
        <q-input filled dense v-model="dateFrom" mask="datetime" @input="handleDateChange" :value="startDate" >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="dateFrom" mask="YYYY-MM-DD HH:mm" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy cover transition-show="scale" transition-hide="scale">
                <q-time v-model="dateFrom" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <!--      <div class="text-center q-mx-md q-pt-md">至</div>-->
      <!--      &lt;!&ndash; 时间选择2 &ndash;&gt;-->
      <!--      <div class="col-2 q-mr-md">-->
      <!--        <q-input filled dense v-model="dateTo" mask="datetime" @input="handleDateChange" :value="endDate">-->
      <!--          <template v-slot:prepend>-->
      <!--            <q-icon name="event" class="cursor-pointer">-->
      <!--              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">-->
      <!--                <q-date minimal v-model="dateFrom" mask="YYYY-MM-DD HH:mm" format24h >-->
      <!--                  <div class="row items-center justify-end">-->
      <!--                    <q-btn v-close-popup label="Close" color="primary" flat />-->
      <!--                  </div>-->
      <!--                </q-date>-->
      <!--              </q-popup-proxy>-->
      <!--            </q-icon>-->
      <!--          </template>-->
      <!--          <template v-slot:append>-->
      <!--            <q-icon name="access_time" class="cursor-pointer" >-->
      <!--              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">-->
      <!--                <q-time v-model="dateTo" mask="YYYY-MM-DD HH:mm" format24h>-->
      <!--                  <div class="row items-center justify-end">-->
      <!--                    <q-btn v-close-popup label="Close" color="primary" flat />-->
      <!--                  </div>-->
      <!--                </q-time>-->
      <!--              </q-popup-proxy>-->
      <!--            </q-icon>-->
      <!--          </template>-->
      <!--        </q-input>-->
      <!--      </div>-->
      <!-- 时间范围选择 -->
      <q-select transition-show="jump-up" transition-hide="jump-up" v-model="pullModel" :options="pullOptions" label="select time range" class="col-2 row justify-start q-ml-lg" dense/>
      <!-- 表筛选 -->
      <!-- <div class="col-5 row justify-start">
        <q-btn-dropdown :label="selectType" class="q-pl-lg col-3   flat no-shadow" :outline="true">
          <q-list>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-input outlined v-model="textSrcip" label="select by source IP" />
              </q-item-section>
            </q-item>
            <q-item clickable v-close-popup>
              <q-item-section>
                <q-input outlined v-model="textDomain" label="select by domain" />
              </q-item-section>
            </q-item>
          </q-list>
        </q-btn-dropdown>
      </div> -->
      <!-- <div class="col-2 row justify-start q-ml-md" > -->
      <q-input outlined v-model="textSrcip" label="select by source IP" class="col-2 row justify-start q-ml-lg" dense/>
      <!-- </div> -->
      <!-- <div class=> -->
      <q-input outlined v-model="textDomain" label="select by domain" class="col-4 row justify-start q-ml-md" dense/>
      <!-- </div> -->
    </div>
    <!-- 选择模块 -->
    <!--        :rows="searchBucket === '' ? storageTableRow : storageTableAllRow"-->
    <div class="row justify-center" >
      <q-table
        flat
        class="row col-12  justify-start  q-pl-md "
        id="StorageMeteringTable"
        card-class="no-padding"
        table-header-class="bg-grey-1 text-grey"
        :rows="dnsLogTableRow"
        :columns="dnsLogColumns"
        row-key="name"
        color="primary"
        :loading-label="'notifyLoading'"
        :no-data-label="'noData'"
        hide-pagination
        :pagination="{ rowsPerPage: 0 }"
      >
                :filter="dnsLogTableRow"
                :filter-method="filterFn"
        <template v-slot:body="props">
          <q-tr :props="props">
            <!-- <q-td class="no-padding"  key="sort" :props="props">{{ props.row.sort}}</q-td> -->
            <q-td class="no-padding"  key="query_time" :props="props">{{ props.row.time }}</q-td>
            <q-td class="no-padding" style="white-space:normal;word-break:break-all;word-wrap:break-word;" key="client_ip" :props="props">{{ props.row.client_ip}}</q-td>
            <q-td class="no-padding" style="white-space:normal;word-break:break-all;word-wrap:break-word;" key="query_domain" :props="props">{{ props.row.query_domain}}</q-td>
            <q-td class="no-padding" key="query_type" :props="props">{{ props.row.query_type }}</q-td>
            <q-td class="no-padding" key="response_type" :props="props">{{ props.row.response_type}}</q-td>
            <q-td class="no-padding" key="response_result" :props="props">{{ props.row.response_result}}</q-td>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <div class="col-auto row items-center q-gutter-x-xs">
            <span class="text-grey"> (注: 单页限制最大记录数为 1000)</span>
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
  </div>
</template>
