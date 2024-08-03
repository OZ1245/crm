<template>
  <div class="row">
    <div class="col">
      <q-list>
        <q-item>
          <q-item-section>
            <template v-if="!showNameInput">
              <q-item-label caption>{{ $t('account.general.labels.name') }}</q-item-label>
              <q-item-label>{{ account.name }}</q-item-label>
            </template>
            <q-input
              v-else
              ref="accountNameInput"
              v-model="form.name"
              :label="$t('account.general.labels.name')"
            ></q-input>
          </q-item-section>
          <q-item-section side>
            <q-btn
              v-if="!showNameInput"
              flat
              icon="edit"
              @click="handleToggleNameInput"
            ></q-btn>
            <q-btn-group v-else>
              <q-btn
                flat
                icon="done"
                color="primary"
                @click="handleUpdateName"
              ></q-btn>
              <q-btn
                flat
                icon="close"
                @click="handleToggleNameInput"
              ></q-btn>
            </q-btn-group>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <template v-if="!showEmailInput">
              <q-item-label caption>{{ $t('account.general.labels.email') }}</q-item-label>
              <q-item-label>{{ account.email }}</q-item-label>
            </template>
            <q-input
              v-else
              ref="accountEmailInput"
              v-model="form.email"
              :label="$t('account.general.labels.email')"
            ></q-input>
          </q-item-section>
          <q-chip
            v-if="!account.emailVerification"
            icon="warning"
            color="warning"
            text-color="black"
            :label="$t('account.general.messages.emailVerificationWarning')"
          >
            <q-tooltip>{{ $t('account.general.messages.contactToAdmin') }}</q-tooltip>
          </q-chip>
          <q-item-section side>
            <q-btn
              v-if="!showEmailInput"
              flat
              icon="edit"
              :disable="!account.emailVerification"
              @click="handleToggleEmailInput"
            ></q-btn>
            <q-btn-group v-else>
              <q-btn
                flat
                icon="done"
                color="primary"
                @click="handleUpdateEmail"
              ></q-btn>
              <q-btn
                flat
                icon="close"
                @click="handleToggleEmailInput"
              ></q-btn>
            </q-btn-group>
          </q-item-section>
        </q-item>
        <q-item>
          <q-item-section>
            <q-item-label caption>{{ $t('account.general.labels.registrationDate') }}</q-item-label>
            <q-item-label>{{ account.registration }}</q-item-label>
          </q-item-section>
        </q-item>
        <q-item>
          <q-btn
            color="primary"
            @click="handleToggleUpdatePasswordDialog"
          >{{ $t('account.general.buttons.changePassword') }}</q-btn>
        </q-item>
      </q-list>
    </div>
  </div>

  <div class="row">
    <div class="col">
      <q-expansion-item :label="$t('account.detailGeneralInfo')">
        <pre>{{ account }}</pre>
      </q-expansion-item>
    </div>
  </div>

  <q-dialog v-model="showUpdatePasswordDialog">
    <q-card class="general-info__password-dialog">
      <q-card-section>
        <span class="text-h6">{{ $t('account.general.messages.changePassowordDialogTitle') }}</span>
      </q-card-section>

      <q-card-section class="q-gutter-md">
        <q-input
          ref="accountCurrentPasswordInput"
          v-model="form.password"
          type="password"
          :label="$t('account.general.labels.currentPassword')"
        ></q-input>
        <q-input
          v-model="form.newPassword"
          type="password"
          :label="$t('account.general.labels.newPassword')"
        ></q-input>
      </q-card-section>

      <q-card-actions align="right">
        <q-btn
          flat
          @click="handleCancelUpdatePassword"
        >{{ $t('account.general.buttons.cancel') }}</q-btn>
        <q-btn
          color="primary"
          @click="handleUpdatePassword"
        >{{ $t('account.general.buttons.updatePassword') }}</q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>
</template>

<script
  lang="ts"
  setup
>
import { ref, computed, reactive, nextTick } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';

import { useAccountStore } from 'stores/account';

import { Models } from 'appwrite';

interface IForm {
  name: string;
  email: string;
  password: string;
  newPassword: string;
}

const accountStore = useAccountStore();
const $q = useQuasar();
const { t } = useI18n();

const isLoading = ref<boolean>(true);
const showNameInput = ref<boolean>(false);
const showEmailInput = ref<boolean>(false);
const showUpdatePasswordDialog = ref<boolean>(false);
const form = reactive<IForm>({
  name: '',
  email: '',
  password: '',
  newPassword: '',
});
const accountNameInput = ref<HTMLElement | null>(null);
const accountEmailInput = ref<HTMLElement | null>(null);
const accountCurrentPasswordInput = ref<HTMLElement | null>(null);

const account = computed((): Models.User<Models.Preferences> => (
  accountStore.getAccount
));

const fetchAccountData = async (): Promise<void> => {
  isLoading.value = true;

  try {
    await accountStore.fetchAccount();
    isLoading.value = false;
  } catch (error) {
    throw new Error(`Ошибка при получение данных профиля: ${error}`);
  }
}

const updateAccountName = async (): Promise<void> => {
  isLoading.value = true;

  try {
    await accountStore.updateName(form.name);
    isLoading.value = false;
    showNameInput.value = false;
    $q.notify(t('account.general.messages.nameSuccess'));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `${t('account.general.messages.nameError')}: ${error}`
    });
    isLoading.value = false;
  }
}

const updateAccountEmail = async (): Promise<boolean> => {
  isLoading.value = true;

  const { email, password } = form;

  try {
    await accountStore.updateEmail({
      email,
      password
    });
    isLoading.value = false;
    showEmailInput.value = false;
    $q.notify(t('account.general.messages.emailSuccess'));
    return true;
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `${t('account.general.messages.emailError')}: ${error}`
    });
    isLoading.value = false;
    return false;
  }
}

const updateAccountPassword = async (): Promise<void> => {
  isLoading.value = true;

  const { newPassword: password, password: oldPassword } = form;

  try {
    await accountStore.updatePassword({
      password,
      oldPassword
    });
    isLoading.value = false;
    showUpdatePasswordDialog.value = false;
    form.newPassword = '';
    form.password = '';
    $q.notify(t('account.general.messages.passwordSuccess'));
  } catch (error) {
    $q.notify({
      type: 'negative',
      message: `${t('account.general.messages.passwordError')}: ${error}`
    });
    isLoading.value = false;
  }
}

const init = (): void => {
  fetchAccountData();
}

const handleToggleNameInput = (): void => {
  showNameInput.value = !showNameInput.value;

  nextTick(() => {
    if (accountNameInput.value) {
      accountNameInput.value.focus();
    }
  });
}

const handleToggleEmailInput = (): void => {
  showEmailInput.value = !showEmailInput.value;

  nextTick(() => {
    if (accountEmailInput.value) {
      accountEmailInput.value.focus();
    }
  });
}

const handleToggleUpdatePasswordDialog = (): void => {
  showUpdatePasswordDialog.value = !showUpdatePasswordDialog.value;

  nextTick(() => {
    if (accountCurrentPasswordInput.value) {
      accountCurrentPasswordInput.value.focus();
    }
  });
}

const handleUpdateName = (): void => {
  updateAccountName();
}

const handleUpdateEmail = (): void => {
  $q.dialog({
    title: t('account.general.messages.confirmation'),
    message: t('account.general.messages.confirmEmail'),
    prompt: {
      model: form.password,
      isValid: (val: string) => val.length >= 8,
      type: 'password'
    },
    cancel: true,
    persistent: true,
  })
    .onOk(async (data) => {
      form.password = data;
      return await updateAccountEmail();
    })
    .onCancel(() => {
      showEmailInput.value = false;
    });
}

const handleUpdatePassword = (): void => {
  updateAccountPassword();
}

const handleCancelUpdatePassword = (): void => {
  form.password = '';
  form.newPassword = '';
  showUpdatePasswordDialog.value = false;
}

init();
</script>

<style
  lang="scss"
  scoped
>
.general-info__password-dialog {
  min-width: 500px;
}
</style>
