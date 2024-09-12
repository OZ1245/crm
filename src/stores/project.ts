import { defineStore } from 'pinia';
import projectApi from '@/api/project'
import { Models } from 'appwrite';
import { IProject } from '@/types/api/project';

interface IState {
  projects: Models.DocumentList<IProject> | null;
}

export const useProjectStore = defineStore('counter', {
  state: (): IState => ({
    projects: null
  }),

  getters: {},

  actions: {
    /**
     * Получение списка проектов
     *
     * @return  {IProject}  Массив проектов
     */
    async fetchProjects() {
      const response = await projectApi.fetchProjects();
      this.projects = response;
      return response;
    }
  }
});
