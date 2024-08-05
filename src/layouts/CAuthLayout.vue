<template>
  <q-layout
    view="hHh lpR fFf"
    class="layout layout--auth flex"
  >
    <q-header
      elevated
      class="bg-primary text-white"
    >
      <q-toolbar>
        <q-toolbar-title>
          <!-- <q-avatar>
            <img src="https://cdn.quasar.dev/logo-v2/svg/logo-mono-white.svg">
          </q-avatar> -->
          Mini CRM
        </q-toolbar-title>
      </q-toolbar>
    </q-header>

    <q-page-container class="layout__container">
      <div class="layout__main-row row items-center justify-center">
        <div class="layout__main-col col-5 q-m-xl">
          <router-view></router-view>
        </div>
      </div>
    </q-page-container>

  </q-layout>
</template>

<style
  lang="scss"
  scoped
>
.layout__container {
  flex-grow: 1;
}

.layout__main-row {
  height: 100%;
}

.layout__main-col {
  max-width: 360px;
}
</style>
