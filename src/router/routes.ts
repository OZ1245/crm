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
        path: '/register',
        component: () => import('pages/auth/CRegister.vue')
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
