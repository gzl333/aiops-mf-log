<script setup lang="ts">
import { ref, computed } from 'vue'
import { getNowFormatDate, payRecordUtcToBeijing } from '../../../hooks/processTime'
// 时间选择器 数据与方法
// const currentDate = getNowFormatDate(1)
const date = new Date()
// date.setHours(date.getHours(), date.getMinutes() - date.getTimezoneOffset())
date.setMonth(date.getMonth())
date.setMinutes(date.getMinutes() - 10)
const date2 = new Date()
// date2.setMonth(date2.getMonth() - 1)
// const startDate = payRecordUtcToBeijing(date2.toISOString())
function setDateFrom (setTime:string) {
  return setTime.split('T')[0]
}
function setDateTO (setTime:string) {
  return setTime.split('T')[0]
}
function formatDateTime (date:Date): string {
  const year = date.getFullYear().toString().padStart(4, '0')
  const month = (date.getMonth() + 1).toString().padStart(2, '0')
  const day = date.getDate().toString().padStart(2, '0')
  const hours = date.getHours().toString().padStart(2, '0')
  const minutes = date.getMinutes().toString().padStart(2, '0')
  return `${year}-${month}-${day} ${hours}:${minutes}`
}
const startDate = formatDateTime(date)
const currentDate = formatDateTime(date2)
const dateFrom = ref(startDate)
const dateTo = ref(currentDate)
// 排序方法与变量
const sortType = ref('集群分类')
const nginxLogTableRow = ref([{
  sort: 1,
  remote_ip: '123.23.23.0',
  local_ip: '235.234.22.0',
  creation_time: '2023-07-08',
  request_info: 'GET/example.html HTTP/1.1',
  upload_stream: '1234',
  down_stream: '12222',
  status: '200',
  bucket_name: 'bucket02'
}, {
  sort: 2,
  remote_ip: '125.23.23.0',
  local_ip: '215.234.22.0',
  creation_time: '2023-07-08',
  request_info: 'Post/example.html HTTP/1.1',
  upload_stream: '9994',
  down_stream: '888882',
  status: '500',
  bucket_name: 'bucket01'
}])
// 数据表字段设计
const nginxLogColumns = computed(() => [
  { name: 'sort', label: '序号', align: 'center' },
  { name: 'remote_ip', label: '远端IP', align: 'center' },
  { name: 'local_ip', label: '本地IP', align: 'center' },
  { name: 'creation_time', label: '时间', align: 'center' },
  { name: 'request_info', label: '请求行', align: 'center' },
  { name: 'upload_stream', label: '上传大小', align: 'center' },
  { name: 'down_stream', label: '下行大小', align: 'center' },
  { name: 'status', label: '状态', align: 'center' },
  { name: 'bucket_name', label: '桶名称', align: 'center' }
])
// 分页表变量
const paginationTable = ref({
  page: 1,
  count: 0,
  rowsPerPage: 10
})
// 饼状图
</script>

<template>
  <div class="Service1Page">
              <div class="row justify-start">
                <div class="col-2">
                  <q-input filled dense v-model="dateFrom" mask="datetime" >
                    <template v-slot:append>
                      <q-icon name="event" class="cursor-pointer">
                        <q-popup-proxy ref="qDateProxy" cover transition-show="scale" transition-hide="scale" >
                          <div class="q-pa-md">
                            <div class="q-gutter-md row items-start">
                              <q-date v-model="dateFrom" mask="YYYY-MM-DD HH:mm" @update:model-value="selectDate" />
                              <q-time v-model="dateFrom" mask="YYYY-MM-DD HH:mm" />
                            </div>
          <!--                <q-date minimal v-model="dateFrom" @update:model-value="selectDate" >-->
          <!--                  <q-time v-model="dateFrom" mask="YYYY-MM-DD HH:mm" color="purple" />-->
                            <div class="row items-center justify-end">
                              <q-btn v-close-popup label="确定" color="primary" flat/>
                            </div>
                          </div>
          <!--                </q-date>-->
                        </q-popup-proxy>
                      </q-icon>
                    </template>
                  </q-input>
                </div>
                <div class="text-center q-mx-md q-pt-md">至</div>
                <div class="col-2 q-mr-md">
                  <q-input filled dense v-model="dateTo" mask="datetime">
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
                  <q-btn-dropdown :label="sortType" class="q-pl-lg col-3   flat no-shadow" :outline="true">
                    <q-list>
                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label>怀柔中心</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label>软件园区</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label>网络中心</q-item-label>
                        </q-item-section>
                      </q-item>
                      <q-item clickable v-close-popup>
                        <q-item-section>
                          <q-item-label>唐家岭</q-item-label>
                        </q-item-section>
                      </q-item>
                    </q-list>
                  </q-btn-dropdown>
                  <div class="text-grey-6 col-9 q-mt-md q-pl-md">
                  <span> 声明: 相关接口正在研发中，本页面暂时使用静态数据</span>
                  </div>
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
                      <q-td class="no-padding"  key="sort" :props="props">
                        {{ props.row.sort}}
                      </q-td>
                      <q-td class="no-padding"  key="remote_ip" :props="props">{{ props.row.remote_ip }}</q-td>
                      <q-td class="no-padding" style="white-space:normal;word-break:break-all;word-wrap:break-word;" key="local_ip" :props="props">{{ props.row.local_ip}}</q-td>
                      <q-td class="no-padding" style="white-space:normal;word-break:break-all;word-wrap:break-word;" key="creation_time" :props="props">{{ props.row.creation_time}}</q-td>
                      <q-td class="no-padding" key="request_info" :props="props">
                        {{ props.row.request_info }}
                      </q-td>
                      <q-td class="no-padding" key="upload_stream" :props="props">{{ props.row.upload_stream}}</q-td>
                      <q-td class="no-padding" key="down_stream" :props="props">{{ props.row.down_stream}}</q-td>
                      <q-td class="no-padding" key="status" :props="props">{{ props.row.status}}</q-td>
                      <q-td class="no-padding" key="status" :props="props">{{ props.row.bucket_name}}</q-td>
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
