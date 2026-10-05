<template>
  <Page title="Scan Details">
    <BaseSpinner v-if="status === 'pending' && !refreshing" />
    <BaseErrorMessage v-else-if="error" :error="error" />
    <main v-else-if="scan" class="scan-details-wrapper">
      <ScanDetailsSection :scan="scan" />
      <ScanResultSummarySection :scan="scan" />
      <ScenarioListSection :scenarios="scan.scenarios" />
    </main>
  </Page>
</template>

<script setup lang="ts">
import type { Scan } from "~/utils/types";
import { formatScanData } from "~/utils/functions";

const route = useRoute();
const { scanId } = route.params;

const { data, refresh, status, error } = await useFetch<Scan>(
  `/api/scans/${scanId}`
);

const refreshing = ref(false);
const interval = ref<NodeJS.Timeout>();

const scan = computed(() => data.value && formatScanData(data.value));

const isScanInProgress = computed(() => scan.value?.status === "in_progress");

const intervalTime = computed(() => (isScanInProgress.value ? 5000 : 60000));

const refreshData = async () => {
  refreshing.value = true;
  await refresh();
  refreshing.value = false;
};

const adjustRefreshInterval = () => {
  clearInterval(interval.value);
  interval.value = setInterval(refreshData, intervalTime.value);
};

watch(intervalTime, adjustRefreshInterval);

onMounted(adjustRefreshInterval);
onBeforeUnmount(() => clearInterval(interval.value));
</script>

<style lang="scss">
.scan-details-wrapper {
  display: grid;
  max-width: 1300px;
  margin: auto;
  grid-template-columns: 1.5fr 1fr;
  gap: 40px;

  @include respond(tablet-land) {
    grid-template-columns: 1fr;
  }

  & > *:last-child {
    grid-column: 1 / -1;
  }
}
</style>
