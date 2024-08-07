<template>
  <div class="col">
    <div class="row">
      <div class="col q-gutter-md">
        <h1 class="text-h2 text-center">
          <div class="account__photo" @click="handleToggleAccountPhotoDialog">
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
            <q-tooltip>{{ $t('account.labels.changeAvatar') }}</q-tooltip>
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

  <q-dialog
    v-model="showAccountPhotoDialog"
    :persistent="true"
  >
    <q-card class="account__dialog flex column justify-between">
      <q-card-section class="flex justify-center">
        <q-img v-if="previewAccountPhoto" width="250px" height="250px" :src="previewAccountPhoto"></q-img>
      </q-card-section>
      <q-card-section class="flex justify-center">
        <q-file
          ref="filePickerComponent"
          v-model="form.accountPhoto"
          class="account__upload-photo-field"
          @update:model-value="handleSelectAccountPhoto"
        ></q-file>
        <q-btn color="primary" :label="$t('account.buttons.uploadDevice')" @click="handleUploadFromDevice"></q-btn>
      </q-card-section>
      <q-card-actions align="between">
        <q-btn
          flat
          color="primary"
          :label="t('account.general.buttons.cancel')"
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
</template>

<script
  lang="ts"
  setup
>
import { ref, computed, reactive } from 'vue';

import { useI18n } from 'vue-i18n';
import { useAccountStore } from 'stores/account';
import { useQuasar, QFile } from 'quasar';

import { Models } from 'appwrite';

interface IForm {
  accountPhoto: File | null;
}

const { t } = useI18n();
const accountStore = useAccountStore();
const $q = useQuasar();

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

const filePickerComponent = ref<QFile | null>(null);

const tab = ref<string>('general');
const showAccountPhotoDialog = ref<boolean>(false);
const form = reactive<IForm>({
  accountPhoto: null
});
const previewAccountPhoto = ref<string>('');

const account = computed((): Models.User<Models.Preferences> => (
  accountStore.getAccount
));

const accountPhoto = computed((): string => (
  accountStore.accountPhoto?.toString() || ''
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
    await accountStore.fetchAccountPhoto('small');
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.general.messages.getAccountPhotoError', [error])
    });
  }
}

const uploadAccountPhoto = async (): Promise<void> => {
  if (!form.accountPhoto) return;

  $q.loading.show();

  try {
    await accountStore.uploadAccountPhoto(form.accountPhoto);
    $q.loading.hide();
    showAccountPhotoDialog.value = false;
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.messages.uploadAccountPhotoError', [error])
    });
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
  filePickerComponent.value.pickFiles();
}

const handleApplyAccountPhoto = (): void => {
  uploadAccountPhoto();
}

init();
</script>

<style
  lang="scss"
  scoped
>
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
</style>
