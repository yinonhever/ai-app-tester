<template>
  <div class="scenario-result">
    <div class="scenario-result__verdict">
      <ScenarioResultBadge :result="result.verdict" />
    </div>
    <p class="scenario-result__explanation">
      {{ result.explanation }}
    </p>
  </div>
</template>

<script setup lang="ts">
import type { Evaluation } from "~~/shared/types";
import ScenarioResultBadge from "../UI/ScenarioResultBadge.vue";

defineProps<{ result: Evaluation }>();
</script>

<style lang="scss" scoped>
.scenario-result {
  display: grid;
  grid-template-columns: 1fr;
  gap: 8px;
}
</style>
