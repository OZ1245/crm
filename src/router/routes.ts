import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/auth',
        component: () => import('pages/auth/CIndexPage.vue'),
        children: [
          {
            path: 'register',
            component: () => import('pages/auth/CRegister.vue')
          },
          {
            path: 'login',
            component: () => import('pages/auth/CLoginPage.vue')
          }
        ]
      },
      {
        path: '/account',
        component: () => import('pages/account/CAccountPage.vue'),
        children: [
          {
            path: 'general',
            component: () => import('pages/account/CGeneralInfoPage.vue'),
          }
        ]
      },
      {
        path: '/settings',
        component: () => import('pages/settings/CSettingsPage.vue'),
        children: [
          {
            path: 'users',
            component: () => import('pages/settings/CUsersPage.vue')
          }
        ]
      },
    ],
  },

  // Always leave this as last one,
  // but you can also remove it
  {
    path: '/:catchAll(.*)*',
    component: () => import('pages/ErrorNotFound.vue'),
  },
];

export default routes;
