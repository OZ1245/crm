<template>
  <template v-if="sessionList?.sessions">
    <div class="row">
      <div
        v-for="(session, index) in sessionList.sessions"
        :key="index"
        class="session__column col-md-6 q-pa-md"
      >
        <div
          v-if="session.current"
          class="text-center"
        >
          <q-chip
            text-color="positive"
            :label="$t('account.sessions.labels.current')"
          ></q-chip>
        </div>

        <q-list separator>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('account.sessions.labels.ip') }}</q-item-label>
              <q-item-label>{{ session.ip }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('account.sessions.labels.countryName') }}</q-item-label>
              <q-item-label>{{ session.countryName }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('account.sessions.labels.osName') }}</q-item-label>
              <q-item-label>{{ session.osName }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('account.sessions.labels.deviceName') }}</q-item-label>
              <q-item-label>{{ session.deviceName }}</q-item-label>
            </q-item-section>
          </q-item>
          <template v-if="session.deviceName === 'smartphone'">
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ $t('account.sessions.labels.deviceBrand') }}</q-item-label>
                <q-item-label>{{ session.deviceBrand }}</q-item-label>
              </q-item-section>
            </q-item>
            <q-item>
              <q-item-section>
                <q-item-label caption>{{ $t('account.sessions.labels.deviceModel') }}</q-item-label>
                <q-item-label>{{ session.deviceModel }}</q-item-label>
              </q-item-section>
            </q-item>
          </template>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('account.sessions.labels.clientName') }}</q-item-label>
              <q-item-label>{{ session.clientName }}</q-item-label>
            </q-item-section>
          </q-item>
          <q-item>
            <q-item-section>
              <q-item-label caption>{{ $t('account.sessions.labels.clientVersion') }}</q-item-label>
              <q-item-label>{{ session.clientVersion }}</q-item-label>
            </q-item-section>
          </q-item>
        </q-list>

        <div class="text-center">
          <q-btn
            flat
            color="negative"
            :label="$t('account.sessions.buttons.logout')"
            @click="handleLogoutFromSession(session.$id, session.current)"
          ></q-btn>
        </div>
      </div>
    </div>

    <div class="row">
      <div class="col">
        <q-list bordered>
          <q-expansion-item :label="$t('account.sessions.labels.detailInfo')">
            <pre>{{ sessionList }}</pre>
          </q-expansion-item>
        </q-list>
      </div>
    </div>

    <div class="row">
      <div class="col text-center">
        <q-btn
          color="warning"
          text-color="dark"
          :label="$t('account.sessions.buttons.logoutAll')"
          @click="handleLogoutFromAllSessions"
        ></q-btn>
      </div>
    </div>
  </template>
</template>

<script
  lang="ts"
  setup
>
import { computed } from 'vue';

import { useAccountStore } from 'stores/account';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useRouter } from 'vue-router';

import { Models } from 'appwrite';

const accountStore = useAccountStore();
const $q = useQuasar();
const { t } = useI18n();
const router = useRouter();

const sessionList = computed((): Models.SessionList | null => (
  accountStore.sessionList || null
));

const fetchSessionList = async () => {
  $q.loading.show();

  try {
    await accountStore.fetchSessions();
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.sessions.messages.dataError', [error])
    })
  }
}

const logoutFromAllSessions = async () => {
  $q.loading.show();

  try {
    await accountStore.logoutAll();
    router.push('/');
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.sessions.messages.logoutAllError')
    })
  }
}

const logoutFromSession = async (sessionId: Models.Session['$id']) => {
  $q.loading.show();

  try {
    await accountStore.logoutSession(sessionId);
    router.push('/');
    $q.loading.hide();
  } catch (error) {
    $q.loading.hide();
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.sessions.messages.logoutError')
    });
  }
}

const init = () => {
  fetchSessionList();
}

const handleLogoutFromAllSessions = () => {
  $q.dialog({
    message: t('account.sessions.messages.confirmAllLogout'),
    cancel: true,
    persistent: true
  })
    .onOk(() => {
      logoutFromAllSessions();
    });
}

const handleLogoutFromSession = (sessionId: Models.Session['$id'], current = false) => {
  const message = current
    ? t('account.sessions.messages.confirmLogoutCurrent')
    : t('account.sessions.messages.confirmLogout');

  $q.dialog({
    message,
    cancel: true,
    persistent: true
  })
    .onOk(() => {
      logoutFromSession(sessionId);
    })
}

init();
</script>

<style
  lang="scss"
  scoped
>
.session__column {
  outline: 1px solid rgba(255, 255, 255, .28);
}
</style>
