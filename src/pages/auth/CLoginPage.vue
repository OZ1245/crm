<template>
  <div class="row">
    <div class="col">
      <p class="text-center">
        {{ $t('auth.messages.loginText') }}
        <q-btn
          flat
          color="primary"
          padding="none"
          @click="handleToRegister"
        >
          {{ $t('auth.messages.registerText') }}
        </q-btn>
        {{ $t('auth.messages.registerTextContinue') }}.
      </p>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-form @submit="handleSubmitForm">
        <q-list>
          <q-item>
            <q-input
              v-model="form.email"
              :label="$t('auth.labels.email')"
              type="email"
              lazy-rules
              :rules="rules.email"
              class="fit"
            ></q-input>
          </q-item>

          <q-item>
            <q-input
              v-model="form.password"
              :label="$t('auth.labels.password')"
              type="password"
              lazy-rules
              :rules="rules.password"
              class="fit"
            ></q-input>
          </q-item>

          <q-item class="justify-center">
            <q-btn
              type="submit"
              :loading="isLoading"
              color="primary"
              :label="t('auth.buttons.login')"
            ></q-btn>
          </q-item>
        </q-list>
      </q-form>
    </div>
  </div>
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
import { useConfig } from 'composables/useConfig';

import { ICredintales } from 'types/api/account';

const { t } = useI18n();
const $q = useQuasar();
const accountStore = useAccountStore();
const router = useRouter();
const { minPasswordCharacters } = useConfig();

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
    (val: string): any => val.length >= minPasswordCharacters || t('auth.rules.passwordLeastColCharacters', [minPasswordCharacters])
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

const handleToRegister = (): void => {
  router.push('/auth/register')
}
</script>
