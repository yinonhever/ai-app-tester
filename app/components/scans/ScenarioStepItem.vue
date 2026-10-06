<template>
  <div class="scenario-step">
    <strong class="scenario-step__type">{{ formattedType }}</strong>
    {{ step.description }}
  </div>
</template>

<script setup lang="ts">
import _ from "lodash";
import type { ScenarioStep } from "#imports";

const props = defineProps<{ step: ScenarioStep }>();

const formattedType = computed(() => _.capitalize(props.step.type));
</script>

<style lang="scss" scoped>
.scenario-step {
  &__type {
    font-weight: 600;
  }
}
</style>
