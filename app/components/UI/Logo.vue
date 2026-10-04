<template>
  <NuxtLink class="logo" to="/"> AI App Tester </NuxtLink>
</template>

<style lang="scss">
.logo {
  font-family: "Comfortaa", cursive;
  font-weight: 300;
  font-size: 33px;
  letter-spacing: 0.5px;
  cursor: pointer;
  display: block;
  transform: translateY(1px);

  @include respond(tablet) {
    font-size: 30px;
  }

  @include respond(mobile) {
    font-size: 25px;
    transform: none;
  }
}
</style>
