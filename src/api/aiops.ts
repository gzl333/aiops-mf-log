/* 标准api调用函数库,严格与后端接口一致 */
// aiops backend api

/* eslint-disable camelcase */

// import { axiosAiops } from 'boot/axios'

// export default {
//   //  apis
// }

// support api

// support api

/* eslint-disable camelcase */
import { /* axios, */ axiosAiops } from 'boot/axios'

export const apiBaseFed = axiosAiops.defaults.baseURL
// export const apiBaseLogin = apiLogin.defaults.baseURL

export default {
  login: {
    obs: {
      getAskUrl (payload: {
        query: {
          // clientUrl: string;
          // type?: string;
        }
      }) {
        const config = {
          params: payload.query
        }
        return axiosAiops.get('/v1/log/obs/', config)
      }
    }
  },
  log: {
    // 科技云通行证登录接口
    dns: {
      getDnsLog (payload?: {
        query?: {
          direction?: string;
          host_id?: number;
          limit?: number;
          start?: number;
          end?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/dns/host/log', config)
      },
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
    },
    http: {
      getlogcategory (payload?: {
        query?: {
          page?: number;
          page_size?: number;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/log/http-log/category/', config)
      },
      getlogapp (payload?: {
        query?: {
          page?: number;
          page_size?: number;
          status?: string;
          category?: string;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/log/http-log/app/', config)
      },
      getlogappinfo (payload?: {
        query?: {
          start?: number;
          end?: number;
          direction?: string;
          limit?: string;
          app_id?: string;
        }
      }) {
        const config = {
          params: payload?.query
        }
        return axiosAiops.get('v1/log/http-log/log', config)
      }
    }
  }
}
