<template>
  <div class="rightbar">
    <div class="rightbar__inner">
      <!-- <div class="d-flex" v-if="!user">
        <BaseButton style="margin-right: 10px;" @click="logIn">Login</BaseButton>
        <BaseButton @click="signUp">SignUp</BaseButton>
      </div>
      <div class="d-flex" v-else>
        <BaseButton @click="logOut">Log out</BaseButton>
      </div> -->
      <BaseField
          v-model:value="searchText"
          @input="debouncedFetchUsers"
          class="sign-in__field"
          :placeholder="'Search'"
          isSearch
      ></BaseField>
      <div class="rightbar__posts">
        <h4 class="text-left pl-3 pt-3 text-[#E4E4E7] text-base mb-3 font-medium">Suggested for you</h4>
        <div v-if="loading" class="pb-4">
          Loading...
        </div>
        <div v-else-if="getPosts.length">
          <div v-for="el in getPosts" :key="el.id">
            <SuggestedPost
                :data="el"
                :type="searchText.length > 2 ? 'user' : 'post'"
                isRightBar
                :gap="0"
                :isAuth="!!userData"
            ></SuggestedPost>
          </div>
        </div>
        <div v-else class="pb-4">
          <h5>No data.</h5>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import SuggestedPost from "../Post/SuggestedPost.vue"

import {computed, onMounted, onUnmounted, ref} from "vue";
import { useStore } from "vuex";
import { useRouter } from "vue-router";
import {debounce} from "@/utils/debounce.js";
const router = useRouter();
const store = useStore();

const searchText = ref('');

const user = computed(() => store.getters.getUser);
const userData = computed(() => store.getters.getAuthUser);
const loading = ref(false)

const getSuggestedPosts = () => store.dispatch("setSuggestedPosts");
const posts = computed(() => store.getters.getSuggestedPosts);


const getPosts = computed(() => {
  if(searchText.value.length > 2){
    return users.value
  }
  return filteredPosts.value
})
const users = ref([])

const fetchUsers = async () => {
  if(searchText.value.length > 2){
    loading.value = true
    try {
      let response = await fetch(
          `/api/users?search=${searchText.value}`,
      );
      let data = await response.json();
      const arr = data?.results || []
      users.value = arr.slice(0, 5);
    }catch (err){
      console.error(err)
    }finally {
      loading.value = false
    }
  }
}
const debouncedFetchUsers = debounce(fetchUsers, 700);


const filteredPosts = computed(() => {
  const uniqueAuthors = new Map();

  posts.value.forEach(post => {
    if (!post.authorUser || !post.authorUser.bio || !post.authorUser.firstName || !post.authorUser.lastName) {
      return false;
    }

    if (!uniqueAuthors.has(post.authorUser.id)) {
      const shouldAddAuthor = user.value ? !user.value.following.includes(post.authorUser.id) : true;

      if (shouldAddAuthor) {
        uniqueAuthors.set(post.authorUser.id, post);
      }
    }
  });

  return Array.from(uniqueAuthors.values()).slice(0, 5);
});


onMounted(async () => {
  if(userData) {
    loading.value = true
    await getSuggestedPosts();
    loading.value = false
  }
})

onUnmounted(() => {
})
</script>

<style lang="scss">
.rightbar {
  text-align: center;
  font-size: 14px;
  &__inner {
    padding: 20px 0px;
    position: sticky;
    top: 80px;
    @include _1024 {
      padding: 20px 44px;
    }
    @include _767 {
      padding: 20px 32px;
    }
    @include _639 {
      padding: 20px 16px;
    }
  }
  &__posts {
    margin-top: 34px;
    background: #18181B;
    border-radius: 10px;
  }

  @include _767 {
    position: relative;
    top: 0;
  }
}
</style>
