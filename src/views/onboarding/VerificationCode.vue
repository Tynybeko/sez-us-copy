<template>
  <div class="onboarding">
    <div class="onboarding__body d-flex justify-center flex-column">
      <div class="onboarding__logo-container d-flex">
        <img alt="logo" class="onboarding__logo" src="@/assets/images/logo-green.svg">
        <span>sez us</span>
      </div>
      <div class="onboarding__content mt-[165px] px-[16px] sm:px-0">
        <h2 class="onboarding__title mb-[12px]">We sent you a code</h2>
        <p class="onboarding__text mb-[0]">Enter the six-digit code we sent to</p>
        <p class="ml-[5px]"><strong>{{ formattedUserPhone }}</strong>.</p>
        <div class="code-inputs mt-[36px] mb-[24px]">
          <input
            v-for="(code, index) in codeInputs"
            :key="index"
            ref="codeInput"
            v-model="codeInputs[index]"
            class="code-input"
            maxlength="1"
            type="text"
            @input="onInput(index)"
            @keydown.backspace="focusPrevious(index)"
          />
        </div>
        <div class="d-flex flex-end relative">
          <transition mode="in-out" name="fade">
            <BaseButton 
              v-if="isCodeComplete"
              class="onboarding__button onboarding__button-absolute"
              isIcon
              name="Next"
              @click="verifySmsCode"
            >
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
import {useRouter} from "vue-router";
import {useStore} from "vuex";
import {computed, onMounted, ref} from 'vue';

const router = useRouter();
const store = useStore();
const dispatchVerifySmsCode = (payload) => store.dispatch("verifySmsCode", payload);
const userPhone = computed(() => store.getters.getUserPhone);
const codeInputs = ref(new Array(6).fill(''));
const isCodeComplete = computed(() => {
  return codeInputs.value.every(code => code.length === 1);
});
const formattedUserPhone = computed(() => formatPhoneNumber(userPhone.value));
const formatPhoneNumber = (phoneNumber) => {
  const cleaned = ('' + phoneNumber).replace(/\D/g, '');
  const match = cleaned.match(/^(\d{1})(\d{3})(\d{3})(\d{4})$/);
  if (match) {
    return `+${match[1]} (${match[2]}) ${match[3]}-${match[4]}`;
  }
  return phoneNumber;
};
const onInput = (index) => {
  const value = codeInputs.value[index];
  codeInputs.value[index] = value.replace(/\D/g, '');
  if (codeInputs.value[index].length === 1) {
    focusNext(index);
  }
};
const focusNext = (index) => {
  if (codeInputs.value[index].length === 1 && index < codeInputs.value.length - 1) {
    const nextInput = index + 1;
    focusInput(nextInput);
  }
};
const focusPrevious = (index) => {
  if (index > 0 && codeInputs.value[index] === '') {
    const previousInput = index - 1;
    focusInput(previousInput);
  }
};
const focusInput = (index) => {
  const inputs = document.querySelectorAll('.code-input');
  if (inputs[index]) {
    inputs[index].focus();
  }
};
const verifySmsCode = async () => {
  const enteredCode = codeInputs.value.join('');
  const payload = {
    phone: userPhone.value,
    code: enteredCode,
  }
  await dispatchVerifySmsCode(payload);
  goToCreatePassword();
};
const goToCreatePassword = () => {
  router.push('/onboarding/create-password');
}
onMounted(() => {
  focusInput(0);
});
</script>
<style lang="scss" scoped>
.code-inputs {
  display: flex;
  justify-content: center;
  gap: 12px;
}

.code-input {
  width: 85px;
  height: 46px;
  font-size: 36px;
  line-height: 40px;
  font-weight: 500;
  text-align: center;
  border: none;
  border-bottom: 1px solid #52525B;
  background: transparent;
  color: white;
  mix-blend-mode: plus-lighter;
  caret-color: transparent;
  outline: none;
  transition: border-color 0.3s;
  @include _639 {
    width: 63px;
  }
  @include _480 {
    width: 45px;
  }
}

.code-input:focus {
  border-bottom: 1px solid #27272A;
}

</style>

