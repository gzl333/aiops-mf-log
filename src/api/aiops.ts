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
  }
}
