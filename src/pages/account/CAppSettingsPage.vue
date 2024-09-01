<template>
  <div class="row">
    <div class="col">
      <q-list>
        <q-item>
          <q-item-section>
            <q-select
              v-model="locale"
              :label="$t('account.app.labels.language')"
              :options="availableLocales"
              @update:model-value="handleLanguageToggle"
            ></q-select>
          </q-item-section>
        </q-item>
        <q-item>
          <q-checkbox
            v-model="darkTheme"
            :label="$t('account.app.labels.theme')"
            @update:model-value="handleDarkThemeOptionToggle"
          />
        </q-item>
      </q-list>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { ref } from 'vue';
import { useQuasar } from 'quasar';
import { useI18n } from 'vue-i18n';
import { useAccountStore } from '@/stores/account';

const $q = useQuasar();
const accountStore = useAccountStore();
const { t, locale, availableLocales } = useI18n({ useScope: 'global' });

const showLanguageInput = ref<boolean>(false);
const darkTheme = ref<boolean>($q.dark.isActive);

// Methods

const toggleEditLanguage = (): void => {
  showLanguageInput.value = !showLanguageInput.value;
}

const updatePreferences = async (): Promise<void> => {
  $q.loading.show();

  try {
    await accountStore.updatePreferences({
      language: locale.value,
      darkTheme: darkTheme.value
    });
  } catch (error) {
    $q.notify({
      icon: 'cancel',
      type: 'negative',
      message: t('account.app.messages.updatePreferencesError', [error])
    });
  } finally {
    $q.loading.hide();
  }
}

// Handlers

const handleLanguageToggle = (): void => {
  toggleEditLanguage();
  updatePreferences();
}

const handleDarkThemeOptionToggle = (): void => {
  $q.dark.toggle();
  updatePreferences();
}

//  Hooks
</script>
