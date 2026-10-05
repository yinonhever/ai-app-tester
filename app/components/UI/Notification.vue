<template>
  <v-alert
    border="start"
    elevation="4"
    colored-border
    :border-color="color"
    class="notification"
    :icon="iconName"
    variant="elevated"
    :style="{ '--notification-color': `rgb(var(--v-theme-${color}))` }"
  >
    <div class="notification__content">
      <span v-html="convertedContent" />
      <v-icon
        :size="22"
        :color="color"
        icon="mdi-close-circle"
        @click="$emit('remove')"
      />
    </div>
  </v-alert>
</template>

<script setup lang="ts">
import type { Notification } from "~/utils/types";
import { convertHTML } from "~/utils/functions";

const props = defineProps<{ item: Notification }>();
defineEmits(["remove"]);

const color = computed(() =>
  props.item.icon === "error" ? "error" : "primary"
);

const iconMap: Record<string, string> = {
  error: "mdi-alert-circle",
  warning: "mdi-alert",
  info: "mdi-information",
  success: "mdi-check-circle",
  delete: "mdi-delete"
};

const iconName = computed(() => iconMap[props.item.icon] ?? props.item.icon);

const convertedContent = convertHTML(props.item.content);
</script>

<style lang="scss">
.notification {
  background: #fff !important;

  .v-alert__prepend .v-icon {
    color: var(--notification-color) !important;
  }

  &__content {
    display: flex;
    justify-content: space-between;
    align-items: center;

    span {
      display: block;
      word-break: break-all;
    }
  }
}
</style>
