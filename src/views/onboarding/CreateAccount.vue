<template>
  <div class="onboarding">
    <div class="onboarding__body d-flex justify-center flex-column">
      <div class="onboarding__logo-container d-flex">
        <img alt="logo" class="onboarding__logo" src="@/assets/images/logo-green.svg">
        <span>sez us</span>
      </div>
      <div class="onboarding__content mt-[35px] px-[16px] sm:px-0">
        <h2 class="mb-[24px]">Create your account</h2>
        <form id="signup" action="#" class="form-container" @submit.prevent="sendSmsCode">
          <div class="form-field">
            <BaseField
              v-model:value="v.firstName.$model"
              :error="v.firstName.$errors"
              :label="'First name'"
              :placeholder="'First name'"
              class="form-field__input"
              isClearable
            ></BaseField>
          </div>
          <div class="form-field">
            <BaseField
              v-model:value="v.lastName.$model"
              :error="v.lastName.$errors"
              :label="'Last name'"
              :placeholder="'Last name'"
              class="form-field__input"
              isClearable
            ></BaseField>
          </div>
          <div class="form-field">
            <BaseField
              v-model:value="v.userPhone.$model"
              :error="v.userPhone.$errors"
              :label="'Phone number'"
              :placeholder="'Phone number'"
              class="form-field__input"
              isClearable
            ></BaseField>
          </div>
          <div class="form-field">
            <BaseField
              v-model:value="v.birthDate.$model"
              :error="v.birthDate.$errors"
              :label="'Birth date'"
              :placeholder="'Birth date'"
              class="form-field__input"
              isClearable
              isDatepicker
            ></BaseField>
          </div>
        </form>
        <div class="d-flex flex-end relative">
          <transition mode="in-out" name="fade">
            <BaseButton v-if="!v.$invalid" :form="'signup'" :type="'submit'" class="onboarding__button onboarding__button-absolute"
                        isIcon name="Next">
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
import {ref, computed} from "vue";
import {useStore} from "vuex";
import {useRouter} from "vue-router";
import useVuelidate from "@vuelidate/core";
import {helpers, minLength, required} from "@vuelidate/validators";

const store = useStore();
const router = useRouter();

const dispatchSendSmsCode = (payload) => store.dispatch("sendSmsCode", payload);

const userPhone = ref("+1");
const lastName = ref("");
const firstName = ref("");
const birthDate = ref("");

const rules = computed(() => ({
  userPhone: {
    required: helpers.withMessage("Field cannot be empty", required),
    minLength: helpers.withMessage(
      `Minimum length: 12 characters - +7...`,
      minLength(12)
    ),
  },
  firstName: {
    required: helpers.withMessage("Field cannot be empty", required),
  },
  lastName: {
    required: helpers.withMessage("Field cannot be empty", required),
  },
  birthDate: {
    required: helpers.withMessage("Field cannot be empty", required),
  },
}));
const v = useVuelidate(rules, {
  userPhone,
  firstName,
  lastName,
  birthDate
});
const sendSmsCode = async () => {
  const payload = {
    phone: userPhone.value,
  };
  await dispatchSendSmsCode(payload);
  saveUserData();
  goToVerificationCode();
};
const saveUserData = () => {
  const formattedDOB = formatDateToISO(birthDate.value);
  store.commit("saveUserData", {
    userPhone: userPhone.value,
    firstName: firstName.value,
    lastName: lastName.value,
    birthDate: formattedDOB
  });
};
const formatDateToISO = (dateString) => {
  const date = new Date(dateString);
  return date.toISOString();
};
const goToVerificationCode = () => {
  router.push('/onboarding/verification-code');
}
</script>
