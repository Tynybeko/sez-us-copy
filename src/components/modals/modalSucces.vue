<template>
  <BaseModal :title="title" :subTitle="'Перенаправление'" isSucces></BaseModal>
</template>

<script setup>
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
});
</script>
