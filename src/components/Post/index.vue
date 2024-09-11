<template>
  <component :is="!getPost?.text && !getPost?.title && route.name !== 'post' ? 'a' : 'div'" :href="linkOnPost(getPost.id)"
    class="post relative !bg-[#18181B] text-white" :class="{ '!bg-transparent !-mb-2': isReply || isProfileReply }"
    :style="{ marginBottom: `${gap}px` }">

    <div v-if="isProfileReply" class="reply-line"></div>
    <div class="post__avatar-container !max-h-[70px]">
      <RouterLink @click.stop :to="`/profile/${getUser.id}`">
        <BaseAvatar :storageId="getUser.avatarFile?.storageId" :verified="getUser.verified" />
      </RouterLink>
      <div class="post__badge mx-auto post__badge--gradient">{{
        abbreviateNumber(getUser.rating)
      }}
      </div>

    </div>
    <div class="grow">
      <div class="post__body ">
        <div class="post__header items-center">
          <RouterLink v-if="fullName" @click.stop :to="`/profile/${getUser.id}`" class="post__username hover:underline">
            {{ fullName }}
          </RouterLink>
          <div class="post__badge post__badge--grey">Newbie</div>
          <div v-if="isReply" class="post__badge post__badge--gradient">{{
            abbreviateNumber(getUser.rating)
          }}
          </div>
          <span v-if="!post?.repostedPost?.publishedAt" class="post__date">{{
            getRelativeTime(post.publishedAt)
          }}</span>
          <span v-else class="post__date">{{ getRelativeTime(post.repostedPost.publishedAt) }}</span>
          <img v-if="post.markedBotByUsersIds[0] || reportId === post.id" src="/icon/smart_toy.svg" alt="logo">
          <div class="relative flex p-[10px] -m-[10px] z-20" @click.stop.prevent="toggleDropdown">
            <button class="post__menu-button">
              <img class="w-[26px]" src="/icon/dots.svg" alt="menu">
            </button>
            <div v-show="isDropdownVisible"
              class="post__menu-dropdown absolute right-0 mt-4 py-1 w-24 bg-white rounded-md shadow-l z-20"
              :class="{ 'w-[155px]': userdata && userdata.id !== post.authorUserId }">
              <button @click="handleEditPost(post)" v-if="userdata && userdata.id === post.authorUserId"
                class="text-left w-full px-2 py-1 hover:bg-gray-100">Edit
              </button>
              <button @click="handleDeletePost(post.id)" v-if="userdata && userdata.id === post.authorUserId"
                class="text-left w-full px-2 py-1 hover:bg-gray-100">Delete
              </button>
              <button @click="handleReport($event, post.id)" v-if="userdata"
                class="text-left w-full px-2 py-1 hover:bg-gray-100">Report as Suspected AI/Bot
              </button>
            </div>
          </div>
        </div>
        <div class="post__content">
          <span
            v-if="isProfileRepost && !isReply || (post.repostedByUsersIds.filter(id => id === userdata?.id)[0] === userdata?.id && userdata?.id)"
            class="text-[#fff] text-sm">#Reposted {{
              getUser.username
            }}</span>
          <h2 v-if="getPost.title">{{ getPost.title }}</h2>
          <component :is="route.name === 'post' && getPost.id === route.params.id ? 'div' : 'a'"
            :href="linkOnPost(getPost.id)">
            <p id="text" v-html="getPost?.text || getPost.repostedPost?.text"></p>
            <p v-if="getPost.urls[0] && getPost.urls[0].title">{{ getPost.urls[0].title }}</p>
            <p v-if="getPost.urls[0] && getPost.urls[0].description">{{ getPost.urls[0].description }}</p>
            <img v-if="getPost.urls[0] && getPost.urls[0].imageUrl" :src="getPost.urls[0].imageUrl" alt="image">
          </component>
          <div v-if="getPost.attachedFiles?.length && !isReply && !isProfileReply" @click="blockLink" class="grid gap-3"
            :class="clsx('overflow-hidden', {
              'max-h-[220px] sm:max-h-[520px]': getPost.attachedFiles?.length > 1
            }, imageGrids[getPost.attachedFiles.length].wrapper)">
            <ImageWithPreview v-for="(postFile, index) in getPost?.attachedFiles" :key="postFile.id"
              :classes="clsx('min-h-[100px] sm:min-h-[250px]', imageGrids[getPost.attachedFiles.length].item[index])"
              :class="{ 'max-h-[100px] sm:max-h-[250px]': getPost.attachedFiles.length === 4 }"
              :src="BaseURL + postFile.storageId" :post="postFile" />
          </div>
        </div>
        <div v-if="userdata" @click="blockLink" class="post__footer"
          :class="{ 'mt-[24px]': (!post.attachedFile?.storageId && !post.repostedPost?.attachedFile?.storageId) && !isReply }">
          <div class="post__actions-wrapper">

            <div class="post__actions mt-2">
              <Reactions
                :disabled="userdata && userdata.id === post.authorUserId && (!isProfileRepost && !isReply || (post.repostedByUsersIds.filter(id => id === userdata?.id)[0] === userdata?.id))"
                :post="isProfileRepost && !isReply ? post.repostedPost : post" @update:addReply="addReply" />

              <!--              <button-->
              <!--                  @click="like(post.id)"-->
              <!--                  class="button1 post__action-button post__action-button&#45;&#45;like flex items-center justify-center"-->
              <!--              >-->
              <!--                <div v-if="!userdata">-->
              <!--                  <img src="/src/assets/images/heart.svg" alt="like">-->
              <!--                </div>-->
              <!--                <div v-else>-->
              <!--                  <div v-if="isLikes">-->
              <!--                    <img v-if="isLiked || post.likedByUsersIds.filter(id => id === userdata?.id)[0] === userdata?.id"-->
              <!--                         src="/src/assets/images/heartLike.svg" alt="like">-->
              <!--                    <img v-else src="/src/assets/images/heart.svg" alt="like">-->
              <!--                  </div>-->
              <!--                  <div v-else>-->
              <!--                    <img v-if="isLiked" src="/src/assets/images/heartLike.svg" alt="like">-->
              <!--                    <img v-else src="/src/assets/images/heart.svg" alt="like">-->
              <!--                  </div>-->
              <!--                </div>-->
              <!--                <span class="ttt ml-1">{{ getPost.numLikes }}</span>-->
              <!--              </button>-->
              <div class="flex post__action-button post__action-button--comment"
                :class="{ 'pointer-events-none': route.name === 'post' && disabledLink }" @click="openModalReply(post)">
                <img src="/src/assets/images/bubble-right.svg" alt="comment">
                <span class="ml-1">{{ getPost.numReplies }}</span>
              </div>
              <button class="button1 post__action-button post__action-button--like flex items-center justify-center"
                :class="{ 'pointer-events-none': post.authorUser?.id === userdata?.id && !isProfileRepost }">
                <div v-if="!userdata" class="flex">
                  <img @click="showErrorAuth()" src="/src/assets/images/quote.svg" alt="quote">
                  <span class="ml-1">{{ getPost.numReposts }}</span>
                </div>
                <div v-else>
                  <div v-if="isReposte" class="flex">
                    <img v-if="isRepost || post.repostedByUsersIds.filter(id => id === userdata?.id)[0] === userdata?.id"
                      src="/src/assets/images/quoteActive.svg" alt="quote" @click="repost(post.id, true)">
                    <img
                      v-else-if="isProfileRepost && post.repostedPost.repostedByUsersIds.filter(id => id === userdata?.id)[0] === userdata?.id"
                      src="/src/assets/images/quoteActive.svg" alt="quote" @click="repost(post.repostedPostId, true)">
                    <img v-else src="/src/assets/images/quote.svg" alt="quote"
                      @click="repost(post.id, post.repostedByUsersIds.filter(id => id === userdata?.id)[0] === userdata?.id)">
                    <span class="ml-1">{{ getPost.numReposts }}</span>
                  </div>
                  <div v-else class="flex">
                    <img v-if="isRepost" src="/src/assets/images/quoteActive.svg" alt="quote"
                      @click="repost(post.id, true)">
                    <img v-else src="/src/assets/images/quote.svg" alt="quote"
                      @click="repost(post.id, post.repostedByUsersIds.filter(id => id === userdata?.id)[0] === userdata?.id)">
                    <span class="ml-1">{{ getPost.numReposts }}</span>
                  </div>
                </div>
              </button>
              <button v-if="false" class="post__action-button post__action-button--share">
                <img src="/src/assets/images/send.svg" alt="send">
              </button>
            </div>
          </div>
          <!-- <div class="post__badges-wrapper">
            <span class="post__badge post__badge--amber">Inspiring</span>
            <span class="post__badge post__badge--indigo">Brilliant</span>
            <span class="post__badge post__badge--purple">Insightful</span>
          </div> -->
        </div>
      </div>
    </div>
  </component>
</template>

<script setup>
import { ref, onMounted, computed, onUnmounted } from "vue";
import { useStore } from "vuex";
import { useRoute } from "vue-router";
import { abbreviateNumber } from '../../utils/utils.js';
import clsx from 'clsx';
import { useToast } from 'primevue/usetoast';
import Reactions from "../Reactions/Reactions.vue";
import ImageWithPreview from "@/components/ImageWithPreview/ImageWithPreview.vue";
import { useConfirm } from "primevue/useconfirm";
const confirm = useConfirm();
import { BaseURL } from "@/global/baseUrls.js"
const toast = useToast();
const emit = defineEmits(["getRepostId", "deletePost", "addReply"]);
const isShowModal = (value) => store.dispatch("showModal", value);
const setEditData = (data) => store.dispatch("addModalDataToState", data)
const isShowModalReply = (value) => store.dispatch("showModalReply", value);
const setDataReplyPost = (post) => store.dispatch("setReplyData", post);
const setUpdateStatus = (payload) => store.dispatch("setUpdateStatus", payload);
const getRecomendedPosts = () => store.dispatch("setRecomendedPosts");
const getReportPost = (id) => store.dispatch("setRecomendedPost", id);
const reportId = computed(() => store.getters.getReportPostId);
const route = useRoute();
const store = useStore();
const userdata = ref(null);
const isLiked = ref(false);
const isRepost = ref(false);
const isLikes = ref(true);
const isReposte = ref(true);
const isDropdownVisible = ref(false);


const props = defineProps({
  post: {
    type: Object,
    default: "",
  },
  showReplyLine: {
    type: Boolean,
    default: false
  },
  index: {
    type: Number,
    default: 1
  },
  isAuth: {
    type: Boolean,
    default: false
  },
  gap: {
    type: String,
    default: "15"
  },
  followingList: {
    type: Array,
    default: []
  },
  isReply: {
    type: Boolean,
    default: false
  },
  isProfileReply: {
    type: Boolean,
    default: false
  },
  isProfileRepost: {
    type: Boolean,
    default: false
  },
});

const isReply = route.meta.isReply || props.isReply

const blockLink = (e) => {
  e.stopPropagation();
  e.preventDefault();
}

const imageGrids = {
  '1': {
    "wrapper": "grid-cols-1",
    "item": ['max-h-[220px] sm:max-h-full'],
  },
  '2': {
    "wrapper": "grid-cols-2",
    "item": ['max-h-[220px] sm:max-h-full', 'max-h-[220px] sm:max-h-full'],
  },
  '3': {
    "wrapper": "grid-cols-2",
    "item": ['row-span-2 max-h-[215px] sm:max-h-full', 'max-h-[100px] sm:max-h-[240px]', 'max-h-[100px] sm:max-h-[240px]'],
  },
  '4': {
    "wrapper": "grid-cols-2",
    "item": ['', '', '', ''],
  },
  '5': {
    "wrapper": "grid-cols-2",
    "item": ['col-span-2', '', '', '', ''],
  }
}

onMounted(() => {
  userdata.value = JSON.parse(localStorage.getItem("user"));
  isLikes.value = true;
  isReposte.value = true;
  document.addEventListener('click', closeDropdownOnOutsideClick);
});

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick);
});

const goPost = (id) => {
  document.location.href = `/post/${id}`;
}

const linkOnPost = (id) => {
  return isReply ? `/reply/${id}` : `/post/${id}`
}

const handleReport = (event, id) => {
  confirm.require({
    target: event.currentTarget,
    message: 'Are you sure you want to mark this post as suspicious AI/Bot?',
    acceptLabel: "Submit",
    rejectLabel: "Cancel",
    accept: async () => {
      const reportResp = await fetch(`/api/posts/${id}/mark-bot`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
      );
      if (reportResp.status !== 200 && reportResp.status !== 201) {
        toast.add({ severity: 'error', summary: 'Rejected', detail: 'Report not created', life: 3000 });
      } else {
        // await getRecomendedPosts();
        // if(route.name === 'post') {
        //   await getReportPost(id);
        // } else {
        //   await getRecomendedPosts();
        // }
        toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Report submitted', life: 3000 });
      }
    },
    reject: () => {

    }
  });
};
const isProfileRepost = computed(() => {
  return !!props.post.repostedPost
})

const getUser = computed(() => {
  if (isProfileRepost.value && !isReply) {
    return props.post.repostedPost.authorUser
  }
  return props.post.authorUser
})

const getPost = computed(() => {
  if (isProfileRepost.value && !isReply) {
    return props.post.repostedPost
  }
  return props.post
})


const fullName = computed(() => {
  let firstName = getUser.value.firstName
  let lastName = getUser.value.lastName
  let userName = getUser.value.username

  if (!firstName && !lastName) {
    return userName
  }

  return firstName + ' ' + lastName
})

const addReply = () => {
  props.post.numReplies += 1
  emit('addReply')
}

const showErrorAuth = () => {
  toast.add({
    severity: 'error',
    summary: 'Please sign in!',
    life: 7000,
  });
}
const openModalReply = async (post) => {
  if (!userdata.value) {
    showErrorAuth();
    return;
  }
  document.body.style.overflow = "hidden";
  await setDataReplyPost(post);
  isShowModalReply(true);
}

const repost = async (id, type) => {
  isReposte.value = false;
  if (!userdata.value) {
    showErrorAuth();
    return;
  }
  try {
    const response = await fetch(
      type ? `/api/posts/${id}/undo-repost` : `/api/posts/`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          repostedPostId: type ? undefined : id,
        }),
      }
    );

    if (response.status === 429) {
      toast.add({
        severity: 'error',
        summary: 'Sorry, you have reached the max number of posts allowed for users with your score',
        life: 7000,
      });
      return;
    }
    setUpdateStatus(true);
    const data = await response.json();
    if (data.error) {
      console.log('error', data.message)
    } else {
      if (!data.satusCode) {
        if (data.repostedPost?.id) {
          getPost.value.numReposts += 1;
          isRepost.value = true;
          await getRecomendedPosts();
          setUpdateStatus(false);
          toast.add({
            severity: "success",
            summary: "The repost was published",
            life: 7000
          });
        } else {
          getPost.value.numReposts -= 1;
          isRepost.value = false;
          await getRecomendedPosts();
          setUpdateStatus(false);
          toast.add({
            severity: "success",
            summary: "The repost was canceled",
            life: 7000
          });
        }
      } else {
        commit("setUserDataError", data);
      }
    }
  } catch (error) {
    console.log('error', error)
    commit("setUserDataError", error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 7000,
    });
  }
}

const like = async (id, type) => {
  isLikes.value = false;
  if (!userdata.value) {
    showErrorAuth();
    return;
  }
  try {
    const response = await fetch(
      `/api/posts/${id}/like`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      }
    );
    if (response.status === 429) {
      toast.add({
        severity: 'error',
        summary: 'Sorry, you have reached the max number of posts allowed for users with your score',
        life: 7000,
      });
      return;
    }
    const data = await response.json();
    if (data.error) {
      console.log('error', data.message)
    } else {
      if (!data.satusCode) {
        if (data.likedByUsersIds.filter(id => id === userdata.value.id)[0] === userdata.value.id) {
          props.post.numLikes += 1;
          isLiked.value = true;
        } else {
          props.post.numLikes -= 1;
          isLiked.value = false;
        }
      } else {
        commit("setUserDataError", data);
      }
    }
  } catch (error) {
    console.log('error', error)
    commit("setUserDataError", error);
    toast.add({
      severity: 'error',
      summary: 'Error',
      detail: error,
      life: 7000,
    });
  }
}

const now = computed(() => store.getters.getCurrentTime);
const getRelativeTime = (publishedAt) => {
  const rtf = new Intl.RelativeTimeFormat('en', { numeric: 'auto' });
  const publishedDate = new Date(publishedAt);

  if (isNaN(publishedDate.getTime())) {
    console.error("Invalid date format:", publishedAt);
    return "Invalid date";
  }

  const seconds = Math.floor((now.value - publishedDate) / 1000);
  const minutes = Math.floor(seconds / 60);
  const hours = Math.floor(minutes / 60);
  const days = Math.floor(hours / 24);
  const months = Math.floor(days / 30);
  const years = Math.floor(days / 365);

  if (seconds < 60) {
    return 'now';
  } else if (minutes < 60) {
    return `${minutes}m`;
  } else if (hours < 24) {
    return `${hours}h`;
  } else if (days < 30) {
    return rtf.format(-days, 'day');
  } else if (months < 12) {
    return rtf.format(-months, 'month');
  } else {
    return rtf.format(-years, 'year');
  }
}
const toggleDropdown = (e) => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const closeDropdownOnOutsideClick = (event) => {
  if (!event.target.closest('.post__menu-dropdown')) {
    isDropdownVisible.value = false;
  }
};

const handleEditPost = async (post) => {
  await setEditData(post);
  isShowModal(true);
  document.body.style.overflow = "hidden";
};

const handleDeletePost = async (postId) => {
  try {
    setUpdateStatus(true);
    await store.dispatch('deletePost', postId);
    setUpdateStatus(false);
    emit("deletePost");
  } catch (error) {
    console.error('Error when deleting post:', error);
  }
};
</script>

<style lang="scss" scoped>
.replyLine {
  width: 1px;
  height: 100%;
  background: rgba(255, 255, 255, 0.2);
}

.p-confirm-popup {
  left: 0 !important;
  top: 200px !important;
  max-width: 400px !important;
  right: 0 !important;
}
</style>