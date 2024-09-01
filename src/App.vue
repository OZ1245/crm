<template>
  <router-view />
</template>

<script setup lang="ts">
import { computed } from 'vue';
import { useAccountStore } from './stores/account';
import { useI18n } from 'vue-i18n';

const accountStore = useAccountStore();
const { locale } = useI18n();

const accountLanguage = computed((): string => (
  accountStore.getAccountPreferences?.language || ''
))

locale.value = accountLanguage.value;
</script>
