import { defineStore } from 'pinia';
import projectApi from '@/api/project'
import { Models } from 'appwrite';
import { IProject, IProjectDocument } from '@/types/api/project';

interface IState {
  projects: Models.DocumentList<IProjectDocument> | null;
  project: IProjectDocument | null;
}

export const useProjectStore = defineStore('counter', {
  state: (): IState => ({
    projects: null,
    project: null,
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
    },

    /**
     * Создание проекта
     *
     * @param   {IProject}  data    Параметры для создания проекта
     *
     * @return  {IProjectDocument}  Созданный проекта
     */
    async createProject(data: IProject) {
      const response = await projectApi.createProject(data);
      this.project = response;
      return response;
    },

    /**
     * Получение данных проекта
     *
     * @param   {string}    projectId   Id проекта
     * @param   {string[]}  queries     Уточняющие критерии запроса
     *
     * @return  {IProjectDocument}      Данные проекта
     */
    async fetchProject(projectId: string, queries: string[] = []) {
      const response = await projectApi.fetchProject(projectId, queries);
      this.project = response;
      return response;
    }
  }
});
