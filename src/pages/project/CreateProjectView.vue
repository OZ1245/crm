<template>
  <div class="row justify-center align-center">
    <div class="col col-md-6">
      <form
        class="full-width"
        @submit="handleSubmitForm"
      >
        <div class="row q-mb-md">
          <div class="col">
            <q-list>
              <template
                v-for="(field, index) in form"
                :key="index"
              >
                <q-item>
                  <component
                    :is="getFieldComponent(field.type)"
                    v-model="models[field.key]"
                    v-bind="getFieldProps(field)"
                    lazy-rules
                    class="full-width"
                  ></component>
                </q-item>
              </template>
            </q-list>
          </div>
        </div>

        <div class="row">
          <div class="col flex justify-center">
            <q-btn
              type="submit"
              color="primary"
              :label="$t('project.buttons.create')"
              :disable="disableSubmiting"
            ></q-btn>
          </div>
        </div>
      </form>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { computed, ref } from 'vue';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account';
import { useUsersStore } from '@/stores/users';

import { Models } from 'node-appwrite';
import { QSelectOption, useQuasar } from 'quasar';
import { QCheckbox, QInput, QSelect } from 'quasar';
import { IFieldsMap } from 'types/common';

interface IField {
  type: keyof IFieldsMap;
  key: string;
  modelValue: any | any[];
  label: string;
  options?: QSelectOption[];
  disable?: boolean;
  rules?: any[];
  required?: boolean,
}

const $q = useQuasar();
const { t } = useI18n();
const { getAccount } = useAccountStore();
const userStore = useUsersStore()

const fieldsMap: IFieldsMap = {
  text: { component: QInput },
  textarea: { component: QInput },
  number: { component: QInput },
  select: { component: QSelect },
  checkbox: { component: QCheckbox },
}
const rules = {
  empty: (val: string) => val.length > 0 || t('common.form.messages.emptyValue'),
  emptyObject: (val: QSelectOption) => !!val.value || t('common.form.messages.emptyValue')
};
const form = ref<IField[]>([
  {
    type: 'text',
    key: 'title',
    modelValue: '',
    label: t('common.form.labels'),
    rules: [rules.empty],
    required: true,
  },
  {
    type: 'text',
    key: 'textId',
    modelValue: '',
    label: t('common.form.textId'),
    rules: [rules.empty],
    required: true,
  },
  {
    type: 'textarea',
    key: 'description',
    modelValue: '',
    label: t('common.form.description'),
  },
  {
    type: 'select',
    key: 'assigned',
    modelValue: '',
    label: t('common.form.assigned'),
    options: [],
    rules: [rules.emptyObject],
    required: true,
  },
  {
    type: 'select',
    key: 'subscribers',
    modelValue: [],
    label: t('common.form.subscribers'),
    options: [],
  }
]);
const models = ref<Record<string, any | any[]>>({});
const users = ref<Models.UserList<Models.Preferences> | null>(null);

const accountId = computed<string>(() => (
  getAccount.$id
));

const disableSubmiting = computed<boolean>(() => {
  let someEmpty: string[] = [];

  form.value.map((field) => {
    if (field.required && !models.value[field.key]) {
      someEmpty = [
        ...someEmpty,
        field.key
      ]
    }
  });

  if (someEmpty.length) {
    return true;
  }

  return false;
})

const fillOptions = (): void => {
  const fieldKeys = ['assigned', 'subscribers'];

  fieldKeys.map((fieldKey) => {
    const index = form.value.findIndex((field) => (
      field.key === fieldKey
    ));

    form.value[index].options = users.value?.users.map((user) => ({
      label: user.name || user.email,
      value: user.$id
    })) || [];
  })
}

const fillModels = (): void => {
  form.value.map((field) => {
    models.value = {
      ...models.value,
      [field.key]: field.modelValue
    }
  })
}

const fetchUsers = async (): Promise<void> => {
  $q.loading.show();

  try {
    const response = await userStore.fetchUsersList();
    users.value = response;
  } catch (error) {
    $q.notify({
      type: 'negative',
      icon: 'cancel',
      message: t('users.messages.fetchError', [error]),
      timeout: 0,
    })
  }

  $q.loading.hide();
}

const getFieldComponent = (type: keyof IFieldsMap) => {
  return fieldsMap[type]?.component || 'div'
}

const getFieldAttributes = (type: keyof IFieldsMap) => (
  fieldsMap[type]?.attributes || null
)

const getFieldProps = (field: IField) => {
  const {
    type,
    label,
    options,
    rules,
  } = field;

  let props = {
    label,
    options,
    type: type === 'textarea' ? 'textarea' : null,
    rules,
  };

  const attributes = getFieldAttributes(type);

  if (attributes) {
    props = {
      ...props,
      ...attributes
    }
  };

  return props;
};

const init = async (): Promise<void> => {
  try {
    await fetchUsers();
    fillOptions();
    fillModels();
  } catch (error) { }
}

const handleSubmitForm = (): void => {
  let payload: Record<string, any> = form.value.reduce((result, { key }) => {
    let value: string | string[];

    if (typeof models.value[key] === 'object') {
      value = models.value[key].value
    } else {
      value = models.value[key]
    }

    return {
      ...result,
      [key]: value || ''
    }
  }, {});

  payload = {
    ...payload,
    author: accountId.value
  }

  // TODO: ЗАпрос на стоздание
}

init();
</script>
