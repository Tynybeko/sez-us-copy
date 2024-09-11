<template>
  <header class="leftbar">
    <div class="leftbar__inner">
      <div class="d-flex sm:hidden xl:flex sm:flex-col" :class="{'pt-[18px]': !user}" v-if="!user">
        <AboutUsLink />
        <BaseButton style="margin-right: 10px;" class="mb-2" @click="logIn">Sign in</BaseButton>
        <BaseButton v-if="!userdata" class="max-w-[100px]" @click="signUp">Sign up</BaseButton>
      </div>
      <div v-if="userdata" class="leftbar__nav w-full mt-6 hidden xl:flex justify-start flex-col items-start">
        <div v-for="(links, index) in navLinks.filter(el => !el.hidden)" :key="links.name"
             @click="toggleLink(links, index)">
          <div
              class="leftbar__items flex justify-center items-center mb-[32px]"
              :class="{ 'pointer-events-none' : links.disabled, 'active' : links.isActive }"
          >
            <img class="w-[18px] mr-[4px]" :src="`/icon/${links.isActive ? links.iconActive : links.icon}`" alt="icon">
            <span class="leftbar__label text-[#A1A1AA] text-[18px] block cursor-pointer"
                  :class="{'mt-1': links.name === 'Home'}">{{ links.name }}</span>
          </div>
        </div>
      </div>
      <div v-if="userdata"
           class="leftbar__nav w-full mt-[12px] mb-[10px] flex xl:hidden justify-between sm:justify-start sm:flex-col items-start">
        <div v-for="(links, index) in navLinks.filter(el => !el.hiddenForMobile)" :key="links.name"
             @click="toggleLink(links, index)">
          <div
              class="leftbar__items flex justify-center items-center sm:mb-[24px] md:mb-[32px]"
              :class="{ 'pointer-events-none' : links.disabled, 'active' : links.isActive }"
          >
            <img class=" cursor-pointer w-[18px]" :src="`/icon/${links.isActive ? links.iconActive : links.icon}`"
                 alt="icon">
          </div>
        </div>
      </div>
    </div>
  </header>
</template>

<script setup>
import {ref, computed, onMounted, watch} from "vue";
import {useRouter, useRoute} from "vue-router";
import {useStore} from "vuex";
import AboutUsLink from "@/components/Leftbar/AboutUsLink.vue";


const store = useStore();
const userdata = ref(null);
const router = useRouter();
const route = useRoute();

const logOut = (payload) =>
    store.dispatch("logOut", payload);

const isShowModal = (value) => store.dispatch("showModal", value);
const setEditData = (data) => store.dispatch("addModalDataToState", data)
const user = localStorage.getItem("user");
const userData = computed(() => store.getters.getAuthUser);
const navLinks = ref([
  {
    icon: 'Home.svg',
    iconActive: 'Homefill.svg',
    name: 'Home',
    src: '/',
    isActive: false,
    disabled: false,
    hidden: false,
    hiddenForMobile: false,
  },
  {
    icon: 'Search.svg',
    iconActive: 'Search.svg',
    name: 'Explore',
    src: '/search',
    isActive: false,
    disabled: false,
    hidden: true,
    hiddenForMobile: false,
  },
  {
    icon: 'Channel.svg',
    iconActive: 'Channel.svg',
    name: 'About Us',
    src: '/beta-registration',
    isActive: false,
    disabled: false,
    hidden: false,
    hiddenForMobile: false,
  },
  {
    icon: 'Alert.svg',
    iconActive: 'Alertfill.svg',
    name: 'Alerts',
    isActive: false,
    disabled: true,
    hidden: true,
    hiddenForMobile: true,
  },
  {
    icon: 'Create.svg',
    iconActive: 'Create.svg',
    name: 'Create',
    isActive: false,
    disabled: false,
    hidden: false,
    hiddenForMobile: false,
  },
  {
    icon: 'Channel.svg',
    iconActive: 'Channel.svg',
    name: 'Channels',
    isActive: false,
    disabled: true,
    hidden: true,
    hiddenForMobile: true,
  }
])

watch(route, () => {
  if (route.fullPath === '/') {
    navLinks.value[0].isActive = true;
    navLinks.value[5].isActive = false;
  }
});

onMounted(() => {
  userdata.value = JSON.parse(localStorage.getItem("user"));
  navLinks.value.forEach(() => {
    if (route.fullPath === '/') {
      navLinks.value[0].isActive = true;
    }
  })
})

const toggleLink = (item, index) => {
  console.log('item', item)
  if (item.name === "Create") {
    setEditData(null);
    isShowModal(true);
  }
  if (item.src) {
    router.push(item.src);
  }
  navLinks.value.forEach((item, i) => {
    if (index === i) {
      item.isActive = true;
    } else {
      item.isActive = false;
    }
  })
}
const logIn = () => {
  router.push('/sign-in');
}
const signUp = () => {
  router.push('/onboarding/login-method');
}

const togglelogOut = () => {
  logOut();
}
</script>

<style lang="scss" scoped>
.leftbar__items {
  transition: 0.2s ease-in-out;
  opacity: 0.5;

  &.active {
    opacity: 1;
  }

  &:hover {
    opacity: 1;

    .leftbar__label {
      transform: translateX(5px)
    }
  }
}

.leftbar__label {
  transition: 0.2s ease-in-out;
}

.leftbar {
  &__inner {
    @include container;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: flex-start;
    position: sticky;
    top: 80px;
  }

  .nav-bar {
    width: 100%;
    background: transparent;

    &__inner {
      @include container;
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
    }

    &__items {
      position: relative;
      display: grid;
      grid-template-columns: 1fr 1fr;
      justify-items: center;
      grid-gap: 5px;
    }

    &__item {
      padding: 28px 0;
      color: #1390e5;
      transition: 0.2s ease-in-out;

      a {
        text-decoration: none;
      }

      span {
        display: block;
        color: #1390e5;
        text-decoration: none;
        transition: 0.2s ease-in-out;
        word-break: break-all;

        &:hover {
          opacity: 0.7;
        }
      }
    }

    &__shape {
      $tabsCount: 2;
      $pagePadding: 5px;
      margin: 0 $pagePadding;
      position: absolute;
      height: 2px;
      left: 0;
      bottom: 0;
      width: calc((100% / #{$tabsCount}) - #{$pagePadding * 2});
      background: #1390e5;
      transition: 0.3s ease-in-out;
    }
  }

  &__action {
    display: flex;
  }

  &__button {
    &_left {
      margin-right: 20px;
    }
  }

  @include _1279 {
    &__inner {
      padding: 0;
    }
  }
  @include _1024 {
    &__inner {
      padding-left: 44px;
    }
  }
  @include _767 {
    &__inner {
      padding-left: 32px;
    }
  }
  @include _639 {
    position: fixed;
    bottom: 0;
    left: 0;
    width: 100%;
    background-color: #09090B;
    z-index: 1000;
    padding: 16px 26px;
    &__inner {
      padding-left: 0px;
    }
  }
  @include _575 {
    &__button {
      font-size: 14px !important;
      padding: 0;
    }
    .nav-bar {
      &__item {
        padding: 15px 0;
        font-size: 12px;
      }
    }
  }
}
</style>
