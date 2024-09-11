<template>
  <div class="inline-flex items-center cursor-pointer toggle" :class="clsx(className)" @click="toggle">
    <div
        :class="clsx({
          'after:border-white bg-[#22C55E] toggle-active': model,
          'bg-[#52525B]': !model
        })"
        class="relative w-11 h-6 after:start-[2px]  peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-green-300  rounded-full peer  peer-checked after:content-[''] after:absolute after:top-[2px]  after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all"></div>
  </div>
</template>

<script setup>
import clsx from 'clsx'
const model = defineModel()

const props = defineProps(['className'])
function toggle() {
  model.value = !model.value
}
</script>

<style scoped lang="scss">
.toggle{
  &-active{
    &:after{
      transform: translateX(100%);
    }
  }
}
</style>