<script setup>
import Image from "primevue/image";
import {ref} from "vue";
import clsx from 'clsx'

const isLoading = ref(false);
const props = defineProps({
  post: {
    type: Object,
    default: () => {}
  },
  src: {
    type: String,
    required: true
  },
  classes: {
    type: String,
    default: ''
  }
})

const test = () => {
  isLoading.value = true;
}
</script>

<template>
  <div :class="clsx(classes, 'relative h-full')" >
    <video 
      v-if="post.mimetype.split('/')[0] === 'video'"
      :src="src"
      controls
      class="post__video"
      draggable="false" ondragstart="return false;"
    ></video>
    <Image
      :src="src" alt="image of the post"
      class="post__image opacity-0 transition ease-in-out delay-150" :class="{'opacity-100': isLoading}"
      preview @load="test"/>
    <div v-if="!isLoading && (post.mimetype.split('/')[0] === 'video') === false" class="preloader"></div>
  </div>
</template>

<style scoped lang="scss">

</style>