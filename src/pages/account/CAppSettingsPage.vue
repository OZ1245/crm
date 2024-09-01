<template>
  <div class="row">
    <div class="col">
      <q-list separator>
        <q-item>
          <q-item-section>
            <template v-if="!showLanguageInput">
              <q-item-label caption>{{ $t('account.app.labels.language') }}</q-item-label>
              <q-item-label>{{ appSettings.language }}</q-item-label>
            </template>
            <q-select
              v-else
              v-model="locale"
              :label="$t('account.app.labels.language')"
              :options="availableLocales"
            ></q-select>
          </q-item-section>
          <q-item-section side>
            <q-btn
              v-if="!showLanguageInput"
              flat
              icon="edit"
              @click="handleToggleEditLanguage"
            ></q-btn>
            <q-btn-group v-else>
              <q-btn
                flat
                icon="done"
                color="primary"
                @click="handleApplyLanguage"
              ></q-btn>
              <q-btn
                flat
                icon="close"
                @click="handleCancelEditLanguage"
              ></q-btn>
            </q-btn-group>
          </q-item-section>
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref, computed } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account';

const $q = useQuasar();
const accountStore = useAccountStore();
const { t, locale, availableLocales } = useI18n({ useScope: 'global' });

interface IAppSettigs {
  language?: string;
  dakrTheme?: boolean;
}

const showLanguageInput = ref<boolean>(false);

const appSettings = computed((): IAppSettigs => {
  const {
    language = 'English',
    dakrTheme = true
  } = accountStore.getAccount.prefs;

  return {
    language,
    dakrTheme
  }
});

// Methods

const toggleEditLanguage = (): void => {
  showLanguageInput.value = !showLanguageInput.value;
}

const updatePreferences = async (): Promise<void> => {
  $q.loading.show();

  try {
    await accountStore.updatePreferences({
      language: locale.value
    });
  } catch (error) {
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.app.messages.updatePreferencesError', [error])
    });
    // Ошибка сохранения параметров пользователя: TypeError: Converting circular structure to JSON --> starting at object with constructor 'ComputedRefImpl' | property 'dep' -> object with constructor 'Map' --- property 'computed' closes the circle
  } finally {
    $q.loading.hide();
  }
}

// Handlers

const handleToggleEditLanguage = (): void => {
  toggleEditLanguage();
}

const handleApplyLanguage = (): void => {
  updatePreferences();
  toggleEditLanguage();
}

const handleCancelEditLanguage = (): void => {
  toggleEditLanguage();
}

//  Hooks
</script>
