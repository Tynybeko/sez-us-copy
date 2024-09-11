<template>
  <div class="header">
    <div class="header__inner">
      <a href="/">
        <img src="/icon/Logo.svg" alt="logo">
      </a>
      <div class="flex" v-if="userdata">
        <a class="header__settings flex cursor-pointer" :href="`/profile/${userdata.id}`">
          <BaseAvatar
              :storage-id="userdata?.avatarFile?.storageId"
          />
          <img class="w-3 mr-[4px] ml-2" src="/icon/1111.svg" alt="icon">
          <span v-if="userdata" class="header__rating">{{ abbreviateNumber(userdata.rating) }}</span>
          <img class="header-arrow w-4" src="/icon/arrow-right.svg" alt="icon">
        </a>
        <img class="ml-[8px] cursor-pointer" src="/icon/Home.svg" alt="icon" @click="toHome">
      </div>
      <div class="hidden sm:flex xl:hidden" v-else>
        <BaseButton style="margin-right: 10px;" @click="logIn">Sign in</BaseButton>
        <BaseButton v-if="!userdata" class="max-w-[100px]" @click="signUp">Sign up</BaseButton>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import {computed, onMounted} from "vue";
import {abbreviateNumber} from '@/utils/utils.js';

const store = useStore();
const router = useRouter();
const userdata = computed(() => store.getters.getUser);
const isShowModal = (value) => store.dispatch("showModal", value);

const show = () => {
  isShowModal(true);
}
const toHome = () => {
  router.push('/');
}
const toProfile = () => {
  if (userdata.value && userdata.value.id) {
    router.push(`/profile/${userdata.value.id}`);
  } else {
    console.error("User ID is missing");
  }
}
const logIn = () => {
  router.push('/sign-in');
}
const signUp = () => {
  router.push('/onboarding/login-method');
}
</script>

<style lang="scss" scoped>
.header {
  position: fixed;
  display: flex;
  align-items: center;
  width: 100%;
  height: 80px;
  max-height: 80px;
  max-width: 1280px;
  padding: 16px 0;
  z-index: 100;
  background: #09090B;
  box-shadow: 0px 4px 6px -1px #00000040;

  &__inner {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  &__rating {
    font-family: $clash;
    color: #E4E4E7;
  }

  &__settings {
    display: flex;
    align-items: center;

    &:hover .header-arrow {
      transform: translateX(2px);
    }
  }
  @include _1400 {
    padding: 16px 20px;
  }
  @include _1279 {
    height: 64px;
    padding: 16px 48px;
  }
  @include _1024 {
    padding: 16px 44px;
    img {
      max-width: 90px;
    }
  }
  @include _767 {
    padding: 16px 32px;
  }
  @include _575 {
    padding: 16px;
  }
}

.header-arrow {
  transition: 0.2s ease-in-out;
  width: 7px;
  margin-left: 4px;
}
</style>