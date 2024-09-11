<template>
  <div class="onboarding">
    <div class="onboarding__body d-flex justify-center flex-column">
      <div class="onboarding__logo-container d-flex">
        <img alt="logo" class="onboarding__logo" src="@/assets/images/logo-green.svg">
        <span>sez us</span>
      </div>
      <div class="onboarding__content mt-[195px] ">
        <div class="mb-[95px]">
          <BaseButton name="Continue with X" isIcon mode="bordered" class="button-social-login mb-3" @click="authWithX">
            <img alt="x login" src="@/assets/images/x.svg">
          </BaseButton>
          <!-- <BaseButton name="Continue with Facebook" isIcon mode="bordered" class="button-social-login mb-3 pointer-events-none">
            <img alt="x login" src="@/assets/images/facebook.svg">
          </BaseButton>
          <BaseButton name="Continue with Google" isIcon mode="bordered" class="button-social-login pointer-events-none">
            <img alt="x login" src="@/assets/images/google.svg">
          </BaseButton> -->
        </div>
        <div class="onboarding__buttons-container d-flex mb-[24px]">
          <div>
            <BaseButton name="Create account" isIcon class="big-button" @click="goToCreateAccount">
              <img alt="next" src="@/assets/images/arrow-outward-black.svg">
            </BaseButton>
          </div>
          <div>
            <BaseButton name="Login" isIcon mode="text" class="big-button big-button--text" @click="goToLogin">
              <img alt="next" src="@/assets/images/arrow-outward-white.svg">
            </BaseButton>
          </div>
        </div>
        <p class="onboarding__small-text ml-[24px]">By signing up, you agree to our <a href="">Terms</a>, <a href="">Privacy Policy</a>,
          and <a href="">Cookies Use</a>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from "vuex";
import {useRouter} from "vue-router";

const store = useStore();

const authWithX = () => store.dispatch("authWithX");
const router = useRouter();
const goToCreateAccount = () => {
  router.push('/onboarding/create-account');
}
const goToLogin = () => {
  router.push('/sign-in');
}
</script>
