<template>
  <div class="scan-details__item">
    <strong class="scan-details__title">{{ title }}</strong>
    <span class="scan-details__value">
      <slot />
    </span>
  </div>
</template>

<script setup lang="ts">
defineProps<{ title: string }>();
</script>
