<template>
  <div class="ui-kit">
    <BaseModal
      v-model:isShow="showModal"
      isCloseActive
      isLogo
      isShadow
      :title="'Вход'"
      ><template v-slot:body>
        <BaseField
          class="ui-kit__base-field"
          :placeholder="'BaseField'"
          :label="'Label'"
        ></BaseField>
        <BaseField
          class="ui-kit__base-field"
          :placeholder="'BaseField'"
          :label="'Label'"
        ></BaseField></template
      ><template v-slot:footer
        ><BaseButton>Кнопка</BaseButton></template
      ></BaseModal
    >
    <div class="ui-kit__inner">
      <div class="ui-kit__box">
        <BaseButton class="ui-kit__btn">Войти</BaseButton>
      </div>
      <div class="ui-kit__box">
        <BaseButton class="ui-kit__btn" disabled>Войти</BaseButton>
      </div>
      <div class="ui-kit__box">
        <BaseButton class="ui-kit__btn" :mode="'bordered'">Войти</BaseButton>
      </div>
      <div class="ui-kit__box">
        <BaseButton class="ui-kit__btn" :mode="'text'">Войти</BaseButton>
      </div>
      <div class="ui-kit__box">
        <BaseField :placeholder="'default'"></BaseField>
      </div>
      <div class="ui-kit__box">
        <BaseField
          v-model:value="v.emailField.$model"
          :label="'isLabel'"
          :type="'email'"
          :placeholder="'emeil'"
          :error="v.emailField.$errors"
        ></BaseField>
      </div>
      <div class="ui-kit__box">
        <BaseField
          v-model:value="v.passwordValue.$model"
          isPassword
          :label="'isPassword'"
          :type="passwordType"
          :placeholder="'password'"
          :error="v.passwordValue.$errors"
          @showPassword="togglePasswordType()"
        ></BaseField>
      </div>
      <div class="ui-kit__box">
        <BaseField
          v-model:value="v.searchValue.$model"
          :placeholder="'поиск'"
          :error="v.searchValue.$errors"
        ></BaseField>
      </div>
      <div class="ui-kit__box">
        <BaseDropdown
          v-model="selected"
          icon-class="icon-arrow"
          :options="options"
          :label="'Сортировать по'"
          @select="isSelected()"
        />
      </div>
      <div class="ui-kit__box">
        <BaseRange v-model="rangeValue" :max="50" :min="1" />
      </div>
      <div class="ui-kit__box">
        <BaseButton class="ui-kit__btn" @click="openModal()"
          >BaseModal</BaseButton
        >
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import useVuelidate from "@vuelidate/core";
import { helpers, minLength, numeric, email } from "@vuelidate/validators";

const passwordValue = ref("");
const passwordType = ref("password");
const searchValue = ref("");
const rangeValue = ref("20");
const emailField = ref("");
const selected = ref(-1);
const showModal = ref(false);
const options = ref([
  { label: "one", value: "1" },
  { label: "two", value: "2" },
]);

const togglePasswordType = () => {
  passwordType.value === "password"
    ? (passwordType.value = "text")
    : (passwordType.value = "password");
};

const rules = computed(() => ({
  searchValue: {
    minLength: helpers.withMessage(
      `Минимальная длина: 3 символа`,
      minLength(3)
    ),
  },
  passwordValue: {
    minLength: helpers.withMessage(
      `Минимальная длина: 6 символов`,
      minLength(6)
    ),
  },
  emailField: {
    email: helpers.withMessage("Вы ввели неверный email", email),
  },
}));

const v = useVuelidate(rules, {
  searchValue,
  passwordValue,
  emailField,
});

const isSelected = (i) => {
  selected.value = i;
};
const openModal = () => {
  showModal.value = true;
  document.body.style.overflow = "hidden";
};
</script>

<style lang="scss" scoped>
.ui-kit {
  &__inner {
    @include container;
    display: grid;
    grid-template-columns: max-content;
    justify-content: center;
    justify-items: center;
    padding-top: 30px;
  }
  &__box {
    display: flex;
    justify-content: center;
    width: 100%;
    margin: 10px auto;
  }
  &__btn {
    margin-bottom: 10px;
  }
  &__base-field {
    width: 334px;
    margin-bottom: 10px;
  }
}
</style>
