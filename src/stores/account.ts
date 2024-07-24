import { defineStore } from 'pinia';
import { register } from 'api/account';
import { ICredintales } from 'types/api/account';

export const useAccountStore = defineStore('account', {
  state: () => ({
    counter: 0
  }),

  getters: {
    doubleCount (state) {
      return state.counter * 2;
    }
  },

  actions: {
    register(credintales: ICredintales) {
      return register(credintales);
    }
  }
});
