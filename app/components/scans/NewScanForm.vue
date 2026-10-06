<template>
  <form class="form new-scan-form" @submit.prevent="submitHandler">
    <v-text-field
      v-model="formData.targetUrl"
      label="Target URL"
      placeholder="https://example.com"
      required
      type="url"
      clearable
      variant="outlined"
    />
    <v-number-input
      v-model="formData.maxScenarios"
      label="Max. scenarios"
      required
      :min="0"
      :step="1"
      variant="outlined"
    />
    <BaseButton :loading="loading"> Start </BaseButton>
    <BaseErrorMessage :error="error" class="mt-5" />
  </form>
</template>

<script setup lang="ts">
const formData = reactive({
  targetUrl: "",
  maxScenarios: 25
});

const loading = ref(false);
const error = ref<BaseError>();

const submitHandler = async () => {
  loading.value = true;
  try {
    const { _id: scanId } = await $fetch<Scan>("/api/scans", {
      method: "POST",
      body: formData
    });
    await navigateTo(`/scans/${scanId}`);
  } catch (err: any) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};
</script>
