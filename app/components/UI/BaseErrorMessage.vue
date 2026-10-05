<template>
  <v-alert v-if="error" type="error" variant="tonal" class="error-message">
    <div class="error-message__content">
      <span v-for="line in messageLines" :key="line">
        {{ line }}
      </span>
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import type { BaseError } from "~/utils/types";
import { FetchError } from "ofetch";

const props = defineProps<{ error: BaseError }>();

const message = computed<string | undefined>(() => {
  const { error } = props;
  return error instanceof FetchError
    ? error.data?.msg || error.message || error.statusMessage
    : typeof error === "string"
      ? error
      : error?.message;
});

const messageLines = computed(() => message.value?.split("\n") || []);
</script>

<style lang="scss">
.error-message {
  text-align: left;
  margin-bottom: 0 !important;

  &__content {
    display: grid;
    grid-template-columns: 1fr;
    gap: 5px;

    & > * {
      display: block;
    }
  }
}
</style>
