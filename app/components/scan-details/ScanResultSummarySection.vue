<template>
  <SectionCard title="Result Summary">
    <ScanResultSummary :scan="scan" type="grid" />
  </SectionCard>
</template>

<script setup lang="ts">
defineProps<{ scan: FormattedScan }>();
</script>
