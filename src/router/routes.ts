import { RouteRecordRaw } from 'vue-router'

// @mimas: allocated root path of current app, defined in package.json

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
      {
        path: 'nat',
        component: () => import('pages/NatLog/natLogIndex.vue'),
        redirect: '/my/log/nat/list',
        children: [
          {
            path: 'list',
            component: () => import('pages/NatLog/natLogList.vue')
          }]
      },
      // @mimas: about, updates, releases...
      {
        path: 'about',
        component: () => import('pages/AboutPage.vue')
      },
      {
        path: 'http',
        component: () => import('pages/httpLog/HttpIndex.vue'),
        redirect: '/my/log/http/storage',
        children: [{
          path: 'storage',
          component: () => import('pages/httpLog/storage/storageIndex.vue'),
          redirect: '/my/log/http/storage/science',
          children: [
            {
              path: 'science',
              component: () => import('pages/httpLog/storage/scienceCloud.vue')
            },
            {
              path: 'software',
              component: () => import('pages/httpLog/storage/softWarePark.vue')
            },
            {
              path: 'aiops',
              component: () => import('pages/httpLog/storage/aiops.vue')
            }]
        }, {
          path: 'integrate',
          component: () => import('pages/httpLog/cloud/intergrateCloudIndex.vue'),
          redirect: '/my/log/http/integrate/frontend',
          children: [
            {
              path: 'frontend',
              component: () => import('pages/httpLog/cloud/cloudFrontEnd.vue')
            },
            {
              path: 'backend',
              component: () => import('pages/httpLog/cloud/cloudBackEnd.vue')
            }]
        }, {
          path: 'aiopsbot',
          component: () => import('pages/httpLog/Aiops/aiopsLogIndex.vue'),
          redirect: '/my/log/http/aiopsbot/frontend',
          children: [
            {
              path: 'frontend',
              component: () => import('pages/httpLog/Aiops/aiopsFrontEnd.vue')
            },
            {
              path: 'backend',
              component: () => import('pages/httpLog/Aiops/aiopsBackEnd.vue')
            }]
        }
        ]
      }]
  },
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue')
  }
]

export default routes
