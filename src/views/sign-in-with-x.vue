<template>
  <div class="mx-auto mt-[10%] flex flex-col text-center">
    <span class="text-[60px] text-[#BEF264]">Login with X...</span>
    <a v-if="!router.currentRoute.value.query.oauth_token || isError" class="text-[#F87171]" href="/onboarding/login-method">An error occurred, please try again</a>
  </div>
</template>

<script setup>
import { useRouter } from "vue-router";
import { onMounted, ref} from "vue";
import { useStore } from "vuex";

const store = useStore();
const router = useRouter();
const isError = ref(false);
const loginX = (payload) => store.dispatch("logInWithX", payload)

onMounted(async() => {
  const payload = {
    oauthToken: router.currentRoute.value.query.oauth_token,
    oauthVerifier: router.currentRoute.value.query.oauth_verifier,
  }
  if(true) {
    try {
      let result = await loginX(payload);
      if(result.status === 'error') {
        isError.value = true;
      }
    } catch (error) {
      console.log('e', error)
    }
  }
}) 

</script>
