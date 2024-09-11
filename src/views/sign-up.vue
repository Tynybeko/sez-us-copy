<template>
  <ModalSucces
    :isShow="isValidate"
    :title="'Success!'"
  ></ModalSucces>
  <Toast />
  <BaseModal :isShow="!isValidate" isLogo
    ><template v-slot:body>
      <form action="#" @submit.prevent="userSignUp" id="signup">
        <BaseField
          v-model:value="v.userPhone.$model"
          class="sign-up__field"
          :error="v.userPhone.$errors"
          :placeholder="'Enter phone'"
          :label="'Phone'"
        ></BaseField>
        <BaseField
          v-model:value="v.userPassword.$model"
          class="sign-up__field"
          isPassword
          :error="v.userPassword.$errors"
          :type="passwordType"
          :placeholder="'Enter password'"
          :label="'Password'"
          @showPassword="togglePasswordType()"
        ></BaseField>
        <BaseField
          v-model:value="v.userConfirmPassword.$model"
          class="sign-up__field"
          isPassword
          :error="v.userConfirmPassword.$errors"
          :type="confirmPasswordType"
          :placeholder="'Enter password'"
          :label="'Repeat password'"
          @showPassword="toggleConfirmPasswordType()"
        ></BaseField>
      </form> </template
    ><template v-slot:footer
      ><div class="sign-up__buttons">
        <BaseButton v-if="!userdata" :type="'submit'" :form="'signup'"
          >Signup</BaseButton
        >
        <BaseButton
          class="sign-up__button sign-up__button_to-sign-up"
          :mode="'text'"
          @click="toSignInPage"
          >Login</BaseButton
        >
      </div>
      <div class="sign-up__skip-wrapper" @click="skip">
        <span class="sign-up__skip">Skip</span><span class="icon-arrow"></span>
      </div>
      </template
    ></BaseModal
  >
</template>

<script setup>
import { ref, computed, onMounted } from "vue";
import { useRouter } from "vue-router";
import useVuelidate from "@vuelidate/core";
import { useStore } from "vuex";
import {
  required,
  helpers,
  minLength,
  sameAs,
} from "@vuelidate/validators";
import ModalSucces from "../components/modals/modalSucces.vue";

const userdata = ref(null);
const store = useStore();
const router = useRouter();
const userPhone = ref("");
const userPassword = ref("");
const userConfirmPassword = ref("");
const isValidate = ref(false);
const passwordType = ref("password");
const confirmPasswordType = ref("password");

const signUp = (payload) =>
  store.dispatch("signUp", payload);

onMounted(() => {
  userdata.value = JSON.parse(localStorage.getItem("user"));
});

// правила валидации
const rules = computed(() => ({
  userPhone: {
    required: helpers.withMessage("Field cannot be empty", required),
    minLength: helpers.withMessage(
      `Minimum length: 12 characters - +7...`,
      minLength(12)
    ),
  },
  userPassword: {
    required: helpers.withMessage("Field cannot be empty", required),
    minLength: helpers.withMessage(
      `Minimum length: 8 characters`,
      minLength(8)
    ),
  },
  userConfirmPassword: {
    required: helpers.withMessage("Field cannot be empty", required),
    minLength: helpers.withMessage(
      `Minimum length: 8 characters`,
      minLength(8)
    ),
    sameAs: helpers.withMessage(
      "Password mismatch",
      sameAs(userPassword.value)
    ),
  },
}));

// инициализайия полей валидации
const v = useVuelidate(rules, {
  userPhone,
  userPassword,
  userConfirmPassword,
});

const userSignUp = async () => {
  const isFormCorrect = await v.value.$validate();
  if (isFormCorrect) {
    const payload = {
      phone: userPhone.value,
      password: userPassword.value,
    };
    signUp(payload);
  } else {
    return;
  }
};

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

const toSignInPage = () => {
  router.push("/sign-in");
};

const skip = () => {
  localStorage.setItem("skip", true)
  router.push('/');
}
</script>

<style lang="scss" scoped>
.sign-up {
  &__field {
    min-width: 334px;
  }
  &__buttons {
    display: flex;
    flex-direction: column;
  }
  &__button {
    &_to-sign-up {
      margin-top: 15px;
      font-size: 16px;
    }
  }
  &__skip-wrapper {
    position: absolute;
    right: 15px;
    bottom: 5px;
    max-width: 50px;
    height: 40px;
    display: flex;
    align-items: center;
  }
  &__skip {
    cursor: pointer;
    color: #DE93D9;
    margin-right: 3px;
  }
  @include _575 {
    &__field {
      min-width: 100%;
    }
  }
}
</style>
