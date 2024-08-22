import { defineStore } from 'pinia';
import accountApi from '@/api/account';
import storageApi from '@/api/storage';
import { ICredintales, ICredintalesPassword } from '@/types/api/account';
import type { Models } from 'appwrite'

interface IState {
  account: Models.User<Models.Preferences> | null;
  session: Models.Session | null;
  sessionList: Models.SessionList | null;
  accountPhoto: URL | null;
}

type SizeOption = 'small' | 'middle' | 'big';

export const useAccountStore = defineStore('account', {
  state: (): IState => ({
    account: null,
    session: null,
    sessionList: null,
    accountPhoto: null,
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
      return accountApi.register(credintales)
        .then((response) => {
          this.login(credintales);

          return response;
        });
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

    logoutAll() {
      return accountApi.logoutAll()
        .then((response) => {
          this.account = null;
          this.session = null;

          localStorage.removeItem('account');
          localStorage.removeItem('accountSession');

          return response;
        })
    },

    logoutSession(sessionId: Models.Session['$id']) {
      const accountSession = this.getAccountSession;

      if (sessionId === accountSession.$id) {
        return this.logout();
      }

      return accountApi.logout(sessionId)
        .then((response) => response);
    },

    // Блокировка пользователя (удаление)
    updateStatus() {
      return accountApi.updateStatus()
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

    fetchSessions() {
      return accountApi.fetchSessions()
        .then((response) => {
          this.sessionList = response;

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
    },

    uploadAccountPhoto(file: File) {
      return storageApi.createFile({
        bucketId: '66b3303c0036c8b173e3',
        file
      })
        .then(async (response) => {
          await accountApi.updatePreferences({
            accountPhoto: response.$id
          });

          return response;
        });
    },

    fetchAccountPhoto(size = 'middle' as SizeOption) {
      const fileId = this.getAccount.prefs.accountPhoto || null;
      let width = 250;
      let height = 250;

      if (!fileId) return null;

      switch (size) {
        case 'small': {
          width = 60;
          height = 60;
          break;
        }
        case 'big': {
          width = 1024;
          height = 1024;
          break;
        }
      }

      return storageApi.fetchFilePreview({
        bucketId: '66b3303c0036c8b173e3',
        fileId,
        width,
        height
      })
        .then((response) => {
          this.accountPhoto = response;

          return response;
        });
    },

    deleteAccountPhoto() {
      const fileId = this.account?.prefs.accountPhoto || null;

      if (!fileId) return;

      return storageApi.deleteFile({
        bucketId: '66b3303c0036c8b173e3',
        fileId
      })
        .then(async (response) => {
          await accountApi.updatePreferences({
            accountPhoto: null
          })
            .then(() => {
              this.accountPhoto = null;
            });

          return response;
        });
    }
  }
});
