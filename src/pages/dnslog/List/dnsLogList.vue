<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { payRecordUtcToBeijingYMDHM } from '../../../hooks/processTime'
// 时间选择
// const currentDate = getNowFormatDate(1)
// console.log('1', currentDate)
const date = new Date()
date.setMinutes(date.getMinutes() - 1)
const endDate = payRecordUtcToBeijingYMDHM(date.toISOString())
const date2 = new Date()
date2.setMinutes(date2.getMinutes() - 2)
const startDate = payRecordUtcToBeijingYMDHM(date2.toISOString())
const dateFrom = ref(startDate)
const dateTo = ref(endDate)
// 表格部分
const dnsLogTableRow = ref([{
  sort: 1,
  query_time: '2023-06-20 12:33:54',
  client_ip: '223.193.36.120',
  query_domain: 'www.baidu.com',
  query_type: 'A',
  response_type: 'NOEEROR',
  // response_result: result_list.value
  response_result: 'www.a.shifen.com.\n181.200.61.6\n181.200.61.7'
}, {
  sort: 2,
  query_time: '2023-06-20 20:53:24',
  client_ip: '223.193.36.119',
  query_domain: 'ipv6.msftconnecttest.com',
  query_type: 'A',
  response_type: 'NOEEROR',
  response_result: 'ncsiv6-geo.trafficmanager.net.\nipv6.msftconnecttest.com.edgesuite.net.\na1968.i6g1.akamai.net.'
}])
// 数据表字段设计
const dnsLogColumns = computed(() => [
  { name: 'sort', label: '序号', align: 'center' },
  { name: 'query_time', label: '查询时间', align: 'center' },
  { name: 'client_ip', label: '用户IP', align: 'center' },
  { name: 'query_domain', label: '查询域名', align: 'left' },
  { name: 'query_type', label: '查询类型', align: 'center' },
  { name: 'response_type', label: '响应类型', align: 'center' },
  { name: 'response_result', label: '查询结果', align: 'left' }
])
// 分页表变量
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
// 选择部分
const textSrcip = ref('')
const textDomain = ref('')
import aiops from '../../../api/aiops'
// 调数据接口
interface DnsQueryInterface {
  page?: number;
  page_size?: number;
  timestamp?: string;
  timestamp_lt?: string;
  timestamp__gt?: number;
  timestamp__gte?: number;
  timestamp__Ite?: number;
  start?: number;
  end?: number;
  ordering?: string;
}
const dnsQuery = ref<DnsQueryInterface>({
})
const result = ref()
const getdns = async () => {
  await aiops.log.dns.getdnsinfo({ query: dnsQuery.value }).then((res) => {
    result.value = res.data.results
  })
  console.log('result', result)
}
onMounted(async () => {
  getdns()
})
</script>

<template>
  <div class="Service1Page">
    <div class="row justify-start">
      <!-- 时间选择1 -->
      <div class="col-2">
        <q-input filled dense v-model="dateFrom" mask="datetime" >
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
      <div class="text-center q-mx-md q-pt-md">至</div>
      <!-- 时间选择2 -->
      <div class="col-2 q-mr-md">
        <q-input filled dense v-model="dateTo" mask="datetime" >
          <template v-slot:prepend>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="dateFrom" mask="YYYY-MM-DD HH:mm" format24h >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
          <template v-slot:append>
            <q-icon name="access_time" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-time v-model="dateTo" mask="YYYY-MM-DD HH:mm" format24h>
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="Close" color="primary" flat />
                  </div>
                </q-time>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div>
        <q-input outlined v-model="textSrcip" label="select by source IP" />
      </div>
      <div class="col-4 row justify-start">
        <q-input outlined v-model="textDomain" label="select by domain" />
      </div>
    </div>
    <!-- 选择模块 -->
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
        <template v-slot:body="props">
          <q-tr :props="props">
            <q-td class="no-padding"  key="sort" :props="props">{{ props.row.sort}}</q-td>
            <q-td class="no-padding"  key="query_time" :props="props">{{ props.row.query_time }}</q-td>
            <q-td class="no-padding" style="white-space:normal;word-break:break-all;word-wrap:break-word;" key="client_ip" :props="props">{{ props.row.client_ip}}</q-td>
            <q-td class="no-padding" style="white-space:normal;word-break:break-all;word-wrap:break-word;" key="query_domain" :props="props">{{ props.row.query_domain}}</q-td>
            <q-td class="no-padding" key="query_type" :props="props">{{ props.row.query_type }}</q-td>
            <q-td class="no-padding" key="response_type" :props="props">{{ props.row.response_type}}</q-td>
            <q-td class="no-padding" key="response_result" :props="props">{{ props.row.response_result}}</q-td>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <div class="col-auto row items-center q-gutter-x-xs">
            <span class="text-grey"> (注: 限制导出最大记录数为 1000)</span>
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

<style lang="scss" scoped>
.Service1Page {
}
</style>
