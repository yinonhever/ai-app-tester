<template>
  <div :class="classes">
    <div v-if="showHeading" class="page__heading-wrapper">
      <h1 class="page__heading">
        {{ title }}
      </h1>
      <h2 v-if="subtitle" class="page__subheading">
        {{ subtitle }}
      </h2>
    </div>
    <slot />
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  title: { type: String, required: true },
  subtitle: String,
  showHeading: { type: Boolean, default: true },
  dense: { type: Boolean, default: false }
});

useHead({ title: () => props.title });

const classes = computed(() => ["page", { "page--dense": props.dense }]);

onMounted(() => {
  window.scrollTo(0, 0);
});
</script>

<style lang="scss">
.page {
  position: relative;
  padding: 40px $padding-sides-desktop;
  height: 100%;

  @include respond(tablet-land) {
    padding-left: $padding-sides-mobile;
    padding-right: $padding-sides-mobile;
  }

  @include respond(mobile) {
    padding: 40px $padding-sides-mobile;
  }

  &--dense {
    padding-top: 30px;
    padding-bottom: 30px;
  }

  &__heading-wrapper {
    text-align: center;
    margin-bottom: 40px;

    @include respond(mobile) {
      margin-bottom: 50px;
    }
  }

  &__heading {
    font-weight: 800;
    font-size: 55px;
    color: $color1;

    @include respond(mobile) {
      font-size: 40px;
    }
  }

  &__subheading {
    font-weight: 700;
    font-size: 30px;
    margin-top: -5px;

    @include respond(mobile) {
      font-size: 25px;
    }
  }
}
</style>
