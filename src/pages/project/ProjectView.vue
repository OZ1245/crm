<template>
  TODO:
  <pre>{{ project }}</pre>
</template>

<script lang="ts" setup>
import { useProjectStore } from '@/stores/project';
import { IProjectDocument } from '@/types/api/project';
import { useQuasar } from 'quasar';
import { computed } from 'vue';
import { useI18n } from 'vue-i18n';
import { useRoute } from 'vue-router';

const $q = useQuasar();
const route = useRoute();
const { t } = useI18n();
const projectStore = useProjectStore();

const project = computed((): IProjectDocument | null => projectStore.project);

const fetchProject = async (): Promise<void> => {
  $q.loading.show();

  try {
    await projectStore.fetchProject(route.params.projectId);
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
