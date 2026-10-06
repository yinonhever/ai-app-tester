<template>
  <div class="scenario-steps">
    <ScenarioStepItem v-for="step in steps" :key="step._id" :step="step" />
  </div>
</template>

<script setup lang="ts">
import type { ScenarioStep } from "#imports";

defineProps<{ steps: ScenarioStep[] }>();
</script>

<style lang="scss">
.scenario-steps {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
</style>
