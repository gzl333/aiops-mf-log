import { RouteRecordRaw } from 'vue-router'

// @mimas: allocated root path of current app, defined in package.json
const appPath = process.env.appPath as string

const routes: RouteRecordRaw[] = [
  {
    path: '/my/log',
    component: () => import('layouts/MainLayout.vue'),
    redirect: '/my/log/dns',
    children: [
      {
        path: 'dns',
        component: () => import('pages/dnslog/dnsLogIndex.vue'),
        redirect: '/my/log/dns/list',
        children: [
          {
            path: 'list',
            component: () => import('pages/dnslog/List/dnsLogList.vue')
          },
          {
            path: 'trajectory',
            component: () => import('pages/dnslog/trajectory/TrajectoryIndex.vue')
          },
          {
            path: 'area',
            component: () => import('pages/dnslog/area/AreaIndex.vue')
          }]
      },
      // @mimas: about, updates, releases...
      {
        path: 'about',
        component: () => import('pages/AboutPage.vue')
      },
      {
        path: 'nginx',
        component: () => import('pages/nginxlog/nginxLogIndex.vue'),
        redirect: '/my/log/nginx/list',
        children: [
          {
            path: 'list',
            component: () => import('pages/nginxlog/list/nginxLogList.vue')
          },
          {
            path: 'trajectory',
            component: () => import('pages/nginxlog/trajectory/TrajectoryIndex.vue')
          },
          {
            path: 'area',
            component: () => import('pages/nginxlog/area/AreaIndex.vue')
          }]
      }]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
