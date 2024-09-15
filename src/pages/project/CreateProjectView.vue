<template>
  <div class="row justify-center align-center">
    <div class="col col-md-6">
      <form
        class="full-width"
        @submit="handleSubmitForm"
      >
        <div class="row q-mb-md">
          <div class="col">
            <q-list v-if="models">
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
                    @update:model-value="handleFieldUpdateModelValue(field, $event)"
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
import { is, useQuasar } from 'quasar';

import { useI18n } from 'vue-i18n';
import { useProjectStore } from '@/stores/project';
import { useAccountStore } from '@/stores/account';
import { useUsersStore } from '@/stores/users';
import { useRouter } from 'vue-router';

import { Models } from 'node-appwrite';
import { QCheckbox, QInput, QSelect, QSelectOption } from 'quasar';
import { IFieldsMap } from 'types/common';
import { IProject } from '@/types/api/project';
import { generateTextId } from '@/utils/generateTextId';

interface IField {
  type: keyof IFieldsMap;
  key: string;
  value: any;
  label: string;
  options?: QSelectOption[];
  disable?: boolean;
  rules?: any[];
  required?: boolean,
  handlers?: Record<string, (...args: any) => void>;
}

const $q = useQuasar();
const { t } = useI18n();
const { getAccount } = useAccountStore();
const userStore = useUsersStore()
const projectStore = useProjectStore();
const router = useRouter();

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
    value: '',
    label: t('common.form.labels'),
    rules: [rules.empty],
    required: true,
    handlers: {
      'update:modelValue': (value: string) => handleTitleInput(value)
    }
  },
  {
    type: 'text',
    key: 'textId',
    value: '',
    label: t('common.form.textId'),
    rules: [rules.empty],
    required: true,
  },
  {
    type: 'textarea',
    key: 'description',
    value: '',
    label: t('common.form.description'),
  },
  {
    type: 'select',
    key: 'assigned',
    value: '',
    label: t('common.form.assigned'),
    options: [],
    rules: [rules.emptyObject],
    required: true,
  },
  {
    type: 'select',
    key: 'subscribers',
    value: [],
    label: t('common.form.subscribers'),
    options: [],
  }
]);
const models = ref<Record<string, any> | null>();
const users = ref<Models.UserList<Models.Preferences> | null>(null);

const accountId = computed<string>(() => (
  getAccount.$id
));

const disableSubmiting = computed<boolean>(() => {
  let someEmpty: string[] = [];

  form.value.map((field) => {
    if (field.required && (models.value && !models.value[field.key])) {
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
});

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
      [field.key]: field.value
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

const createProject = async (): Promise<void> => {
  $q.loading.show();

  let payload: Record<string, any> = form.value.reduce<Partial<IProject>>((result, { key }) => {
    let value: any;

    if (models.value) {
      if (is.object(models.value[key])) {
        value = models.value[key].value
      } else {
        value = models.value[key]
      }

      console.log('key', key);
      console.log('value', value);

      return {
        ...result,
        [key]: value || ''
      }
    } else {
      return result;
    }
  }, {});

  payload = {
    ...payload,
    author: accountId.value
  }

  console.log('payload', payload);

  try {
    const response = await projectStore.createProject(payload as IProject);
    console.log('responce', response);
    router.push(`/projects/${response.$id}`);
  } catch (error) {
    $q.notify({
      type: 'negative',
      icon: 'cancel',
      message: t('project.messages.projectDoesntCreate', [error])
    });
  }

  $q.loading.hide();
}

const handleFieldUpdateModelValue = (field: IField, modelValue?: any): void => {
  if (!field.handlers) return;

  field.handlers['update:modelValue'](modelValue);
}

const handleTitleInput = (value: string): void => {
  const textId = generateTextId(value);

  if (!models.value) return;
  models.value.textId = textId;
}

const handleSubmitForm = (): void => {
  createProject()
}

init();
</script>
