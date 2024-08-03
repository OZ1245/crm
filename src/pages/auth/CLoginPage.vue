<template>
  <q-form
    class="q-gutter-md"
    @submit="handleSubmitForm"
  >
    <q-input
      v-model="form.email"
      :label="$t('auth.labels.email')"
      type="email"
      lazy-rules
      :rules="rules.email"
    ></q-input>

    <q-input
      v-model="form.password"
      :label="$t('auth.labels.password')"
      type="password"
      lazy-rules
      :rules="rules.password"
    ></q-input>

    <q-btn
      type="submit"
      :loading="isLoading"
      color="primary"
    >{{ $t('auth.buttons.login') }}</q-btn>
  </q-form>
</template>

<script
  lang="ts"
  setup
>
import { ref, reactive } from 'vue';
import { useQuasar } from 'quasar';

import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useAccountStore } from 'stores/account';

import { ICredintales } from 'types/api/account';

const { t } = useI18n();
const $q = useQuasar();
const accountStore = useAccountStore();
const router = useRouter();

const isLoading = ref<boolean>(false);
const form = reactive<ICredintales>({
  email: '',
  password: '',
});
const rules = {
  email: [
    (val: string): any => val.length > 0 || t('auth.rules.emptyEmail')
  ],
  password: [
    (val: string): any => val.length > 0 || t('auth.rules.emptyPassword'),
    (val: string): any => val.length >= 8 || t('auth.rules.passwordLeastColCharacters')
  ]
}

const handleSubmitForm = async (): Promise<void> => {
  isLoading.value = true;

  try {
    await accountStore.login(form);
    isLoading.value = false;
    router.push('/');
  } catch (error) {
    isLoading.value = false;
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: `${t('auth.notifications.loginError')}: ${error}`
    });
  }
}
</script>
