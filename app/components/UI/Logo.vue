<template>
  <NuxtLink class="logo" to="/"> AI App Tester </NuxtLink>
</template>

<style lang="scss">
.logo {
  font-family: "Comfortaa", cursive;
  font-weight: 300;
  font-size: 34px;
  letter-spacing: 0.5px;
  cursor: pointer;
  color: inherit !important;
  text-decoration: none;
  display: inline-block;
  transform: translateY(1px);

  @include respond(tablet) {
    font-size: 31px;
  }

  @include respond(mobile) {
    font-size: 28px;
  }
}
</style>
