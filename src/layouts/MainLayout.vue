<template>
  <q-layout view="lHh Lpr lFf">
    <q-header elevated>
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
          Mini CRM
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
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import EssentialLink from 'components/EssentialLink.vue';
import { EssentialLinkProps } from 'types/components/essentialLink';
import { useAccountStore } from '@/stores/account';
import { Models } from 'appwrite';
import { useRouter } from 'vue-router';

interface IDrawerProps {
  mini?: boolean;
}

const { t } = useI18n({ useScope: 'global' });
const $q = useQuasar();
const router = useRouter();
const accountStore = useAccountStore();

const drawerModelValue = ref<boolean>(false);
const drawerIsOpen = ref<boolean>(false);

// Computed

const essentialLinks = computed<EssentialLinkProps[]>(() => [
  {
    title: t('layouts.main.essentialLinks.settings.title'),
    caption: t('layouts.main.essentialLinks.settings.caption'),
    icon: 'settings',
    link: '/settings'
  }
]);

const account = computed((): Models.User<Models.Preferences> => (
  accountStore.getAccount
));

const accountPhoto = computed((): string => (
  accountStore.avatarSmall?.toString() || ''
));

const accountName = computed((): string => {
  if (!account.value?.name?.length) {
    return t('account.noName');
  }

  return account.value.name
})

const isDesktopScreen = computed((): boolean => (
  !$q.screen.lt.md
));

const drawerProps = computed((): IDrawerProps => {
  let mini = isDesktopScreen.value
    ? !drawerIsOpen.value
    : false;

  return {
    mini
  };
})

const init = () => {
  setDrawerMode();
}

const setDrawerMode = () => {
  if (isDesktopScreen.value) {
    drawerIsOpen.value = false;
    drawerModelValue.value = true;
  } else {
    drawerIsOpen.value = false;
    drawerModelValue.value = false;
  }
}

const toggleLeftDrawer = () => {
  if (isDesktopScreen.value) {
    drawerIsOpen.value = !drawerIsOpen.value;
    drawerModelValue.value = true;
  } else {
    drawerModelValue.value = !drawerModelValue.value;
    drawerIsOpen.value = false;
  }
}

const handleTitleClick = () => {
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
