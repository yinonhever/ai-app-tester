<template>
  <div :class="classes">
    <div v-for="item in items" :key="item.result" class="result-summary__item">
      <ScenarioResultBadge
        :result="item.result"
        :icon-only="type === 'row'"
        :variant="type === 'grid' ? 'text' : undefined"
        class="result-summary__result"
      />
      <span class="result-summary__count">{{ item.count }}</span>
    </div>
  </div>
</template>

<script setup lang="ts">
import type { Scan, ResultSummaryType } from "#imports";
import { VERDICTS } from "~~/shared/constants";

const props = defineProps<{ scan: Scan; type: ResultSummaryType }>();

const items = computed(() =>
  VERDICTS.map(result => ({
    result,
    count: props.scan.tally?.[result] ?? 0
  }))
);

const classes = computed(() => [
  "result-summary",
  `result-summary--${props.type}`
]);
</script>

<style lang="scss" scoped>
.result-summary {
  &--row {
    display: grid;
    grid-template-columns: repeat(4, 28px);
    gap: 20px;

    @include respond(mobile) {
      grid-template-columns: repeat(2, 28px);
      gap: 8px 20px;
    }
  }

  &__item {
    display: flex;
    align-items: center;
  }

  &--row &__item {
    gap: 4px;

    @include respond(mobile) {
      gap: 3px;
    }
  }
}
</style>
