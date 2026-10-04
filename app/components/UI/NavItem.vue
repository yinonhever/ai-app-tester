<template>
  <li class="header__nav-item">
    <NuxtLink class="header__nav-link" :to="link"> {{ text }} </NuxtLink>
  </li>
</template>

<script setup lang="ts">
defineProps<{
  link: string;
  text: string;
}>();
</script>
