<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
      <q-toolbar>
        <q-breadcrumbs active-color="white">
          <q-breadcrumbs-el
            v-for="(breadcrumb, index) in breadcrumbs"
            :key="index"
            :label="breadcrumb.label"
            :to="breadcrumb.to"
          ></q-breadcrumbs-el>
        </q-breadcrumbs>
      </q-toolbar>
      <q-toolbar>
        <q-btn
          flat
          dense
          round
          icon="menu"
          aria-label="Menu"
          @click="toggleLeftDrawer"
        />

        <q-toolbar-title
          class="cursor-pointer"
          @click="handleTitleClick"
        >
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          {{ title }}
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      v-model="drawerModelValue"
      show-if-above
      bordered
      v-bind="drawerProps"
      class="sidebar flex"
    >
      <q-list class="sidebar__list">
        <q-item-label
          header
          class="flex justify-between items-center"
        >
          <span>Essential Links</span>
          <q-btn
            text-color="gray"
            :title="$t('layouts.buttons.closeDrawer')"
            icon="close"
            size="sm"
            @click="toggleLeftDrawer"
          />
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>

      <q-list class="sidebar__list self-end">
        <essential-link
          :title="accountName"
          :caption="$t('layouts.main.essentialLinks.account.title')"
          icon="account_circle"
          :avatar="accountPhoto"
          link="/account/general"
        >
        </essential-link>
      </q-list>
    </q-drawer>

    <q-page-container>
      <q-page padding>
        <router-view />
      </q-page>
    </q-page-container>
  </q-layout>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue';
import { QBreadcrumbsElProps, useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import EssentialLink from 'components/EssentialLink.vue';
import { EssentialLinkProps } from 'types/components/essentialLink';
import { useAccountStore } from '@/stores/account';
import { Models } from 'appwrite';
import { useRouter, useRoute } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { IProjectDocument } from '@/types/api/project';

interface IDrawerProps {
  mini?: boolean;
}

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const router = useRouter();
const route = useRoute();
const accountStore = useAccountStore();
const projectStore = useProjectStore();

const drawerModelValue = ref<boolean>(false);
const drawerIsOpen = ref<boolean>(false);

// Computed

const project = computed<IProjectDocument | null>(() => (
  projectStore.project
));

const title = computed<string>(() => (
  project.value?.title || 'Mini CRM'
));

const breadcrumbs = computed((): QBreadcrumbsElProps[] => {
  const breadcrumbs = route.matched.map((r) => {
    let params = {};
    const regexp = new RegExp(/^:/gi);
    const splittedPaths = r.path.split('/');
    const foundStrings = splittedPaths.filter((path) => (
      path.match(regexp)
    ));

    if (foundStrings.length) {
      foundStrings.map((str) => {
        const paramName = str.slice(1);
        params = {
          ...params,
          [paramName]: route.params[paramName]
        };
      })
    }

    return {
      label: r.meta.title || r.name || '',
      to: {
        name: r.name,
        params
      }
    }
  });

  return breadcrumbs as QBreadcrumbsElProps[];
});

const essentialLinks = computed<EssentialLinkProps[]>(() => {
  let links: EssentialLinkProps[] = [];

  if (project.value) {
    links = [
      ...links,
      {
        title: t('layouts.main.essentialLinks.projectBoards.title'),
        caption: t('layouts.main.essentialLinks.projectBoards.caption'),
        icon: 'view_kanban',
        link: `/projects/${project.value.$id}`
      },
      {
        title: t('layouts.main.essentialLinks.editProject.title'),
        caption: t('layouts.main.essentialLinks.editProject.caption'),
        icon: 'edit',
        link: `/projects/${project.value.$id}/edit`
      }
    ];
  }

  links = [
    ...links,
    {
      title: t('layouts.main.essentialLinks.settings.title'),
      caption: t('layouts.main.essentialLinks.settings.caption'),
      icon: 'settings',
      link: '/settings'
    }
  ];

  return links;
});

const account = computed<Models.User<Models.Preferences>>(() => (
  accountStore.getAccount
));

const accountPhoto = computed<string>(() => (
  accountStore.avatarSmall?.toString() || ''
));

const accountName = computed<string>(() => {
  if (!account.value?.name?.length) {
    return t('account.noName');
  }

  return account.value.name
})

const isDesktopScreen = computed<boolean>(() => (
  !$q.screen.lt.md
));

const drawerProps = computed<IDrawerProps>(() => {
  let mini = isDesktopScreen.value
    ? !drawerIsOpen.value
    : false;

  return {
    mini
  };
})

const init = (): void => {
  setDrawerMode();
}

const setDrawerMode = (): void => {
  if (isDesktopScreen.value) {
    drawerIsOpen.value = false;
    drawerModelValue.value = true;
  } else {
    drawerIsOpen.value = false;
    drawerModelValue.value = false;
  }
}

const toggleLeftDrawer = (): void => {
  if (isDesktopScreen.value) {
    drawerIsOpen.value = !drawerIsOpen.value;
    drawerModelValue.value = true;
  } else {
    drawerModelValue.value = !drawerModelValue.value;
    drawerIsOpen.value = false;
  }
}

const handleTitleClick = (): void => {
  router.push('/');
}

onMounted(() => {
  init();
})
</script>

<style lang="scss" scoped>
.sidebar__list {
  width: 100%;
}
</style>
