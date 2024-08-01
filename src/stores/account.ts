import { defineStore } from 'pinia';
import { register } from '@/api/account';
import { ICredintales } from '@/types/api/account';

export const useAccountStore = defineStore('account', {
  state: () => ({}),

  getters: {},

  actions: {
    register(credintales: ICredintales) {
      return register(credintales);
    }
  }
});
