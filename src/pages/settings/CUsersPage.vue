<template>
  <div class="col">
    <q-table
      :columns="tableColumns"
      :rows="tableRows"
      :pagination="tablePagination"
      :loading="isLoading"
      :rows-per-page-label="$t('settings.users.tablePagination.perPageLabel')"
      @update:pagination="handleUpdatePagination"
    ></q-table>
  </div>
</template>

<script
  lang="ts"
  setup
>
import { ref, computed, reactive } from 'vue';

import { useI18n } from 'vue-i18n';
import { useUsersStore } from 'stores/users';

import type { Models } from 'node-appwrite';
import { ILoadingStatus } from 'types/common';

const { t } = useI18n();
const usersStore = useUsersStore();

interface IUsersTableComlumns {
  name: string;
  label: string;
  field: string;
  align?: 'left' | 'center' | 'right';
}

interface IUsersTableRow {
  name: Models.UserList<Models.Preferences['name']>;
  email: Models.UserList<Models.Preferences['email']>;
  registrationDate: Models.UserList<Models.Preferences['registration']>;
  accessedDate: Models.UserList<Models.Preferences['accessedAt']>;
  status: Models.UserList<Models.Preferences['status']>;
  labels: Models.UserList<Models.Preferences['labels']>;
}

const tableColumns = ref<IUsersTableComlumns[]>([
  {
    name: 'name',
    label: t('settings.users.tableColumns.name'),
    field: 'name',
    align: 'center',
  },
  {
    name: 'email',
    label: t('settings.users.tableColumns.email'),
    field: 'email',
    align: 'center',
  },
  {
    name: 'registrationDate',
    label: t('settings.users.tableColumns.registrationDate'),
    field: 'registrationDate',
    align: 'center',
  },
  {
    name: 'accessedDate',
    label: t('settings.users.tableColumns.accessedDate'),
    field: 'accessedDate',
    align: 'center',
  },
  {
    name: 'status',
    label: t('settings.users.tableColumns.status'),
    field: 'status',
    align: 'center',
  },
  {
    name: 'labels',
    label: t('settings.users.tableColumns.labels'),
    field: 'labels',
    align: 'center',
  },
]);


const isLoading = ref<ILoadingStatus>(true);
const query = reactive({
  limit: 25,
  offset: 0
});

const tablePagination = reactive({
  page: 1,
  rowsPerPage: query.limit,
});

const usersList = computed((): Models.UserList<Models.Preferences> | null => (
  usersStore.usersList || null
));

const tableRows = computed((): IUsersTableRow[] => (
  usersList.value?.users
    ?.map(({ name, email, registration, accessedAt, status, labels }: Models.Preferences) => ({
      name,
      email,
      registrationDate: registration,
      accessedDate: accessedAt,
      status,
      labels
    })) || []
));

// Methods

const handleUpdatePagination = (newPagination): void => {
  console.log('newPagination :>> ', newPagination);

  // TODO:
}

const init = (): void => {
  fetchUsersList();
}

const fetchUsersList = async (): Promise<void> => {
  try {
    await usersStore.fetchUsersList();
    isLoading.value = false;
  } catch (error) {
    throw Error(`Ошибка получения списка пользователей: ${error}`);
  }
}

// Hooks

init();
</script>@/types/common
