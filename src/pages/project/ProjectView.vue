<template>
  TODO:
  <pre>{{ project }}</pre>
</template>

<script lang="ts" setup>
import { computed, toRefs } from 'vue';

import { useQuasar } from 'quasar';
import { useProjectStore } from '@/stores/project';
import { useI18n } from 'vue-i18n';

import { IProjectDocument } from '@/types/api/project';

const $q = useQuasar();
const { t } = useI18n();
const projectStore = useProjectStore();

const props = defineProps<{
  projectId: string;
}>();

const { projectId } = toRefs(props);

const project = computed((): IProjectDocument | null => projectStore.project);

const fetchProject = async (): Promise<void> => {
  $q.loading.show();

  try {
    await projectStore.fetchProject(projectId.value);
  } catch (error) {
    $q.notify({
      type: 'negative',
      icon: 'cancel',
      message: t('project.messages.getProjectError', [error])
    });
  }

  $q.loading.hide();
}

const init = () => {
  fetchProject();
}

init();
</script>
