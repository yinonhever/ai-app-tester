<template>
  <NuxtLayout>
    <Page :title="title" class="error-page">
      <p class="error-page__text">
        {{ errorText }}
      </p>
    </Page>
  </NuxtLayout>
</template>

<script setup lang="ts">
import type { FetchError } from "ofetch";
import type { NuxtError } from "#app";

const props = defineProps<{ error: NuxtError }>();

const title = computed(() =>
  props.error.status === 404 ? "Page Not Found" : "An Error Occured"
);

const errorText = computed(() => {
  const { error } = props;
  if (error.status === 404) {
    return "The page you're looking for does not exist.";
  }
  const cause = error.cause as FetchError | undefined;
  return cause?.data?.msg || error.message || "Something went wrong.";
});
</script>

<style lang="scss">
.error-page {
  display: flex;
  align-items: center;
  flex-direction: column;

  &__text {
    font-size: 20px;
    font-weight: 500;
    text-align: center;

    @include respond(mobile) {
      font-size: 18px;
    }
  }
}
</style>
