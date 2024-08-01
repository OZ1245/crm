<template>
  <form @submit.prevent="handleSubmit">
    <div>
      <label for="email">Email:</label>
      <input
        type="text"
        v-model="form.email"
        id="email"
      >
    </div>
    <div>
      <label for="password">Password:</label>
      <input
        type="password"
        v-model="form.password"
        id="password"
      >
    </div>

    <button type="submit">Register</button>
  </form>
</template>

<script
  lang="ts"
  setup
>
import { reactive } from 'vue';
import { ICredintales } from 'types/api/account';
import { useAccountStore } from 'stores/account';

const store = useAccountStore();

const form = reactive<ICredintales>({
  email: '',
  password: '',
});

const handleSubmit = (): void => {
  store.register(form);
}
</script>
@/types/api/account
