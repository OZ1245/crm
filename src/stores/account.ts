import { defineStore } from 'pinia';
import accountApi from '@/api/account';
import { ICredintales, ICredintalesPassword } from '@/types/api/account';
import type { Models } from 'appwrite'

interface IState {
  account: Models.User<Models.Preferences> | null;
  session: Models.Session | null
}

export const useAccountStore = defineStore('account', {
  state: (): IState => ({
    account: null,
    session: null
  }),

  getters: {
    getAccount: (state): Models.User<Models.Preferences> => {
      const json = localStorage.getItem('account');
      const parsedAccount = json ? JSON.parse(json) : null;

      return state.account || parsedAccount || null;
    },

    getAccountSession: (state): Models.Session => {
      const json = localStorage.getItem('accountSession');
      const parsedAccountSession = json ? JSON.parse(json) : null;

      return state.session || parsedAccountSession || null;
    }
  },

  actions: {
    register(credintales: ICredintales) {
      return accountApi.register(credintales);
    },

    login(credintales: ICredintales) {
      return accountApi.login(credintales)
        .then((response) => {
          this.session = response;
          localStorage.setItem('accountSession', JSON.stringify(response));

          return response;
        });
    },

    logout() {
      const accountSession = this.getAccountSession;

      return accountApi.logout(accountSession.$id)
        .then((response) => {
          this.account = null;
          this.session = null;

          localStorage.removeItem('account');
          localStorage.removeItem('accountSession');

          return response;
        })
    },

    fetchAccount() {
      return accountApi.fetchAccount()
        .then((response) => {
          this.account = response;
          localStorage.setItem('account', JSON.stringify(response));

          return response;
        });
    },

    updateName(name: string) {
      return accountApi.updateName(name)
        .then((response) => {
          this.account = response;
          localStorage.setItem('account', JSON.stringify(response));

          return response;
        })
    },

    updateEmail(credintales: ICredintales) {
      return accountApi.updateEmail(credintales)
        .then((response) => {
          this.account = response;
          localStorage.setItem('account', JSON.stringify(response));

          return response;
        })
    },

    updatePassword(credintales: ICredintalesPassword) {
      return accountApi.updatePassword(credintales)
        .then((response) => {
          this.account = response;
          localStorage.setItem('account', JSON.stringify(response));

          return response;
        });
    }
  }
});
