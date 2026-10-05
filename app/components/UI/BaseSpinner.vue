<template>
  <div :class="wrapperClasses">
    <v-progress-circular indeterminate color="primary" :size="size" />
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  absolute?: boolean;
  fixed?: boolean;
  center?: boolean;
  top?: boolean;
  size?: string | number;
}>();

const wrapperClasses = computed(() => [
  "spinner",
  {
    "spinner--absolute": props.absolute,
    "spinner--fixed": props.fixed,
    "spinner--center": props.center,
    "spinner--top": props.top
  }
]);
</script>

<style lang="scss">
.spinner {
  display: flex;
  justify-content: center;
  z-index: 99999999 !important;
  position: relative;

  &--absolute {
    position: absolute;
  }

  &--fixed {
    position: fixed;
  }

  &--absolute,
  &--fixed {
    left: 0;
    right: 0;
  }

  &--center {
    top: 50%;
    transform: translateY(-50%);
  }

  &--top {
    top: -50px;

    @include respond(mobile) {
      top: -45px;
    }
  }
}
</style>
