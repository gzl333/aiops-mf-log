
<script setup lang="ts">
import { ref, computed } from 'vue'
import { getNowFormatDate, payRecordUtcToBeijing } from '../../hooks/processTime'
// 时间选择器 数据与方法
const currentDate = getNowFormatDate(1)
const date = new Date()
date.setHours(date.getHours(), date.getMinutes() - date.getTimezoneOffset())
date.setMonth(date.getMonth())
const date2 = new Date()
date2.setMonth(date2.getMonth() - 1)
const startDate = payRecordUtcToBeijing(date2.toISOString())
// function setDateFrom (setTime:string) {
//   return setTime.split('T')[0]
// }
// function setDateTO (setTime:string) {
//   return setTime.split('T')[0]
// }
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
const nginxLogTableRow = ref([{
  creation_time: '2023-07-08',
  sort: 1,
  remote_ip: '123.23.23.0',
  local_ip: '235.234.22.0',
  request_info: 'GET/example.html HTTP/1.1',
  upload_stream: '1234',
  down_stream: '12222',
  status: '200'
}, {
  creation_time: '2023-07-08',
  sort: 2,
  remote_ip: '125.23.23.0',
  local_ip: '215.234.22.0',
  request_info: 'Post/example.html HTTP/1.1',
  upload_stream: '9994',
  down_stream: '888882',
  status: '500'
}])
// 数据表字段设计
const nginxLogColumns = computed(() => [
  { name: 'create_time', label: 'NAT时间', align: 'center' },
  { name: 'mac_address', label: '设备mac地址', align: 'center' },
  { name: 'origin_ip', label: '源IP地址', align: 'center' },
  { name: 'origin_port', label: '源端口', align: 'center' },
  { name: 'target_ip', label: '目的IP地址', align: 'center' },
  { name: 'target_port', label: '目的端口', align: 'center' },
  { name: 'transform_origin_ip', label: '转换后源IP地址', align: 'center' },
  { name: 'transform_origin_port', label: '转换后源端口', align: 'center' },
  { name: 'package_size', label: '数据包大小', align: 'center' }
])
// 分页表变量
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
// 服务单元筛选框数据类型接口
interface ServiceInterface {
  label?: string,
  label_en?: string,
  value?: string
}
const deviceOptions = ref< ServiceInterface[] >([{ label: '全部设备', label_en: 'all', value: 'all' }, { label: 'H3C', label_en: 'H3C', value: 'H3C' }, { label: '华为MSR系列路由器', label_en: 'H3C', value: '华为MSR系列路由器' }])

const device = ref({
  label: '全部设备',
  labelEn: 'All Device',
  value: ''
})
const search = ref<string>('')
</script>

<template>
  <div class="Service1Page">
             <div class="row justify-start">
      <div class="col-2">
        <q-input filled dense v-model="dateFrom" mask="date" >
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale" >`
                <q-date minimal v-model="dateFrom" @update:model-value="selectDate" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="text-center q-mx-md q-pt-md">至</div>
      <div class="col-2 q-mr-md">
        <q-input filled dense v-model="dateTo" mask="date">
          <template v-slot:append>
            <q-icon name="event" class="cursor-pointer">
              <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale">
                <q-date minimal v-model="dateTo" @update:model-value="selectDate" >
                  <div class="row items-center justify-end">
                    <q-btn v-close-popup label="确定" color="primary" flat/>
                  </div>
                </q-date>
              </q-popup-proxy>
            </q-icon>
          </template>
        </q-input>
      </div>
      <div class="col-6 row justify-start">
        <q-select v-model="device" :options="deviceOptions" label="请选择设备" outlined class=" row col-3 q-py-ms q-mr-lg" dense/>
        <div class="col-3 q-mr-lg">
        <q-input dense outlined v-model="search" placeholder="请输入源IP">
          <template v-slot:prepend>
            <q-icon name="search"/>
          </template>
          <template v-slot:append v-if="search">
            <q-icon name="close" @click="search = ''" class="cursor-pointer"/>
          </template>
        </q-input>
        </div>
        <div class="col-3">
        <q-input dense outlined v-model="search" placeholder="请输入目的IP">
          <template v-slot:prepend>
            <q-icon name="search"/>
          </template>
          <template v-slot:append v-if="search">
            <q-icon name="close" @click="search = ''" class="cursor-pointer"/>
          </template>
        </q-input>
        </div>
        <div class='col-2'><q-btn style="height: 40px"  outline label="检索" class="q-px-lg q-ml-lg" @click="search"/></div>
      </div>
    </div>
                <div class="row justify-center" >
       <q-table
        flat
        class="row col-12  justify-start  q-pl-md "
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
            <q-td class="no-padding"  key="create_time" :props="props">
              {{ props.row.sort}}
            </q-td>
            <q-td class="no-padding"  key="mac_address" :props="props">{{ props.row.remote_ip }}</q-td>
            <q-td class="no-padding" style="white-space:normal;word-break:break-all;word-wrap:break-word;" key="origin_ip" :props="props">{{ props.row.local_ip}}</q-td>
            <q-td class="no-padding" style="white-space:normal;word-break:break-all;word-wrap:break-word;" key="origin_port" :props="props">{{ props.row.creation_time}}</q-td>
            <q-td class="no-padding" key="target_ip" :props="props">
              {{ props.row.request_info }}
            </q-td>
            <q-td class="no-padding" key="target_port" :props="props">{{ props.row.upload_stream}}</q-td>
            <q-td class="no-padding" key="transform_origin_ip" :props="props">{{ props.row.down_stream}}</q-td>
            <q-td class="no-padding" key="transform_origin_port" :props="props">{{ props.row.status}}</q-td>
            <q-td class="no-padding" key="package_size" :props="props">{{ props.row.status}}</q-td>
          </q-tr>
        </template>
        <template v-slot:top-right>
          <div class="col-auto row items-center q-gutter-x-xs">
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
</template>

<style lang="scss" scoped>
.Service1Page {
}
</style>
