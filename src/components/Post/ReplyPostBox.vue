<script setup>
import Post from "@/components/Post/index.vue";

const props = defineProps(['post'])
const emit = defineEmits(['delete-post'])
</script>

<template>
  <div class="replyBox">
    <Post :post="post.repostedPost" :isProfileReply="true" @delete-post="emit('delete-post')"></Post>
    <div class="pb-[50px] replyBox-my">
      <Post :post="post" :isReply="true" @delete-post="emit('delete-post')"></Post>
    </div>
  </div>
</template>

<style lang="scss">
</style>