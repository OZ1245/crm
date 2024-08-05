<template>
  <div class="row">
    <div class="col">
      <p class="text-center">
        {{ $t('auth.messages.registerText2') }}
        <q-btn
          flat
          color="primary"
          padding="none"
          :label="$t('auth.messages.loginText2')"
          @click="handleToLogin"
        >
        </q-btn>
        {{ $t('auth.messages.loginTextContinue') }}.
      </p>
    </div>
  </div>
  <div class="row">
    <div class="col">
      <q-form @submit="handleSubmit">
        <q-list>
          <q-item>
            <q-input
              v-model="form.email"
              type="email"
              :label="$t('auth.labels.email')"
              lazy-rules
              :rules="rules.email"
              class="fit"
            ></q-input>
          </q-item>

          <q-item>
            <q-input
              v-model="form.password"
              type="password"
              :label="$t('auth.labels.password')"
              lazy-rules
              :rules="rules.password"
              class="fit"
            ></q-input>
          </q-item>

          <q-item>
            <q-input
              v-model="form.confirmPassword"
              type="password"
              :label="$t('auth.labels.confirmPassword')"
              lazy-rules
              :rules="rules.confirmPassword"
              class="fit"
            ></q-input>
          </q-item>

          <q-item class="justify-center">
            <q-btn
              type="submit"
              color="primary"
              :label="$t('auth.buttons.register')"
              :disable="!validation"
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
import { reactive, computed } from 'vue';

import { useRouter } from 'vue-router';
import { useI18n } from 'vue-i18n';
import { useConfig } from 'composables/useConfig';
import { useQuasar } from 'quasar';

import { ICredintales } from 'types/api/account';
import { useAccountStore } from 'stores/account';

const accountStore = useAccountStore();
const router = useRouter();
const { t } = useI18n();
const { minPasswordCharacters } = useConfig();
const $q = useQuasar();

interface ICredintalesAlt extends ICredintales {
  confirmPassword: string;
}

const form = reactive<ICredintalesAlt>({
  email: '',
  password: '',
  confirmPassword: ''
});
const rules = {
  email: [
    (val: string): any => val.length > 0 || t('auth.rules.emptyEmail')
  ],
  password: [
    (val: string): any => val.length > 0 || t('auth.rules.emptyPassword'),
    (val: string): any => val.length >= minPasswordCharacters || t('auth.rules.passwordLeastColCharacters', [minPasswordCharacters])
  ],
  confirmPassword: [
    (val: string): any => val.length > 0 || t('auth.rules.emptyPassword'),
    (val: string): any => val.length >= minPasswordCharacters || t('auth.rules.passwordLeastColCharacters', [minPasswordCharacters]),
    (val: string): any => val === form.password || t('auth.messages.confirmPasswordError')
  ],
}

const validation = computed((): boolean => {
  if (!form.email.length) {
    return false;
  }

  if (!form.password.length) {
    return false
  }

  if (form.password !== form.confirmPassword) {
    return false;
  }

  return true;
});

const regiristerAccount = async (): Promise<void> => {
  $q.loading.show();

  try {
    await accountStore.register(form);
    $q.loading.hide();
    $q.notify({
      icon: 'check_circle',
      type: 'positive',
      message: t('auth.messages.registerSuccess')
    });
    router.push('/');
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: `${t('auth.messages.registerError')}: ${error}`
    });
  }
}

const handleSubmit = (): void => {
  regiristerAccount();
}

const handleToLogin = (): void => {
  router.push('/auth/login')
}
</script>
