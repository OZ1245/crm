import { RouteRecordRaw } from 'vue-router';
import { i18n } from '@/boot/i18n';

const { t } = i18n.global;

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
    name: 'Home',
    component: () => import('layouts/MainLayout.vue'),
    meta: { auth: true, title: t('common.router.titles.home') },
    children: [
      {
        path: '',
        component: () => import('pages/IndexPage.vue')
      },
      {
        path: '/projects',
        name: 'Projects',
        component: () => import('layouts/ProjectLayout.vue'),
        meta: { title: t('common.router.titles.projects') },
        children: [
          {
            path: 'create',
            name: 'Projects.Create',
            component: () => import('pages/project/CreateProjectView.vue'),
            meta: { title: t('common.router.titles.createProject') }
          },
          {
            // path: '/projects/:projectId',
            path: ':projectId',
            name: 'Projects.Boards',
            component: () => import('pages/project/ProjectView.vue'),
            meta: { title: t('common.router.titles.boards') },
            props: true,
          },
          {
            path: '/projects/:projectId/edit',
            name: 'Projects.Edit',
            component: () => import('pages/project/EditProjectView.vue'),
            meta: { title: t('common.router.titles.edit') }
          },
        ]
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
