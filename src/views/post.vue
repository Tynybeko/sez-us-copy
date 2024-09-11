<template>
  <div class="content">
    <div class="content__inner">
      <div class="mt-4 !w-full">
        <a class="text-[#ffffff] cursor-pointer opacity-80 hover:opacity-100" @click="goBack"><img
            src="/icon/arrow-back.svg" alt=""></a>
        <h2 style="color: #f2f2f2; text-align: center; margin-top: -20px; margin-bottom: 10px; font-size: 16px;">
          Thread</h2>
      </div>
      <Post v-if="post.id" :post="post" @addReply="getReplies(postId)"></Post>
      <div class="line-decor mb-2"></div>

      <template v-if="hasReplies">
        <div class="flex items-center ml-3">
          <h3 style="color: #E4E4E7; font-weight: 400;">Replies</h3>
          <span class="text-[#A1A1AA] ml-2 text-[18px]">{{ replies.length }}</span>
        </div>
        <div class="pb-[100px]">
          <div v-for="post in replies" :key="post.id">
            <div class="line-decor mt-2 mb-1"></div>
            <Post :post="post" :isReply="true" @deletePost="test"></Post>
          </div>
        </div>
      </template>
    </div>
  </div>
</template>

<script setup>
import { computed, onBeforeMount, onMounted, ref } from "vue";
import { useStore } from "vuex";
import { useRoute, useRouter } from "vue-router";
import { previousRoute } from "@/router/index.js";

import Post from "../components/Post/index.vue"

const store = useStore();
const route = useRoute();
const postId = route.params.id
const router = useRouter();
import { goBack } from "../router";
const getPost = (id) => store.dispatch("setRecomendedPost", id);
const getReplies = (id) => store.dispatch("setRepliesPosts", id);
const userdata = computed(() => store.getters.getUser);
const post = computed(() => store.getters.getRecomendedPost);
const replies = computed(() => store.getters.getRepliesPosts);
const idScroll = ref('');

const hasReplies = computed(() => {
  return Array.isArray(replies.value) && replies.value.length > 0
})

onBeforeMount(() => {
  // store.commit("setPost", []);
  // store.commit("setRepliePost", []);
})

onMounted(async () => {
  await getPost(postId);
  await getReplies(postId);
  replies.value.reverse();
  idScroll.value = localStorage.getItem("scrollTo");
})

const test = () => {
  getReplies(postId);
}

</script>

<style lang="scss" scoped>
.content {
  &__inner {
    @include container;
    padding: 0 30px;
  }

  &__title {
    margin-left: calc(50% - 120px);
    margin-top: 18%;
    font-weight: 400;
    font-size: 36px;
    color: #000000;
    margin-bottom: 40px;
    transition: all 0.3s ease-in-out;

    &.active {
      margin: 40px 0 20px;
      font-size: 28px;
    }
  }

  @include _575 {
    &__title {
      margin-top: 30%;

      &.active {
        margin: 20px 0 10px;
        font-size: 20px;
      }
    }
  }
}

.line-decor {
  border-bottom: 0.5px solid #3b3b3b;
}
</style>