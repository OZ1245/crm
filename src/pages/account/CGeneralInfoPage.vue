<template>
  <q-inner-loading :showing="isLoading"></q-inner-loading>

  <template v-if="account">
    <div class="row">
      <div class="col">
        <q-list separator>
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
        <q-list bordered>
          <q-expansion-item :label="$t('account.detailGeneralInfo')">
            <pre>{{ account }}</pre>
          </q-expansion-item>
        </q-list>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-btn
          flat
          color="negative"
          @click="handleLogout"
        >{{ $t('account.general.buttons.logout') }}</q-btn>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-list bordered>
          <q-expansion-item :label="$t('account.general.labels.deleteAccount')">
            <div class="row">
              <div class="col flex justify-center q-pa-md">
                <q-btn
                  color="negative"
                  :label="$t('account.general.buttons.delete')"
                  @click="handleDeleteAccount"
                ></q-btn>
              </div>
            </div>
          </q-expansion-item>
        </q-list>
      </div>
    </div>
  </template>

  <template v-else>
    <q-banner>
      <template #avatar>
        <q-icon name="error"></q-icon>
      </template>
      {{ $t('account.general.messages.accountDataError') }}
    </q-banner>
  </template>

  <!-- Обновление пароля -->
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
import { useRouter } from 'vue-router';

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
const router = useRouter();

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
  $q.loading.show();

  try {
    await accountStore.fetchAccount();
    $q.loading.hide();
    isLoading.value = false;
  } catch (error) {
    $q.loading.hide();
    isLoading.value = false;
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: `${t('account.general.messages.accountDataError')}: ${error}`
    })
  }
}

const updateAccountName = async (): Promise<void> => {
  $q.loading.show();

  try {
    await accountStore.updateName(form.name);
    $q.loading.hide();
    showNameInput.value = false;
    $q.notify({
      icon: 'check_circle',
      type: 'positive',
      message: t('account.general.messages.nameSuccess')
    });
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: `${t('account.general.messages.nameError')}: ${error}`
    });
  }
}

const updateAccountEmail = async (): Promise<boolean> => {
  $q.loading.show();

  const { email, password } = form;

  try {
    await accountStore.updateEmail({
      email,
      password
    });
    $q.loading.hide();
    showEmailInput.value = false;
    $q.notify({
      icon: 'check_circle',
      type: 'positive',
      message: t('account.general.messages.emailSuccess')
    });
    return true;
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: `${t('account.general.messages.emailError')}: ${error}`
    });
    return false;
  }
}

const updateAccountPassword = async (): Promise<void> => {
  $q.loading.show();

  const { newPassword: password, password: oldPassword } = form;

  try {
    await accountStore.updatePassword({
      password,
      oldPassword
    });
    $q.loading.hide();
    showUpdatePasswordDialog.value = false;
    form.newPassword = '';
    form.password = '';
    $q.notify({
      icon: 'check_circle',
      type: 'positive',
      message: t('account.general.messages.passwordSuccess')
    });
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: `${t('account.general.messages.passwordError')}: ${error}`
    });
  }
}

const logout = async (): Promise<void> => {
  $q.loading.show();

  try {
    await accountStore.logout();
    router.push('/');
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: `${t('account.general.messages.logoutError')}: ${error}`
    });
  }
}

const deleteAccount = async (): Promise<void> => {
  $q.loading.show();

  try {
    await accountStore.updateStatus();
    $q.loading.hide();
    $q.notify({
      icon: 'check_circle',
      type: 'positive',
      message: t('account.general.messages.deleteAccountSuccess')
    });
    router.push('/');
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.general.messages.deleteAccountError', [error])
    });
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

const handleLogout = (): void => {
  $q.dialog({
    title: t('account.general.messages.logoutDialogTitle'),
    message: t('account.general.messages.logoutText'),
    cancel: true,
    persistent: true
  })
    .onOk(() => {
      logout();
    });
}

const handleDeleteAccount = (): void => {
  $q.dialog({
    title: t('account.general.labels.deleteAccount'),
    message: t('account.general.messages.deleteAccountText'),
    cancel: true,
    persistent: true,
  })
    .onOk(() => {
      deleteAccount();
    });
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
