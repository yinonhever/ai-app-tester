<template>
  <v-chip :color="color" :prepend-icon="icon" :size="size" class="result-badge">
    {{ text }}
  </v-chip>
</template>

<script setup lang="ts">
import type { ScanStatus } from "~~/shared/types";
import type { VChip } from "vuetify/components";
import { formatStatus } from "#imports";

const props = defineProps<{
  status: ScanStatus;
  size?: VChip["$props"]["size"];
}>();

const color = computed(() => {
  switch (props.status) {
    case "completed":
      return "success";
    case "in_progress":
      return "warning";
    case "error":
      return "error";
  }
});

const icon = computed(() => {
  switch (props.status) {
    case "completed":
      return "mdi-check-circle";
    case "in_progress":
      return "mdi-progress-clock";
    case "error":
      return "mdi-alert-circle";
  }
});

const text = computed(() => formatStatus(props.status));
</script>
