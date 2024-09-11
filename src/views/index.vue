<script setup>
import { ref, computed, onMounted, onBeforeUnmount } from "vue";
import { useStore } from "vuex";
import Post from "../components/Post/index.vue"
import ProgressSpinner from 'primevue/progressspinner';
const store = useStore();
const getRecomendedPosts = () => store.dispatch("setRecomendedPosts");
const getReportPost = (id) => store.dispatch("fetchReportBotId", id);
const getNextPaginationPosts = (lastId) => store.dispatch("setNextPagonationPosts", lastId);
const getFollowingPosts = () => store.dispatch("setFollowingPosts");
const posts = computed(() => store.getters.getRecomendedPosts);
const isUpdate = computed(() => store.getters.getLoadStatus);
const user = JSON.parse(localStorage.getItem("user"));
import { useSocketIO } from '@/global/webSockets.js'
import { useRouter } from "vue-router";
const getProfile = (id) => store.dispatch("setProfile", id);
const { socket } = useSocketIO();
const isLoading = ref(true);
const isLoadMore = ref(false);
const isFollowing = ref(false);
const tabIndex = ref(0);
const hasNext = ref(true);
const router = useRouter();
const userdata = ref(null);
const links = [
  {
    title: 'Posts',
    to: '',
    disabled: false
  },
  {
    title: 'For you',
    to: '',
    disabled: false
  },
  // {
  //   title: 'Friends',
  //   to: '',
  //   disabled: true
  // },
  // {
  //   title: 'Met Opera',
  //   to: '',
  //   disabled: true
  // },
  // {
  //   title: 'Family',
  //   to: '',
  //   disabled: true
  // },
]


// Функция для обработки скролла
const onScroll = async () => {
  if (isLoadMore.value || !hasNext.value) return;
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
    isLoadMore.value = true;
    const lastElement = posts.value[posts.value.length - 1];
    const res = await getNextPaginationPosts(lastElement.id);
    posts.value.push(...res.results);
    hasNext.value = res.hasNext;
    isLoadMore.value = false;
  }
};




onMounted(async () => {
  socket.on("post_marked_bot", (payload) => {
    getReportPost(payload.postId)
  });
  if (user) {
    store.dispatch('getMe');
    userdata.value = JSON.parse(localStorage.getItem("user"));
  }
  await getRecomendedPosts();
  isLoading.value = false;
  const savedPosition = localStorage.getItem('scrollTo');
  if (savedPosition !== null) {
    setTimeout(() => {
      window.scrollTo({
        top: Number(document.getElementById(savedPosition)?.offsetTop ?? 0),
        behavior: "smooth"
      });
    }, 300);
    localStorage.removeItem('scrollTo');
  }
  window.addEventListener('scroll', onScroll);
})





onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});

const currentLinkBorderPosition = computed(() => {
  return `left: ${tabIndex.value * 20}%;`;
});

const addIdAnchor = (event) => {
  localStorage.setItem('scrollTo', event?.currentTarget?.id)
}

const setTabIndex = async (index) => {
  tabIndex.value = index;
  if (index === 1) {
    isFollowing.value = true;
    posts.value = null;
    isLoading.value = true;
    await getFollowingPosts();
    isLoading.value = false;
  }
  if (index === 0) {
    posts.value = null;
    isLoading.value = true;
    await getRecomendedPosts();
    isLoading.value = false;
  }
}
</script>


<template>
  <div class="content md:px-[20px] pt-[6px]" :class="{ 'pt-[18px]': !user }">
    <div class="content__inner">
      <div class="sub-menu">
        <div class="sub-menu__inner">
          <div class="sub-menu__items" v-if="user">
            <div v-for="(item, index) of links" :key="item.title" class="sub-menu__item" @click="setTabIndex(index)"
              :class="{ 'active': tabIndex === index, 'pointer-events-none': item.disabled }">
              <nuxt-link :to="item.to">
                {{ item.title }}
              </nuxt-link>
            </div>
            <div class="sub-menu__shape" :style="currentLinkBorderPosition" />
          </div>
        </div>
      </div>
      <div class="w-fit mx-auto" v-if="isLoading || isUpdate">
        <ProgressSpinner style="width: 40px;
          height: 40px" strokeWidth="5" fill="transparent" animationDuration=".8s"
          aria-label="Custom ProgressSpinner" />
      </div>
      <div v-if="!isLoading">
        <div v-for="(post, index) in posts" :key="post.id">
          <Post :key="post.id" :post="post" :id="post.id" id="{{ post.id }}" :index="index" @click="addIdAnchor"></Post>
        </div>
      </div>
      <div class="w-fit mx-auto" v-if="isLoadMore">
        <ProgressSpinner style="width: 40px;
          height: 40px" strokeWidth="5" fill="transparent" animationDuration=".8s"
          aria-label="Custom ProgressSpinner" />
      </div>
    </div>
  </div>
</template>

<style lang="scss">
.avatar {

  &,
  img {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    object-fit: cover;
  }
}

.post__tabs {
  color: #fff;
  justify-content: space-between;
  align-items: center;
  margin-top: 10px;

  & span {
    cursor: pointer;
  }
}

.content {
  &__inner {
    @include container;
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

.sub-menu {
  position: sticky;
  top: 12px;
  z-index: 110;
  width: 100%;
  background: #09090B;

  &__inner {
    //@include container;
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background-color: transparent;
    }

    scrollbar-color: transparent transparent;
    scrollbar-width: none;
    ;
  }

  &__items {
    position: relative;
    display: grid;
    grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
    justify-items: center;
    grid-gap: 5px;
  }

  &__item {
    font-family: 'ClashDislay', serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.02em;
    text-align: left;
    padding: 20px 0 21px;
    color: #A1A1AA;
    cursor: pointer;
    transition: 0.2s ease-in-out;

    &.active {
      color: #E4E4E7;
      font-weight: 600;
    }

    a {
      display: block;
      color: #FFFFFF;
      text-decoration: none;
      transition: 0.2s ease-in-out;
      word-break: break-all;
    }

    &:hover a {
      color: #E1E4ED;
    }
  }

  &__shape {
    $tabsCount: 5;
    $pagePadding: 10px;
    margin: 0 $pagePadding;
    position: absolute;
    height: 2px;
    left: 0;
    bottom: 12px;
    width: calc((100% / #{$tabsCount}) - #{$pagePadding * 2});
    background: #FFFFFF;
    transition: 0.3s ease-in-out;
  }

  @include _1279 {
    top: 64px;
  }
}
</style>
