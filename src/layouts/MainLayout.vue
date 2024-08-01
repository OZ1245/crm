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

        <q-toolbar-title>
          Mini CRM
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-drawer
      show-if-above
      bordered
      :mini="drawerIsOpen"
    >
      <q-list>
        <q-item-label header>
          Essential Links
        </q-item-label>

        <EssentialLink
          v-for="link in essentialLinks"
          :key="link.title"
          v-bind="link"
        />
      </q-list>
    </q-drawer>

    <q-page-container>
      <router-view />
    </q-page-container>
  </q-layout>
</template>

<script
  setup
  lang="ts"
>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';
import EssentialLink from 'components/EssentialLink.vue';

const { t } = useI18n();

const essentialLinks = [
  {
    title: t('layouts.main.essentialLinks.settings.title'),
    caption: t('layouts.main.essentialLinks.settings.caption'),
    icon: 'settings',
    link: '/settings'
  }
];

const drawerIsOpen = ref(false);

function toggleLeftDrawer() {
  drawerIsOpen.value = !drawerIsOpen.value
}
</script>
