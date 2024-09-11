<template>
  <div class="onboarding">
    <div class="onboarding__body d-flex justify-center flex-column">
      <div class="onboarding__logo-container d-flex">
        <img alt="logo" class="onboarding__logo" src="@/assets/images/logo-green.svg">
        <span>sez us</span>
      </div>
      <div class="onboarding__content mt-[145px] px-[16px] sm:px-0">
        <h2 class="onboarding__title mb-[12px]">Create a password</h2>
        <p class="onboarding__text mb-[30px]">Create a password with at least 6 letters and/or numbers.</p>
        <form id="password" action="#" class="form-container" @submit.prevent="saveInfo">
          <div class="form-field">
            <BaseField
              v-model:value="v.userPassword.$model"
              class="form-field__input"
              isPassword
              :error="v.userPassword.$errors"
              :type="passwordType"
              :placeholder="'Enter password'"
              :label="'Password'"
              @showPassword="togglePasswordType()"
            ></BaseField>
          </div>
          <div v-if="!v.userPassword.$invalid" class="form-field">
            <BaseField
              v-model:value="v.userConfirmPassword.$model"
              class="form-field__input"
              isPassword
              :error="v.userConfirmPassword.$errors"
              :type="confirmPasswordType"
              :placeholder="'Enter password'"
              :label="'Confirm password'"
              @showPassword="toggleConfirmPasswordType()"
            ></BaseField>
          </div>
        </form>
        <div class="d-flex flex-end relative">
          <transition name="fade" mode="in-out">
            <BaseButton v-if="!v.$invalid" :form="'password'" :type="'submit'" class="onboarding__button onboarding__button-absolute" isIcon name="Next">
              <img alt="next" src="@/assets/images/arrow-outward-black.svg">
            </BaseButton>
            <BaseButton v-else class="onboarding__button onboarding__button-absolute disabled" isIcon name="Next">
              <img alt="next" src="@/assets/images/arrow-outward-grey.svg">
            </BaseButton>
          </transition>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {ref, computed, onMounted} from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { useStore } from "vuex";
import {
  required,
  helpers,
  minLength,
  sameAs,
} from "@vuelidate/validators";

const store = useStore();
const router = useRouter();
const userPassword = ref("");
const userConfirmPassword = ref("");
const passwordType = ref("password");
const confirmPasswordType = ref("password");
const userAuth = ref(null);

const firstName = computed(() => store.getters.getFirstName);
const lastName = computed(() => store.getters.getLastName);
const birthDate = computed(() => store.getters.getBirthDate);

const rules = computed(() => ({
  userPassword: {
    required: helpers.withMessage("Field cannot be empty", required),
    minLength: helpers.withMessage(
      `Minimum length: 6 characters`,
      minLength(6)
    ),
  },
  userConfirmPassword: {
    required: helpers.withMessage("Field cannot be empty", required),
    minLength: helpers.withMessage(
      `Password too short`,
      minLength(6)
    ),
    sameAs: helpers.withMessage(
      "Passwords do not match",
      sameAs(userPassword)
    ),
  },
}));
const v = useVuelidate(rules, {
  userPassword,
  userConfirmPassword,
});
const togglePasswordType = () => {
  passwordType.value === "password"
    ? (passwordType.value = "text")
    : (passwordType.value = "password");
};
const toggleConfirmPasswordType = () => {
  confirmPasswordType.value === "password"
    ? (confirmPasswordType.value = "text")
    : (confirmPasswordType.value = "password");
};
const saveInfo = async () => {
  if (firstName.value && lastName.value && birthDate.value) {
    try {
      const response = await fetch(`/api/users/me`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          password: userPassword.value,
          firstName: firstName.value,
          lastName: lastName.value,
          dob: birthDate.value
        }),
      });
      if (response.ok) {
        goToCreateUsername();
      } else {
        throw new Error(`Error save user info: ${response.statusText}`);
      }
    } catch (error) {
      console.error(error.message);
    }
  } else {
    console.error("Incomplete user info. Please fill in all fields.");
  }
}
const goToCreateUsername = () => {
  router.push('/onboarding/create-username');
}
onMounted(async()=> {
  userAuth.value = JSON.parse(localStorage.getItem("user"));
});
</script>
