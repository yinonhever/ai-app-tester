<template>
  <v-icon v-if="iconOnly" :color="color" :icon="icon" :size="size || 'small'" />
  <v-chip
    v-else
    :color="color"
    :prepend-icon="icon"
    :variant="variant"
    :size="size"
    class="result-badge"
  >
    {{ text }}
  </v-chip>
</template>

<script setup lang="ts">
import type { Verdict } from "~~/shared/types";
import type { VChip } from "vuetify/components";
import { formatStatus } from "#imports";

const props = defineProps<{
  result: Verdict;
  iconOnly?: boolean;
  variant?: VChip["$props"]["variant"];
  size?: VChip["$props"]["size"];
}>();

const color = computed(() => {
  switch (props.result) {
    case "PASS":
      return "success";
    case "FAIL":
      return "error";
    case "SUSPICIOUS":
      return "warning";
    case "IMPROVEMENT":
      return "info";
  }
});

const icon = computed(() => {
  switch (props.result) {
    case "PASS":
      return "mdi-check-circle";
    case "FAIL":
      return "mdi-close-circle";
    case "SUSPICIOUS":
      return "mdi-alert";
    case "IMPROVEMENT":
      return "mdi-lightbulb-on";
  }
});

const text = computed(() => formatStatus(props.result));
</script>
