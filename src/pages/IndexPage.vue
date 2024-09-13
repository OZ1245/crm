<template>
  <q-page class="main-page row items-center justify-evenly">
    <div class="row">
      <div
        class="main-page__creating-pane flex column q-gutter-md"
        v-if="showCreatingPane"
      >
        <q-banner class="bg-warning text-black">
          <template #avatar>
            <q-icon name="warning"></q-icon>
          </template>
          {{ $t('project.messages.noProjects') }}
        </q-banner>

        <q-btn
          color="primary"
          :label="$t('project.buttons.create')"
          @click="handleToCreate"
        ></q-btn>
      </div>

      <q-list v-else>
        <q-item
          v-for="(project, index) in projectList?.documents"
          :key="index"
        >
          <q-card>
            <q-card-section>
              <!-- <pre>{{ project }}</pre> -->
              <p class="text-h6">{{ project.name }}</p>
            </q-card-section>
          </q-card>
        </q-item>
      </q-list>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import { computed, ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';
import { useProjectStore } from '@/stores/project';
import { Models } from 'appwrite';
import { IProject } from '@/types/api/project';

const projectStore = useProjectStore();
const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const projectList = ref<Models.DocumentList<IProject> | null>(null);

const showCreatingPane = computed((): boolean => (
  !projectList.value?.documents.length
))

const fetchProjects = async (): Promise<void> => {
  $q.loading.show();

  try {
    await projectStore.fetchProjects();
  } catch (error) {
    $q.notify({
      type: 'negative',
      icon: 'cancel',
      message: t('project.messages.getProjectsError', [error])
    });
  }

  $q.loading.hide();
}

const init = () => {
  fetchProjects();
}

const handleToCreate = (): void => {
  router.push('/project/create');
}

init();
</script>
