<template>
  <router-view />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAccountStore } from './stores/account';
import { useI18n } from 'vue-i18n';
import { useQuasar } from 'quasar';

const accountStore = useAccountStore();
const { locale } = useI18n();
const $q = useQuasar();

const accountLanguage = computed((): string => (
  accountStore.getAccountPreferences?.language || ''
));

const accountDarkTheme = computed((): boolean => {
  if (!accountStore.getAccountPreferences) {
    return true
  }

  return accountStore.getAccountPreferences?.darkTheme
});

const init = async (): Promise<void> => {
  await accountStore.fetchAccount();
  locale.value = accountLanguage.value;
  $q.dark.set(accountDarkTheme.value);
  await accountStore.fetchAccountPhoto('small');
}

init();
</script>
