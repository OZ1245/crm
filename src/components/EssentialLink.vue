<template>
  <q-item
    clickable
    :to="link"
  >
    <q-item-section
      v-if="avatar"
      avatar
    >
      <q-avatar>
        <img
          :src="avatar"
          :alt="caption"
        >
      </q-avatar>
    </q-item-section>
    <q-item-section
      v-else-if="icon"
      avatar
    >
      <q-icon :name="icon" />
    </q-item-section>

    <q-item-section>
      <q-item-label>{{ title }}</q-item-label>
      <q-item-label caption>{{ caption }}</q-item-label>
    </q-item-section>
  </q-item>
</template>

<script setup lang="ts">
import { EssentialLinkProps } from 'types/components/essentialLink';

withDefaults(defineProps<EssentialLinkProps>(), {
  caption: '',
  link: '#',
  icon: '',
  avatar: ''
});
</script>
