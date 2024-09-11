<template>
  <div class="primary">
    <Toast />
    <ConfirmPopup class="fixed w-[400px] top-[200px] left-0 right-0 mx-auto before:hidden after:hidden shadow-none rounded-[10px] !z-10"></ConfirmPopup>
    <ReplyModal
      v-model:isShow="isShowReply"
      is-close-active
      :title="'Reply'"
    >
      <template #body>
        <ReplyPost v-if="userdata" :user-data="userdata"></ReplyPost>
      </template>
    </ReplyModal>
    <AboutUsModal
      v-model:isShow="isShowAboutUs"
      is-close-active
    >
      <template #body>
        <AboutUs></AboutUs>
      </template>
    </AboutUsModal>
    <PostModal
      v-model:isShow="isShow"
      is-close-active
      :title="'Compose'"
    >
      <template #body>
        <UserPost v-if="userdata" :user-data="userdata"></UserPost>
      </template>
    </PostModal>
    <Header />
    <div class="primary__inner grid">
      <Leftbar />
      <RouterView class="primary__content px-[6px] sm:px-[0px]" />
      <Rightbar v-if="!isMobile && $route.path !== '/search'"/>
      <!-- <Rightbar v-if="false"/> -->
    </div>
  </div>
</template>

<script setup>
import {computed, onBeforeUnmount, onMounted, ref} from "vue";
import { useStore } from "vuex";
import Header from "@/components/Header/index.vue"
import Leftbar from "@/components/Leftbar/index.vue";
import Rightbar from "@/components/Rightbar/index.vue";
import Toast from "primevue/toast";
import UserPost from "../components/UserPost/index.vue"
import PostModal from "../components/modals/postModal.vue"
import ReplyPost from "../components/ReplyPost/index.vue"
import ReplyModal from "../components/modals/replyModal.vue"
import AboutUs from "../components/AboutUs/index.vue";
import AboutUsModal from "../components/modals/aboutUsModal.vue";
import ConfirmPopup from 'primevue/confirmpopup';
import { debounce } from "@/utils/debounce.js";
const store = useStore();
const isMobile = ref(false);
const isShow = computed(() => store.getters.getShowModalStatus);
const isShowReply = computed(() => store.getters.getShowModalReplyStatus);
const isShowAboutUs = computed(() => store.getters.getShowModalAboutUs);
const showModalAboutUs = (status) => store.dispatch("showModalAboutUs", status);
const userdata = JSON.parse(localStorage.getItem("user"));
const checkIfMobile = () => isMobile.value = window.innerWidth <= 1024;
const debouncedCheckIfMobile = debounce(checkIfMobile, 100);

onMounted(() => {
  const status = JSON.parse(localStorage.getItem("isFirstLogin"));
  if(!status && !userdata?.value) {
    showModalAboutUs(true);
  }
  checkIfMobile();
  window.addEventListener('resize', debouncedCheckIfMobile);
})
onBeforeUnmount(() => {
  window.removeEventListener('resize', debouncedCheckIfMobile);
});
</script>

<style lang="scss">
.primary {
  margin: 0 auto;
  background: #09090B;
  max-width: 1280px;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  &__content {
    flex-grow: 1;
  }
  &__inner {
    grid-template-columns: 177px 1fr 278px;
    padding-top: 80px;
  }
  @include _1279 {
    &__inner {
      grid-template-columns: 48px 1fr 278px;
      padding: 64px 48px 0;
    }
  }
  @include _1024 {
    &__inner {
      grid-template-columns: 101px 1fr;
      padding: 64px 0 0;
    }
  }
  @include _767 {
    &__inner {
      grid-template-columns: 76px 1fr;
    }
  }
  @include _639 {
    &__inner {
      grid-template-columns: 1fr;
      padding-top: 64px;
      padding-bottom: 80px;
    }
  }
}
.p-toast {
  position: fixed !important; 
  top: 30px !important;
  left: 0 !important; 
  right: 0 !important; 
  margin-left: auto !important; 
  margin-right: auto !important;
}
.wrap-confirm {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
}
</style>
