<template>
  <ModalSucces :isShow="isValidate" :title="'Success!'"></ModalSucces>
  <BaseModal :isShow="!isValidate" isLogo isShadow
  >
    <template v-slot:body>
      <form action="#" @submit.prevent="processLogin" id="signin">
        <BaseField
            v-model:value="v.userPhone.$model"
            @update:value="message = ''"
            class="sign-in__field"
            :placeholder="'Enter phone'"
            :label="'Phone'"
            :error="v.userPhone.$errors"
        ></BaseField>
        <BaseField
            v-if="showSmsCodeInput "
            v-model:value="smsCode"
            class="sign-in__field"
            :placeholder="'Enter SMS code'"
            :label="'SMS code'"
            :error="v.smsCode.$errors"
        ></BaseField>
      </form>
    </template
    >
    <template v-slot:footer
    >
      <div class="sign-in__buttons">
        <div v-if="message" class="error-message">{{ message }}</div>
        <BaseButton
            :type="'submit'"
            :is-loading="loading"
            :form="'signin'"
        > {{ buttonText }}</BaseButton>
        <div class="sign-in__actions-wrapper sign-in__actions-wrapper--skip" @click="skip">
          <span class="sign-in__skip">Skip</span><span class="icon-arrow"></span>
        </div>
        <div v-if="showSmsCodeInput" class="sign-in__actions-wrapper sign-in__actions-wrapper--resend" :class="{'pointer-events-none': !resend }" @click="resendCode">
          <span class="sign-in__resend">Resend code<span id="countdown" class="ml-2 text-[14px]">60</span></span><span class="icon-arrow"></span>
        </div>
      </div>
    </template
    >
  </BaseModal
  >
</template>

<script setup>
import {ref, computed} from "vue";
import {useRouter} from "vue-router";
import {required, minLength, helpers} from "@vuelidate/validators";
import {useStore} from "vuex";
import ModalSucces from "../components/modals/modalSucces.vue";
import useVuelidate from "@vuelidate/core";
import {useToast} from "primevue/usetoast";

const resend = ref(false);

const store = useStore();
const router = useRouter();
const loading = ref(false);
const message = ref('')
const isValidate = ref(false);

// store actions
const logIn = (payload) =>
    store.dispatch("logIn", payload);

const resendCode = async () => {
  resend.value = false;
  await sendSmsCode();
  let time = 59;
  const timer = setInterval(() => {
    document.getElementById('countdown').textContent = time <= 0 
      ? clearInterval(timer)
      : time--;
      if(!time) {
        resend.value = true;
      }
  }, 1000); 
}    

const dispatchSendSmsCode = async (payload) => {
  loading.value = true
  message.value = ''
  try {
    const res = await store.dispatch("sendSmsCode", payload)
    let time = 59;
    const timer = setInterval(() => {
      document.getElementById('countdown').textContent = time <= 0 
        ? clearInterval(timer)
        : time--;
        if(!time) {
          resend.value = true;
        }
    }, 1000); 
    if (res && res.status === 'error') {
      message.value = res.message
    }
  }catch (err){

  }finally {
    loading.value = false
  }
};
const dispatchVerifySmsCode = async (payload) => {
  return await store.dispatch("verifySmsCode", payload)
};

const authError = computed(() => store.getters.getAuthError);
const showSmsCodeInput = computed(() => store.getters.getShowSmsCodeInput);
const buttonText = computed(() => {
  return showSmsCodeInput.value ? "Sign in" : "Request SMS code";
});
const userPhone = ref("+1");
// const userPassword = ref("");
// const passwordType = ref("password");
const smsCode = ref("");


// правила валидации
const rules = computed(() => ({
  userPhone: {
    required: helpers.withMessage("Field cannot be empty", required),
    minLength: helpers.withMessage(
        `Invalid phone number format: please check the digit count and country code.`,
        minLength(12)
    ),
  },
  // userPassword: {
  //   required: helpers.withMessage("Field cannot be empty", required),
  // },
  smsCode: {
    required: helpers.withMessage("Field cannot be empty", required),
  },
}));

// инициализайия полей валидации
const v = useVuelidate(rules, {
  userPhone,
  // userPassword,
  smsCode,
});

const userSignIn = async () => {
  const isFormCorrect = await v.value.$validate();
  if (isFormCorrect) {
    const payload = {
      phone: userPhone.value,
      password: userPassword.value,
    };
    logIn(payload);
  } else {
    return;
  }
};

const processLogin = async () => {
  if (!showSmsCodeInput.value) {
    await sendSmsCode();
  } else await verifySmsCode();
}

const sendSmsCode = async () => {
  const isFormCorrect = await v.value.userPhone.$validate();
  if (isFormCorrect) {
    const payload = {
      phone: userPhone.value,
    };
    await dispatchSendSmsCode(payload);
  }
};

const verifySmsCode = async () => {
  const isFormCorrect = await v.value.$validate();
  if (isFormCorrect) {
    const payload = {
      phone: userPhone.value,
      code: smsCode.value,
    };
    const res = await dispatchVerifySmsCode(payload);
    if(res.status === 'error'){
      message.value = res.message
      return
    }
    await router.push("/");
  }

};

const togglePasswordType = () => {
  passwordType.value === "password"
      ? (passwordType.value = "text")
      : (passwordType.value = "password");
};

const skip = () => {
  localStorage.setItem("skip", true)
  router.push('/');
}

const toSignUpPage = () => {
  router.push("/sign-up");
};

const toHomePage = () => {
  router.push("/");
};
</script>

<style lang="scss" scoped>
.sign-in {
  &__field {
    min-width: 334px;
  }

  &__buttons {
    display: flex;
    flex-direction: column;
  }

  &__button {
    &_to-sign-in {
      margin-top: 15px;
      font-size: 16px;
    }
  }

  &__actions-wrapper {
    position: absolute;
    display: flex;
    align-items: center;
    &--skip {
      right: 15px;
      bottom: 5px;
      max-width: 50px;
      height: 40px;
    }
    &--resend {
      left: 15px;
      bottom: 12px;
    }
  }

  &__skip {
    cursor: pointer;
    color: #DE93D9;
    margin-right: 3px;
  }
  &__resend {
    cursor: pointer;
    color: #DE93D9;
  }

  @include _575 {
    &.base-modal {
      position: relative;
    }
    &__field {
      min-width: 100%;
    }
  }
}

.error-message {
  color: #F87171;
  padding: 10px 0;
  font-size: 13px;
  text-align: center;
}
</style>
