<template>
  <v-card elevation="2" class="section-card">
    <h3 v-if="title" class="section-card__heading">{{ title }}</h3>
    <div class="section-card__content">
      <slot />
    </div>
  </v-card>
</template>

<script setup lang="ts">
defineProps<{ title?: string }>();
</script>

<style lang="scss" scoped>
.section-card {
  padding: 16px 20px;

  &__heading {
    font-weight: 700;
    font-size: 25px;
    text-align: center;
    margin-bottom: 25px;
  }
}
</style>
