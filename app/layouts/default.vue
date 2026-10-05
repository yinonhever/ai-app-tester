<template>
  <v-app>
    <div class="layout">
      <TheHeader />
      <div class="page-wrapper">
        <slot />
      </div>
      <TheFooter />
    </div>
  </v-app>
</template>

<style lang="scss">
.layout {
  min-height: 100vh;
  background-image: linear-gradient(
    60deg,
    rgba(#cee9fc, 0.6) 50%,
    transparent 50%
  );
  background-attachment: fixed;
  display: flex;
  flex-direction: column;
}

.page-wrapper {
  flex: 1;
}
</style>
