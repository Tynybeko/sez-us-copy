<template>
    <div class="content">
    <div class="content__inner">
      <div v-if="profileData" class="profile">
        <EditProfileModal
          v-model:isShow="isEditProfileModalVisible"
          is-close-active
          :title="'Edit profile'"
          @profileUpdated="updateUserProfile"
        >
        </EditProfileModal>
    <div class="profile-head">
        <button class="back-button d-flex items-center" @click="goBack">
          <span><img class="mr-1" src="/src/assets/images/back-arrow.svg"></span>
          Back
        </button>
        <div class="d-flex justify-center items-center m-auto">
            <span v-if="profileData?.username">@{{profileData?.username}}</span>
            <span v-else-if="profileData?.twitterUsername">@{{ profileData.twitterUsername }}</span>
            <span v-else >{{profileData?.firstName}} {{profileData?.lastName}}</span>
            <span v-if="!profileData?.firstName && profileData?.lastName && !!profileData?.username">@User name</span>
            <span v-if="profileData?.verified" class="ml-2"><img class="w-[14px]" src="/src/assets/images/verified-icon.svg"></span>
        </div>
        <div class="d-flex">
          <a v-if="false" class="d-flex items-center mr-[20px]" href="/">
            <img class="w-[20px]" src="/icon/bell.svg">
          </a>
          <div v-if="userAuth?.id === userId" class="relative flex">
            <button class="post__menu-button" @click.stop="toggleDropdown">
              <img class="w-[20px]" src="/src/assets/images/more_horiz.svg">
            </button>
            <div v-show="isDropdownVisible"
                 class="post__menu-dropdown absolute right-0 mt-4 py-1 w-24 bg-white rounded-md shadow-l z-20">
              <button @click="togglelogOut" class="text-left text-[14px] w-full px-2 py-1 hover:bg-gray-100">Log out</button>
            </div>
          </div>
        </div>
    </div>
    <div class="profile-info">
        <div class="d-flex gap-[10px]">
          <div class="profile-details d-flex flex-column w-full">
            <div class="profile-details__name">{{profileData?.firstName}} {{profileData?.lastName}}</div>
            <div v-if="profileData?.bio" class="profile-details__bio">{{profileData?.bio}}</div>
            <div v-if="false" class="profile-details__badges d-flex">
              <span class="post__badge">Philadelphia Orchestra</span>
              <span class="post__badge">Met Opera</span>
              <span class="post__badge">Orchestre Metropolitan</span>
            </div>
            <div class="d-flex items-center gap-2 mt-[36px] pl-3  text-[14px]">
              <div>
                <span class="fw-smbold" style="font-weight: 600;">{{ profileData?.numTotalFollowers || 0 }}</span>
                <span class="text-gray ml-1">followers</span>
              </div>
              <div>
                <span class="fw-smbold" style="font-weight: 600;">{{ profileData?.following?.length }}</span>
                <span class="text-gray ml-1">following</span>
              </div>
            </div>
          </div>
          <div class="flex flex-column gap-3">
            <BaseAvatar
                :storage-id="profileData?.avatarFile?.storageId"
                :size="'lg'"
            />
            <span class="post__badge post__badge--rating">{{ abbreviateNumber(profileData.rating) }}</span>
          </div>
        </div>
        <div class="mt-[36px]">
          <div v-if="!userAuth" class="d-flex justify-center gap-[24px]">
          </div>
          <div v-else-if="userAuth?.id === userId" class="d-flex justify-center gap-[24px]">
            <BaseButton class="base-btn--small w-[178px]" mode="secondary" @click="showEditProfileModal">Edit profile</BaseButton>
            <BaseButton v-if="false" class="base-btn--small w-[178px]" mode="secondary">Share profile</BaseButton>
          </div>
          <div v-else class="d-flex justify-center gap-[24px]">
            <div>
              <div v-if="isFollow">
                <BaseButton  @click="unFollowing(userdata.id)" :is-loading="followLoading" class="base-btn--small">Unfollow</BaseButton>
              </div>
              <div v-else class="flex items-center gap-[5px]">
                <BaseButton @click="following(userdata.id)" :is-loading="followLoading" class="base-btn--small">Follow :)</BaseButton>
                <BaseButton @click="following(userdata.id, true)" :is-loading="followLoading" class="base-btn--small">Follow :(</BaseButton>
              </div>
            </div>
            <BaseButton v-if="false" class="base-btn_bordered v" @click="Message">Message</BaseButton>
          </div>
        </div>
    </div>
    <div v-if="false" class="channels-container">
      <div class="channel">
        <div class="channel-avatar"><img :src="[ !userdata?.avatarFile ? `/images/DefaultAvatar.svg`: BaseURL+userdata?.avatarFile?.storageId]" alt="user's avatar"></div>
        <div class="channel-name">23-24 Opera</div>
      </div>
      <div class="channel">
        <div class="channel-avatar"><img :src="[ !userdata?.avatarFile ? `/images/DefaultAvatar.svg`: BaseURL+userdata?.avatarFile?.storageId]" alt="user's avatar"></div>
        <div class="channel-name">Masterclass</div>
      </div>
      <div class="channel">
        <div class="channel-avatar"><img :src="[ !userdata?.avatarFile ? `/images/DefaultAvatar.svg`: BaseURL+userdata?.avatarFile?.storageId]" alt="user's avatar"></div>
        <div class="channel-name">MAESTRO</div>
      </div>
    </div>
      <TabsMenu :tabs="links" :initialIndex="tabIndex" @update:selectedIndex="setTabIndex" />
      <div class="py-5 border-t">
        <div class="profile__posts">
        <div v-for="post in currentPosts" :key="post.id">
          <div v-if="tabIndex === 1">
            <ReplyPostBox
                :post="post"
                @delete-post="fetchPosts"
            />
          </div>
          <Post v-else-if="tabIndex === 2" :post="post" :isProfileRepost="true" @delete-post="fetchPosts"></Post>
          <Post v-else :post="post" @delete-post="fetchPosts"></Post>
        </div>
      </div>
      </div>
  </div>
    </div>
  </div>
</template>

<script setup>
import {onMounted, ref, computed, onUnmounted, onBeforeMount} from 'vue';
import { useStore } from "vuex";
import {useRoute, useRouter} from "vue-router";
import Post from "../components/Post/index.vue";
import TabsMenu from '../components/TabsMenu/index.vue';
import { abbreviateNumber } from '../utils/utils.js';
import { BaseURL } from "@/global/baseUrls.js"
import ReplyPostBox from "@/components/Post/ReplyPostBox.vue";
import EditProfileModal from "@/components/modals/editProfileModal.vue";
const route = useRoute();
const router = useRouter();
const store = useStore();
const getProfile = (id) => store.dispatch("setProfile", id);
const getOnlyUserPosts = (payload) => store.dispatch("setOnlyUserPosts", payload);
const getUserReplies = (userId) => store.dispatch("setUserReplies", userId);
const getUserReposts = (userId) => store.dispatch("setUserReposts", userId);
const logOut = (payload) => store.dispatch("logOut", payload);

const userdata = computed(() => store.getters.getProfile);
const userPosts = computed(() => store.getters.getOnlyUserPosts);
const userReplies = computed(() => store.getters.getUserReplies);
const userReposts = computed(() => store.getters.getUserReposts);
const currentPosts = computed(() => {
  if (tabIndex.value === 0) return userPosts.value;
  if (tabIndex.value === 1) return userReplies.value;
  if (tabIndex.value === 2) return userReposts.value;
  return [];
});
const userId = route.params.id;
const userAuth = computed(() => store.getters.getUser)
const profileData = computed(() => {
  return userAuth.value && userAuth.value.id === userId ? userAuth.value : userdata.value;
});
const isFollow = computed(() => {
  return  userAuth.value ? userAuth.value.following.includes(userId) : false;
})
const followLoading = ref(false);
const tabIndex = ref(0);
const isDropdownVisible = ref(false);
const isEditProfileModalVisible = ref(false);
const links = [
  {
    title: 'Posts',
    to: '',
    disabled: false
  },
  {
    title: 'Replies',
    to: '',
    disabled: false
  },
  {
    title: 'Reposts',
    to: '',
    disabled: false
  },
  // {
  //   title: 'Channel Posts',
  //   to: '',
  //   disabled: false
  // },
];

const fetchPosts = async () => {
  await getOnlyUserPosts({
    id: userId
  });
}
const showEditProfileModal = () => {
  isEditProfileModalVisible.value = true;
  document.body.style.overflow = 'hidden';
};

onBeforeMount(() => {
  store.commit('setProfile', null)
  store.commit('setOnlyUserPosts', [])
  store.commit('setUserReplies', []);
  store.commit('setUserReposts', []);
})

onMounted(async()=> {
  const payload = {
    id: userId
  }
  await getProfile(userId);
  await getOnlyUserPosts(payload);
  document.addEventListener('click', closeDropdownOnOutsideClick);
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdownOnOutsideClick);
});

const showUserPosts = () => {
  const payload = {
    id: userId
  }
  getOnlyUserPosts(payload);
}
const showUserReplies = () => {
  getUserReplies(userId);
}

const showUserReposts = () => {
  getUserReposts(userId);
}

const following = async (id, negative) => {
  if(followLoading.value) return

  followLoading.value = true
  try {
      const response = await fetch(`/api/users/${id}/follow`, {
        method: 'POST',
        body: JSON.stringify({
          negative,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        isFollow.value = true
        updateUserProfile();
      } else {
        throw new Error('Failed to follow user');
      }
    } catch (error) {
      console.error('Error in follow action:', error.message);
    }finally {
    followLoading.value = false
  }
}

const unFollowing = async (id) => {
  if(followLoading.value) return

  followLoading.value = true
  try {
      const response = await fetch(`/api/users/${id}/unfollow`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      if (response.ok) {
        updateUserProfile();
      } else {
        throw new Error('Failed to unFollow user');
      }
    } catch (error) {
      console.error('Error in unFollow action:', error.message);
    }finally {
    followLoading.value = false
  }
}

const updateUserProfile = async () => {
  await store.dispatch('getMe')
};

const setTabIndex = (index) => {
  tabIndex.value = index;
  if (index === 0) showUserPosts();
  if (index === 1) showUserReplies();
  if (index === 2) showUserReposts();
}

const toggleDropdown = () => {
  isDropdownVisible.value = !isDropdownVisible.value;
};

const closeDropdownOnOutsideClick = (event) => {
  if (!event.target.closest('.post__menu-dropdown')) {
    isDropdownVisible.value = false;
  }
};
const goBack = () => {
  router.go(-1);
}
const togglelogOut = () => {
  logOut();
  router.push('/');
}
</script>

<style lang="scss" scoped>
.content {
  overflow: hidden;
}
.profile {
  color: #E4E4E7;
  padding: 0 30px;
  @include _767 {
    padding: 0 16px;
  }
  &__setting {
    border: 1px solid #fff;
    border-radius: 20px;
    padding: 2px 10px;
    max-height: 40px;
  }
  &__posts {
  }
  &-head {
    padding: 12px 16px;
    display: flex;

    @include _1279 {
      padding: 12px 0;
    }
  }

  &-banner {
    height: 200px;
    object-fit: cover;
    width: 100%;

    img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
  }

  &-details {
    &__name {
      font-size: 24px;
      line-height: 31.92px;
      font-weight: 500;
      margin-bottom: 12px;
    }
    &__bio {
      font-size: 14px;
      line-height: 20.02px;
      margin-bottom: 12px;
    }
    &__badges {
      gap: 8px;
      .post__badge {
        background: #27272A;
        font-size: 12px;
        line-height: 15.96px;
        font-weight: 400;
      }
    }
  }

  &-info {
    padding: 12px 16px;
    @include _1279 {
      padding: 12px 0;
    }
  }
}
.channels-container {
  display: flex;
  overflow: scroll;
  gap: 36px;
  padding: 12px 0;
  margin-top: 12px;
  margin-bottom: 24px;
  border-width: 1px 0 1px 0;
  border-style: solid;
  border-color: #27272A;

  .channel {
    display: flex;
    flex-direction: column;
    width: fit-content;
    &-avatar {
      width: 64px;
      height: 64px;
      display: flex;
      justify-content: center;
      align-items: center;
      border-radius: 50%;
      border: 1px solid #27272A;
      margin-bottom: 6px;

      img {
        width: 56px;
        height: 56px;
        border-radius: 50%;
        object-fit: cover;
      }
    }
    &-name {
      font-size: 12px;
      font-weight: 500;
      text-align: center;
      width: max-content;
      max-width: 80px;
    }
  }
}
.WhoToFollow{
  &.withBg{
  }

  h2{
    padding-left: 20px;
    padding-right: 20px;
    padding-top: 20px;
  }
  &__item{
    display: grid;
    align-items: center;
    grid-template-columns: 40px 1fr 78px;
    gap: 10px;
    padding: 20px;
    img{
      width: 40px;
      height: 40px;
      border-radius: 50%;
      object-fit: contain;
    }
  }
}
.post__badge--rating {
  padding: 2px 4px;
  height: 18px;
  border-radius: 50px;
  font-size: 11px;
  line-height: 14px;
  color: #09090B;
  background: radial-gradient(ellipse at 23.33% 11.85%, #E2B6A0 0%, #AEB8E0 100%);
}
</style>