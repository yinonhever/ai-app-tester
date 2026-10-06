<template>
  <v-btn
    :type="type || 'submit'"
    :color="color || 'primary'"
    :block="block ?? true"
    rounded
    flat
    :loading="loading"
    class="button text-uppercase"
  >
    <slot />
  </v-btn>
</template>

<script setup lang="ts">
defineProps<{
  type?: string;
  color?: string;
  block?: boolean;
  loading?: boolean;
}>();
</script>

<style langs="scss">
.button {
  letter-spacing: 0.1em;
  font-size: 0.875rem;
  font-weight: 500;
}
</style>
