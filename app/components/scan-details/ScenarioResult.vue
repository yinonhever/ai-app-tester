<template>
  <div class="scenario-result">
    <div class="scenario-result__verdict">
      <ScenarioResultBadge :result="result.verdict" />
    </div>
    <div class="scenario-result__explanation">
      <LineClamp
        v-model:expanded="textExpanded"
        :text="result.explanation"
        :max-lines="1"
      >
        <template #after="{ expanded, toggle }">
          <v-btn
            class="ml-2"
            :icon="expanded ? 'mdi-chevron-up' : 'mdi-chevron-down'"
            variant="text"
            size="small"
            density="comfortable"
            color="primary"
            @click="toggle"
          />
        </template>
      </LineClamp>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Evaluation } from "~~/shared/types";
import { LineClamp } from "vue-clamp";

defineProps<{ result: Evaluation }>();

const textExpanded = ref(false);
</script>

<style lang="scss">
.scenario-result {
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  gap: 8px;
  min-width: 0;
  max-width: 100%;

  &__explanation {
    min-width: 0;
  }
}
</style>
