/* 标准api调用函数库,严格与后端接口一致 */
// aiops backend api

/* eslint-disable camelcase */

import { axiosAiops } from 'boot/axios'

export default {
  log: {
    // 科技云通行证登录接口
    dns: {
      getdnsinfo (payload?: {
        query?: {
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
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/dns/nxdomain/', config)
      }
    }
  }
}
