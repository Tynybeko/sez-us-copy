<template>
  <button class="p-2 bg-[#27272A] text-[#E4E4E7] rounded-[10px] mb-2"
          :style="{opacity: loading ? '.5' : '1', pointerEvents: loading ? 'none' : ''}"
          :disabled="loading">
    <span v-if="loading">Loading</span>
    <span v-else-if="isFollow === false">Follow</span>
    <span v-else-if="isFollow === true">Unfollow</span>
  </button>
</template>

<script setup>
const props = defineProps({
  loading: Boolean,
  isFollow: Boolean
})
</script>

<style scoped>

</style>