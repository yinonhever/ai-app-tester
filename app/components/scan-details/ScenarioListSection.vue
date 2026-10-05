<template>
  <SectionCard title="Scenarios">
    <div class="scenario-list-filters">
      <div class="scenario-list-filters__field">
        <v-select
          v-model="filters.result"
          :items="resultOptions"
          multiple
          chips
          closable-chips
          clearable
          variant="outlined"
          label="Filter by result"
        />
      </div>
    </div>
    <v-data-table
      :headers="headers"
      :items="displayedScenarios"
      class="elevation-0"
      item-value="_id"
      :items-per-page="50"
      :cell-props="{ class: 'py-3' }"
      no-data-text="No matching scenarios"
    >
      <template #item.steps="{ item }">
        <ScenarioStepList :steps="item.steps" />
      </template>
      <template #item.evaluation="{ item }">
        <ScenarioResult v-if="item.evaluation" :result="item.evaluation" />
        <span v-else>—</span>
      </template>
    </v-data-table>
  </SectionCard>
</template>

<script setup lang="ts">
import {
  adjustHeaders,
  formatStatus,
  type Scenario,
  type ScenarioFilters
} from "#imports";
import { VERDICTS } from "~~/shared/constants";

const props = defineProps<{ scenarios: Scenario[] | undefined }>();

const filters = reactive<ScenarioFilters>({ result: [] });

const headers = adjustHeaders<keyof Scenario>([
  { title: "#", key: "scenarioNum" },
  { title: "Description", key: "description", sortable: false },
  { title: "Steps", key: "steps", sortable: false },
  { title: "Result", key: "evaluation", width: "50%", sortable: false }
]);

const displayedScenarios = computed(() =>
  (props.scenarios ?? []).filter(({ evaluation }) => {
    if (filters.result.length) {
      if (!evaluation || !filters.result.includes(evaluation.verdict))
        return false;
    }
    return true;
  })
);

const resultOptions = VERDICTS.map(verdict => ({
  value: verdict,
  title: formatStatus(verdict)
}));
</script>

<style lang="scss">
.scenario-list-filters {
  display: grid;
  grid-template-columns: 1fr;
  margin: auto;
  max-width: 500px;
}
</style>
