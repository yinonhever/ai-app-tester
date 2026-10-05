<template>
  <SectionCard title="Details">
    <div class="scan-details">
      <ScanDetailItem title="Scan ID">{{ scan._id }}</ScanDetailItem>
      <ScanDetailItem title="Status">
        <ScanStatusBadge :status="scan.status" />
      </ScanDetailItem>
      <ScanDetailItem title="Target URL">
        <ExternalLink :link="scan.targetUrl" :text="scan.targetUrl" />
      </ScanDetailItem>
      <ScanDetailItem v-if="scan.status !== 'completed'" title="Current stage">
        {{ scan.currentStage }}
      </ScanDetailItem>
      <ScanDetailItem title="Date">
        {{ scan.formattedStartDate }}
      </ScanDetailItem>
      <ScanDetailItem v-if="duration" title="Duration">
        {{ duration }}
      </ScanDetailItem>
      <ScanDetailItem title="Scenarios run">
        {{ scan.scenarioCount || "—" }}
      </ScanDetailItem>
      <ScanDetailItem title="Max. scenarios">
        {{ scan.maxScenarios }}
      </ScanDetailItem>
      <ScanDetailItem
        v-if="scan.status === 'error' && scan.errorMsg"
        title="Error message"
      >
        {{ scan.errorMsg }}
      </ScanDetailItem>
    </div>
  </SectionCard>
</template>

<script setup lang="ts">
import prettyMs from "pretty-ms";

const props = defineProps<{ scan: FormattedScan }>();

const duration = computed(() => {
  const { startDate, endDate } = props.scan;
  if (!endDate) return null;
  return prettyMs(new Date(endDate).getTime() - new Date(startDate).getTime(), {
    secondsDecimalDigits: 0
  });
});
</script>

<style lang="scss">
.scan-details {
  display: grid;
  grid-template-columns: 1fr;
  gap: 7.5px;

  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 10px;

    & > * {
      display: block;
    }
  }

  &__title {
    font-weight: 700;
  }
}
</style>
