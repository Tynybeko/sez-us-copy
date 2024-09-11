<template>
  <div class="onboarding">
    <div class="onboarding__body d-flex justify-center flex-column">
      <div class="onboarding__logo-container d-flex">
        <img alt="logo" class="onboarding__logo" src="@/assets/images/logo-green.svg">
        <span>sez us</span>
      </div>
      <div class="onboarding__content mt-[145px] px-[16px] sm:px-0">
        <h2 class="onboarding__title mb-[12px] d-flex items-center">Create your username<span v-if="false"
          class="onboarding__badge ml-[12px]">+100 pts!</span></h2>
        <p class="onboarding__text">Create a username or go with a default.</p>
        <p class="onboarding__text mb-[30px]">You can change it at any time.</p>
        <form id="username" action="#" class="form-container" @submit.prevent="saveInfo">
          <div class="form-field">
            <BaseField
              v-model:value="v.userName.$model"
              :error="v.userName.$errors"
              :label="'Username'"
              :placeholder="'userxyz09876'"
              class="form-field__input"
              isClearable
            ></BaseField>
          </div>
        </form>
        <div class="d-flex flex-end relative">
          <transition mode="in-out" name="fade">
            <BaseButton v-if="isButtonEnabled" class="onboarding__button onboarding__button-absolute" isIcon name="Next"
                        :form="'username'" :type="'submit'">
              <img alt="next" src="@/assets/images/arrow-outward-black.svg">
            </BaseButton>
            <BaseButton v-else class="onboarding__button onboarding__button-absolute disabled" isIcon name="Next">
              <img alt="next" src="@/assets/images/arrow-outward-grey.svg">
            </BaseButton>
          </transition>
        </div>
        <transition mode="in-out" name="fade">
          <p v-if="isTwitterUser" class="onboarding__text onboarding__text--twitter max-w-[430px]">That username is already taken on X. You can <a class="text-[#BEF264]" href="/onboarding/login-method">sign up</a> using your X account or choose a different username.</p>
        </transition>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted, watch} from "vue";
import {useRouter} from "vue-router";
import useVuelidate from "@vuelidate/core";
import {useStore} from "vuex";
import {
  helpers, minLength,
} from "@vuelidate/validators";

const store = useStore();
const router = useRouter();
const userAuth = ref(null);
const userName = ref('');
const isTwitterUser = ref(false);
const customError = ref('');
const alphaNum = helpers.withParams(
  { type: 'alphaNum' },
  (value) => /^[a-zA-Z0-9]*$/.test(value) || !value
);

const rules = computed(() => ({
  userName: {
    minLength: helpers.withMessage("Username must be at least 5 characters long", minLength(5)),
    alphaNum: helpers.withMessage("Username should contain only letters or numbers", alphaNum),
    customError: helpers.withMessage(
      () => customError.value,
      () => customError.value === ''
    ),
  },
}));
const v = useVuelidate(rules, {
  userName,
});

watch(userName, () => {
  customError.value = '';
});

const isButtonEnabled = computed(() => {
  return userName.value === '' || !v.value.$invalid;
});
const saveInfo = async () => {
  customError.value = '';
  if (userName.value) {
    isTwitterUser.value = false;
    try {
      const res = await fetch(`/api/twitter/username/${userName.value}`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      const data = await res.json();
      if(data.result === true) {
        isTwitterUser.value = true;
      } else {
        const response = await fetch(`/api/users/me`, {
          method: 'PATCH',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username: userName.value,
          }),
        });
        if (!response.ok) {
          let errorData;
          try {
            errorData = await response.json();
          } catch {
            throw { statusCode: response.status, message: 'Unexpected error format' };
          }
          throw { statusCode: response.status, message: errorData.message };
        }
        goToAddAvatar();
      }
    } catch (error) {
      if (error.statusCode === 409) {
        customError.value = `Username ${userName.value.toLowerCase()} is taken :( `;
      } else {
        customError.value = "An unexpected error occurred. Please try again.";
      }
      console.error(error.message || 'Unexpected error');
    }
  } else {
    goToAddAvatar();
  }
}
const goToAddAvatar = () => {
  router.push('/onboarding/add-avatar');
}
onMounted(async()=> {
  userAuth.value = JSON.parse(localStorage.getItem("user"));
});
</script>

<style lang="scss" scoped>
.onboarding__text--twitter {
  @media (max-width: 768px) {
    max-width: 300px;
  }
  @media (max-width: 468px) {
    max-width: 250px;
  }
  @media (max-width: 390px) {
    max-width: 200px;
    font-size: 14px;
  }
}
</style>
