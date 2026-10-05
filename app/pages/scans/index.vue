<template>
  <Page title="My Scans">
    <BaseSpinner v-if="status === 'pending' && !refreshing" />
    <BaseErrorMessage v-else-if="error" :error="error" />
    <v-data-table
      v-else
      :headers="headers"
      :items="items ?? []"
      class="elevation-2"
      item-value="_id"
      :items-per-page="10"
    >
      <template #item._id="{ item }">
        <div class="id-cell">{{ item._id }}</div>
      </template>
      <template #item.startDate="{ item }">
        {{ item.formattedStartDate }}
      </template>
      <template #item.targetUrl="{ item }">
        <ExternalLink :link="item.targetUrl" :text="item.targetUrl" />
      </template>
      <template #item.status="{ item }">
        <ScanStatusBadge :status="item.status" />
      </template>
      <template #item.scenarioCount="{ item }">
        {{ item.scenarioCount || "—" }}
      </template>
      <template #item.tally="{ item }">
        <ScanResultSummary :scan="item" type="row" />
      </template>
      <template #item.actions="{ item }">
        <div class="d-flex align-center">
          <v-btn
            icon="mdi-eye"
            variant="text"
            size="small"
            density="comfortable"
            color="primary"
            :to="`/scans/${item._id}`"
          />
          <v-btn
            icon="mdi-delete"
            variant="text"
            size="small"
            density="comfortable"
            color="error"
            :loading="deletingId === item._id"
            @click="deleteScan(item)"
          />
        </div>
      </template>
    </v-data-table>
    <Notifications :items="notifications" />
  </Page>
</template>

<script setup lang="ts">
import type { Scan } from "~/utils/types";
import { adjustHeaders, formatScanData } from "~/utils/functions";

const { data, refresh, status, error } = await useFetch<Scan[]>("/api/scans");

const refreshing = ref(false);
const interval = ref<NodeJS.Timeout>();
const deletingId = ref<string | null>();

const headers = adjustHeaders<keyof Scan>([
  { title: "ID", key: "_id" },
  { title: "Date", key: "startDate" },
  { title: "Target URL", key: "targetUrl" },
  { title: "Status", key: "status" },
  { title: "Scenarios", key: "scenarioCount" },
  { title: "Results", key: "tally", sortable: false },
  { title: "Actions", key: "actions", sortable: false }
]);

const items = computed(() => data.value?.map(formatScanData));

const isScanInProgress = computed(
  () => !!data.value?.find(scan => scan.status === "in_progress")
);

const intervalTime = computed(() => (isScanInProgress.value ? 5000 : 60000));

const { notifications, addNotification } = useNotifications();

const refreshData = async () => {
  refreshing.value = true;
  await refresh();
  refreshing.value = false;
};

const deleteScan = async (scan: Scan) => {
  const { _id: scanId } = scan;

  const confirmed = window.confirm(
    `Are you sure you want to delete this scan (${scanId})?`
  );
  if (!confirmed) return;

  deletingId.value = scanId;
  try {
    await $fetch(`/api/scans/${scanId}`, { method: "DELETE" });
    await refreshData();
    addNotification(
      `Successfully deleted scan <strong>${scanId}</strong>.`,
      "delete"
    );
  } catch (error: any) {
    const errorMsg = error.data?.msg || error.message || error.statusMessage;
    addNotification(
      `Failed to delete scan <strong>${scanId}</strong>: <strong>${errorMsg}</strong>.`,
      "error"
    );
  } finally {
    deletingId.value = null;
  }
};

const adjustRefreshInterval = () => {
  clearInterval(interval.value);
  interval.value = setInterval(refreshData, intervalTime.value);
};

watch(intervalTime, adjustRefreshInterval);

onMounted(adjustRefreshInterval);
onBeforeUnmount(() => clearInterval(interval.value));
</script>
