<template>
  <div class="notifications">
    <TransitionGroup tag="div" name="notification" class="notifications__list">
      <Notification
        v-for="item in items"
        :key="item.id"
        :item="item"
        @remove="removeNotification(item.id)"
      />
    </TransitionGroup>
  </div>
</template>

<script setup lang="ts">
import type { Notification, RemoveNotification } from "~/utils/types";

defineProps<{ items: Notification[] }>();

const removeNotification = inject("removeNotification") as RemoveNotification;
</script>

<style lang="scss">
.notifications {
  position: fixed;
  bottom: 20px;
  left: 20px;
  width: 600px;
  z-index: 5;

  @include respond(mobile-land) {
    bottom: 10px;
    left: 10px;
    width: calc(100% - 20px);
  }

  &__list {
    display: grid;
    grid-template-columns: 1fr;
    gap: 12.5px;
    max-width: 650px;

    @include respond(mobile-land) {
      gap: 10px;
    }

    .v-alert {
      margin-bottom: 0;
      font-size: 15px;

      @include respond(mobile-land) {
        font-size: 13px;
      }
    }
  }
}

.notification-enter-from,
.notification-leave-to {
  transform: translateX(-200%);
}

.notification-enter-to,
.notification-leave-from {
  transform: translateX(0);
}

.notification-enter-active,
.notification-leave-active {
  transition: all 0.5s;
}

.notification-leave-active:not(:first-child) {
  position: absolute !important;
}

.notification-move:not(.notification-leave-active) {
  transition: transform 0.4s;
}
</style>
