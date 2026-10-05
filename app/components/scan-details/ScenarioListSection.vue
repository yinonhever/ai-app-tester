<template>
  <SectionCard title="Scenarios">
    <v-data-table
      :headers="headers"
      :items="scenarios ?? []"
      class="elevation-0"
      item-value="_id"
      :items-per-page="50"
      :cell-props="{ class: 'py-3' }"
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
import { adjustHeaders, type Scenario } from "#imports";

defineProps<{ scenarios: Scenario[] | undefined }>();

const headers = adjustHeaders<keyof Scenario>([
  { title: "#", key: "scenarioNum" },
  { title: "Description", key: "description", sortable: false },
  { title: "Steps", key: "steps", sortable: false },
  { title: "Result", key: "evaluation", width: "50%", sortable: false }
]);
</script>
