<script setup>
const props = defineProps(['justIcon'])
</script>

<template>
  <RouterLink
      to="/beta-registration"
      target="_blank"
      class="leftbar__items flex justify-center items-center mb-[32px]"
  >
    <img class="w-[18px] mr-[4px]" :src="`/icon/Channel.svg`" alt="icon">
    <span v-if="!justIcon" class="leftbar__label text-[#A1A1AA] text-[18px] block cursor-pointer">
              About Us
            </span>
  </RouterLink>
</template>

<style scoped lang="scss">

</style>