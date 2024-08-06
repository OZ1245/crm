<template>
  <div class="col">
    <div class="row">
      <div class="col q-gutter-md">
        <h1 class="text-h2 text-center">
          <q-icon name="account_circle"></q-icon>
          {{ computedName }}
        </h1>
      </div>
    </div>
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
    <div class="row q-mt-md">
      <div class="col q-gutter-md">
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { ref, computed } from 'vue';

import { useI18n } from 'vue-i18n';
import { useAccountStore } from 'stores/account';

import { Models } from 'appwrite';

const { t } = useI18n();
const accountStore = useAccountStore();

const tabs = [
  {
    name: 'general',
    label: t('account.tabs.general'),
    to: '/account/general'
  },
  {
    name: 'sessions',
    label: t('account.tabs.sessions'),
    to: '/account/sessions'
  },
];

const tab = ref<string>('general');

const account = computed((): Models.User<Models.Preferences> => (
  accountStore.getAccount
));

const computedName = computed((): string => {
  if (!account.value?.name?.length) {
    return t('account.noName');
  }

  return account.value.name
})
</script>
