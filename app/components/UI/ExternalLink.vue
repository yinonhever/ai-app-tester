<template>
  <a class="external-link" :href="link" target="_blank">
    {{ text }}
  </a>
</template>

<script setup lang="ts">
defineProps<{ link: string; text: string }>();
</script>

<style lang="scss" scoped>
.external-link {
  font-weight: 600;

  &:hover {
    color: $color4;
  }
}
</style>
