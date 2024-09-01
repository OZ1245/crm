<template>
  <div class="col">
    <div class="row">
      <div class="col q-gutter-md">
        <h1 class="text-h2 text-center">
          <div
            class="account__photo"
            @click="handleToggleAccountPhotoDialog"
          >
            <q-avatar v-if="accountPhoto">
              <img
                :src="accountPhoto"
                :alt="computedName"
              >
            </q-avatar>
            <q-avatar
              v-else
              color="primary"
              icon="account_circle"
            ></q-avatar>
            <q-tooltip>{{ $t('account.labels.editAvatar') }}</q-tooltip>
          </div>
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

  <q-dialog v-model="showAccountPhotoDialog">
    <q-card class="flex column justify-between">
      <q-card-section class="text-h6">{{ $t('account.labels.editAccountPhotoDialogTitle') }}</q-card-section>
      <q-card-section
        v-if="previewAccountPhoto || middleAccountPhoto"
        class="flex justify-center"
      >
        <q-img
          v-if="previewAccountPhoto"
          width="250px"
          height="250px"
          :src="previewAccountPhoto"
        ></q-img>
        <q-img
          v-else-if="middleAccountPhoto"
          :src="middleAccountPhoto"
          width="250px"
          height="250px"
          class="cursor-pointer"
          @click="handleOpenBigAccountPhoto"
        ></q-img>
      </q-card-section>
      <q-card-section class="account__upload-photo-field">
        <q-file
          ref="filePickerComponent"
          v-model="form.accountPhoto"
          @update:model-value="handleSelectAccountPhoto"
        ></q-file>
      </q-card-section>
      <q-card-actions align="around">
        <q-btn
          v-if="accountPhoto"
          color="negative"
          :label="$t('account.buttons.removeAccountPhoto')"
          icon="delete"
          @click="handleRemoveAccountPhoto"
        ></q-btn>
        <q-btn
          color="primary"
          :label="$t('account.buttons.uploadDevice')"
          icon="upload"
          @click="handleUploadFromDevice"
        ></q-btn>
      </q-card-actions>
      <q-card-actions align="between">
        <q-btn
          flat
          color="primary"
          :label="t('account.buttons.cancel')"
          @click="handleToggleAccountPhotoDialog"
        ></q-btn>
        <q-btn
          color="primary"
          :label="$t('account.buttons.apply')"
          @click="handleApplyAccountPhoto"
        ></q-btn>
      </q-card-actions>
    </q-card>
  </q-dialog>

  <q-dialog
    v-model="showBigAccountPhoto"
    full-height
    class="big-image"
  >
    <q-img
      v-if="bigAccountPhoto"
      :src="bigAccountPhoto"
      fit="contain"
      ratio="1"
    ></q-img>
    <q-btn
      icon="close"
      size="lg"
      unelevated
      flat
      class="fixed cursor-pointer big-image__close-button"
      @click="handleCloseBigAccountPhoto"
    ></q-btn>
  </q-dialog>
</template>

<script lang="ts" setup>
import { ref, computed, reactive } from 'vue';

import { useI18n } from 'vue-i18n';
import { useAccountStore } from 'stores/account';
import { useQuasar, QFile } from 'quasar';

import { QRouteTabProps } from 'quasar';

import { Models } from 'appwrite';

interface IForm {
  accountPhoto: File | null;
}

const { t } = useI18n({ useScope: 'global' });
const accountStore = useAccountStore();
const $q = useQuasar();

const filePickerComponent = ref<QFile | null>(null);

const tab = ref<string>('general');
const showAccountPhotoDialog = ref<boolean>(false);
const form = reactive<IForm>({
  accountPhoto: null
});
const previewAccountPhoto = ref<string>('');
const middleAccountPhoto = ref<string>('');
const showBigAccountPhoto = ref<boolean>(false);
const bigAccountPhoto = ref<string>('');

// Computed

const tabs = computed<QRouteTabProps[]>(() => [
  {
    name: 'general',
    label: t('account.tabs.general'),
    to: '/account/general'
  },
  {
    name: 'app',
    label: t('account.tabs.app'),
    to: '/account/app'
  },
  {
    name: 'sessions',
    label: t('account.tabs.sessions'),
    to: '/account/sessions'
  },
]);

const account = computed((): Models.User<Models.Preferences> => (
  accountStore.getAccount
));

const accountPhoto = computed((): string => (
  accountStore.avatarSmall?.toString() || ''
));

const computedName = computed((): string => {
  if (!account.value?.name?.length) {
    return t('account.noName');
  }

  return account.value.name
});

const fetchAccountPhoto = async (): Promise<void> => {
  $q.loading.show();

  try {
    const response = await accountStore.fetchAccountPhoto('small');
    if (!response) return;
    const middlePhotoResponse = await accountStore.fetchAccountPhoto('middle');
    middleAccountPhoto.value = middlePhotoResponse?.toString() || '';
  } catch (error) {
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.messages.getAccountPhotoError', [error])
    });
  } finally {
    $q.loading.hide();
  }
}

const fetchBigAccountPhoto = async (): Promise<void> => {
  $q.loading.show();

  try {
    const response = await accountStore.fetchAccountPhoto('original');
    bigAccountPhoto.value = response?.toString() || '';
  } catch (error) {
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.messages.getAccountPhotoError', [error])
    });
  } finally {
    $q.loading.hide();
  }
}

const uploadAccountPhoto = async (): Promise<void> => {
  if (!form.accountPhoto) return;

  $q.loading.show();

  try {
    await accountStore.uploadAccountPhoto(form.accountPhoto);
    await accountStore.fetchAccountPhoto('small');

    showAccountPhotoDialog.value = false;
  } catch (error) {
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.messages.uploadAccountPhotoError', [error])
    });
  } finally {
    $q.loading.hide();
  }
}

const removeAccountPhoto = async (): Promise<void> => {
  if (!accountPhoto.value) return;

  $q.loading.show();

  try {
    await accountStore.deleteAccountPhoto();
    await accountStore.fetchAccount();
    middleAccountPhoto.value = '';
    bigAccountPhoto.value = '';
  } catch (error) {
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.messages.deleteAccountPhotoError')
    });
  } finally {
    $q.loading.hide();
  }
}

const init = (): void => {
  fetchAccountPhoto();
}

const handleToggleAccountPhotoDialog = (): void => {
  previewAccountPhoto.value = '';
  showAccountPhotoDialog.value = !showAccountPhotoDialog.value;
}

const handleSelectAccountPhoto = (value: any): void => {
  previewAccountPhoto.value = URL.createObjectURL(value);
}

const handleUploadFromDevice = (): void => {
  filePickerComponent.value?.pickFiles();
}

const handleRemoveAccountPhoto = (): void => {
  $q.dialog({
    title: t('account.messages.confirmRemoveAccountPhoto'),
  }).onOk(() => {
    removeAccountPhoto();
  });
}

const handleApplyAccountPhoto = (): void => {
  uploadAccountPhoto();
}

const handleOpenBigAccountPhoto = (): void => {
  fetchBigAccountPhoto();
  showBigAccountPhoto.value = true;
}

const handleCloseBigAccountPhoto = (): void => {
  showBigAccountPhoto.value = false;
}

init();
</script>

<style lang="scss" scoped>
.account__dialog {
  width: 500px;
  height: 500px;
}

.account__photo {
  display: inline-block;
  cursor: pointer;
}

.account__upload-photo-field {
  display: none;
}

.big-image__close-button {
  top: 0;
  right: 0;
}
</style>
