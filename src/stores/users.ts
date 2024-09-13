import { defineStore } from 'pinia';
import { fetchUsersList } from '@/api/users';
import type { Models } from 'node-appwrite';

interface IState {
  usersList: Models.UserList<Models.Preferences> | null
}

export const useUsersStore = defineStore('users', {
  state: (): IState => ({
    usersList: null
  }),

  getters: {},

  actions: {
    async fetchUsersList(): Promise<Models.UserList<Models.Preferences>> {
      const response = await fetchUsersList();
      this.usersList = response;

      return response;
    }
  }
});
