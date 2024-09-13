import { RouteRecordRaw } from 'vue-router';

const routes: RouteRecordRaw[] = [
  {
    path: '/auth',
    component: () => import('layouts/CAuthLayout.vue'),
    children: [
      {
        path: 'register',
        component: () => import('pages/auth/CRegisterPage.vue')
      },
      {
        path: 'login',
        component: () => import('pages/auth/CLoginPage.vue')
      }
    ]
  },
  {
    path: '/',
    component: () => import('layouts/MainLayout.vue'),
    meta: { auth: true },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/project/create', // TODO: Измненить на layout
        component: () => import('pages/project/CreateProjectView.vue')
      },
      {
        path: '/account',
        component: () => import('layouts/CAccountPageLayout.vue'),
        children: [
          {
            path: 'general',
            component: () => import('pages/account/CGeneralInfoPage.vue'),
          },
          {
            path: 'app',
            component: () => import('pages/account/CAppSettingsPage.vue'),
          },
          {
            path: 'sessions',
            component: () => import('pages/account/CSessionsPage.vue'),
          },
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
