<template>
  <div class="q-pa-md">
    <div class="row">
      <div class="col">
        <q-tabs
          v-model="tab"
          class="text-teal"
        >
          <q-route-tab
            v-for="(tab, index) in tabs"
            :key="index"
            v-bind="tab"
          />
        </q-tabs>
      </div>
    </div>

    <div class="row">
      <router-view></router-view>
    </div>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { ref } from 'vue';
import { useI18n } from 'vue-i18n';

const { t } = useI18n();

const tabs = [
  {
    label: t('settings.tabs.general'),
    to: '/settings/general'
  },
  {
    label: t('settings.tabs.users'),
    to: '/settings/users'
  },
];

const tab = ref<string>('general');
</script>
