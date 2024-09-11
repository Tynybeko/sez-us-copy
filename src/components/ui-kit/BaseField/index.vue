<template>
  <div :class="fieldClass" class="base-field">
    <label v-if="label" class="base-field__label">
      <span v-if="isRequired" class="base-field_required">*</span>
      {{ label }}
    </label>
    <div class="base-field__control">
      <img v-if="isSearch" class="mr-2 opacity-70" src="/icon/Search.svg" alt="icon">
      <input
        :value="isDatepicker ? calendarValue : value"
        class="base-field__input"
        :placeholder="placeholder"
        :readonly="isReadonly || isDatepicker"
        :name="name"
        :type="type"
        @click="toggleCalendar"
        @input="updateValue"
      />
      <Calendar
        v-if="isDatepicker && showCalendar"
        v-model="calendarValue"
        inline
        :maxDate="maxDate"
        appendTo="body"
        dateFormat="dd/mm/yy"
        @date-select="handleDateSelect"
        v-click-outside="closeCalendar"
      />
      <div class="base-field__slot">
        <button type="button">
          <span
            v-if="isPassword"
            class="ui-kit__icon"
            :class="passwordFieldIcon"
            @click="showPassword"
          ></span>
          <span
              v-if="isSearch && value"
              @click="$emit('update:value', '')"
              class="ui-kit__icon text-white isSearchIcon"
          >
            &times;
          </span>
          <span
            v-if="isClearable && value"
            @click="$emit('update:value', '')"
            class="ui-kit__icon text-white"
          >
            &times;
          </span>
        </button>
        <slot name="button"></slot>
      </div>
    </div>
    <TransitionGroup>
      <div class="base-field__error" v-for="item of error" :key="item.$uid">
        <span class="base-field__error-message">{{ item.$message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import {ref, computed, watch} from "vue";
import Calendar from 'primevue/calendar';
import { directive as vClickOutside } from "click-outside-vue3";

const emit = defineEmits(["update:value", "showPassword"]);
const props = defineProps({
  value: {
    type: String,
    default: "",
  },
  text: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  placeholder: {
    type: String,
    default: "",
  },
  type: {
    type: String,
    default: "text",
  },
  name: {
    type: String,
    default: "",
  },
  error: {
    type: Array,
    required: false,
  },
  isPassword: {
    type: Boolean,
    default: false,
  },
  isReadonly: {
    type: Boolean,
    default: false,
  },
  isTextCenter: {
    type: Boolean,
    default: false,
  },
  isGray: {
    type: Boolean,
    default: false,
  },
  isRequired: {
    type: Boolean,
    default: false,
  },
  isBorder: {
    type: Boolean,
    default: false,
  },
  isBottomBorderOnFocus: {
    type: Boolean,
    default: false,
  },
  isSearch: {
    type: Boolean,
    default: false,
  },
  isClearable: {
    type: Boolean,
    default: false,
  },
  isDatepicker: {
    type: Boolean,
    default: false,
  },
});
const calendarValue = ref(props.value);
const showCalendar = ref(false);
const maxDate = new Date();

watch(() => props.value, (newValue) => {
  if (props.isDatepicker) {
    calendarValue.value = newValue;
  }
});

const fieldClass = computed(() => {
  return [
    {
      "base-field_is-readonly": props.isReadonly,
      "base-field_is-password": props.type === "password",
      "base-field_is-center": props.isTextCenter,
      "base-field_is-border": props.isBorder,
      "base-field_is-gray": props.isGray,
      "base-field_is-search": props.isSearch,
      "base-field_is-bottom-border-focus": props.isBottomBorderOnFocus,
    },
  ];
});

const passwordFieldIcon = computed(() => {
  return props.type === "password" ? "icon-eye-off" : "icon-eye";
});

const updateValue = (e) => {
  emit("update:value", e.target.value);
};
const showPassword = (e) => {
  emit("showPassword", e.target.value);
};
const toggleCalendar = () => {
  if (props.isDatepicker) {
    showCalendar.value = !showCalendar.value;
  }
};
const closeCalendar = () => {
  showCalendar.value = false;
};
const handleDateSelect = () => {
  const formattedDate = calendarValue.value.toLocaleDateString('en-US');
  emit("update:value", formattedDate);
  closeCalendar();
};
</script>

<style lang="scss" scoped>
.isSearchIcon {
  font-size: 26px;
  opacity: .4;
  transition: .3s;
  &:hover {
    opacity: 1;
  }
}

.base-field {
  position: relative;
  font-size: 20px;
  margin-bottom: 10px;
  &__label {
    color: #A1A1AA;
    min-height: 30px;
    margin-bottom: 0;
    font-size: 14px;
  }
  &_required {
    color: #ff0000;
  }
  &__control {
    position: relative;
    display: flex;
    align-items: center;
    width: 100%;
    height: 48px;
    padding: 0 15px;
    line-height: 145%;
    border: 1px solid rgba(23, 23, 25, 0.1);
    border-radius: 10px;
    transition: 0.2s ease-in-out;
    &:focus-within {
      border-color: #A1A1AA;
    }
  }
  &__input {
    position: relative;
    width: 100%;
    border: none;
    background: transparent;
    color: #9696a2;
    font-size: 14px;
    &::placeholder {
      color: #52525B;
      font-size: 16px;
    }
  }
  &__slot {
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 4px 0;
    height: 100%;
    span {
      width: 25px;
      &:before {
        font-size: 26px;
      }
    }
  }
  &__error {
    margin-top: 2px;
    border-radius: 10px;
    font-size: 12px;
    color: #F87171;
    padding: 2px 10px;
  }
  .ui-kit {
    &__icon {
      &::before {
        font-size: 20px;
      }
    }
  }
  &_is-password {
    &:focus-within {
      .ui-kit {
        &__icon {
          &::before {
            color: #A3E635;
          }
        }
      }
    }
  }
  &_is-readonly {
    .base-field__control {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  &_is-border {
    .base-field__control{
      border: 1px solid rgba(255, 255, 255, 0.2);
      &:focus-within {
      border-color: #A1A1AA;
    }
    }
  }
  &_is-bottom-border-focus {
    gap: 8px;
    display: flex;
    flex-direction: column;
    .base-field__label {
      font-size: 12px;
      line-height: 16px;
      min-height: auto;
    }
    .base-field__control {
      background: #18181B;
      border: none;
      border-bottom: 1px solid transparent;
      transition: border-bottom 0.3s ease;
    }
    .base-field__control:focus-within {
      border: none;
      border-bottom: 1px solid #E4E4E7;
    }
    .base-field__input {
      font-size: 14px;
      line-height: 20px;
      color: #E4E4E7;
    }
    .base-field__input::placeholder {
      font-size: 14px;
      line-height: 20px;
      color: #52525B;
    }
    .base-field__error {
      color: #F87171;
      padding: 0;
    }
    .base-field__control:has(+ .base-field__error) {
      border: none;
      border-bottom: 1px solid #DC2626;
    }
  }
  &_is-search {
    .base-field__control {
      background: #18181B;
    }
  }
  &_is-gray {
    .base-field__control {
      background: #18181B;
    }
  }
  &_is-center &__input {
    text-align: center;
  }
  &_is-center {
    min-width: 100px;
  }
  @include _380 {
    font-size: 14px;
    &__control {
      font-size: 14px;
      height: 44px;
    }
  }
}
.p-calendar {
  position: absolute;
  bottom: 50px;
  left: 100px;
  @include _639 {
    left: 0;
  }
}
.icon-eye {
  background: url('/icon/eye.svg') no-repeat center;
  width: 16px;
  height: 16px;
  display: block;
}
.icon-eye-off {
  background: url('/icon/eye-off.svg') no-repeat center;
  width: 16px;
  height: 16px;
  display: block;
}

</style>
