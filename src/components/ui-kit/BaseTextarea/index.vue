<template>
  <div :class="fieldClass" class="base-textarea">
    <label v-if="label" class="base-textarea__label">
      <span v-if="isRequired" class="base-textarea_required">*</span>
      {{ label }}
    </label>
    <div class="base-textarea__control">
      <textarea
        :value="value"
        class="base-textarea__input"
        :placeholder="placeholder"
        :readonly="isReadonly"
        :name="name"
        :type="type"
        :maxlength="maxlength"
        @input="updateValue"
      />
    </div>
    <TransitionGroup>
      <div class="base-textarea__error" v-for="item of error" :key="item.$uid">
        <span class="base-textarea__error-message">{{ item.$message }}</span>
      </div>
    </TransitionGroup>
  </div>
</template>

<script setup>
import {computed} from "vue";

const emit = defineEmits(["update:value"]);
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
  maxlength: {
    type: Number,
    default: 160,
  },
  error: {
    type: Array,
    required: false,
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
  }
});

const fieldClass = computed(() => {
  return [
    {
      "base-textarea_is-readonly": props.isReadonly,
      "base-textarea_is-center": props.isTextCenter,
      "base-textarea_is-border": props.isBorder,
      "base-textarea_is-gray": props.isGray,
      "base-textarea_is-bottom-border-focus": props.isBottomBorderOnFocus,
    },
  ];
});

const updateValue = (e) => {
  emit("update:value", e.target.value);
};
</script>

<style lang="scss" scoped>
.base-textarea {
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
    width: 100%;
    height: 164px;
    padding: 12px 14px;
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
    resize: none;
    &::placeholder {
      color: #52525B;
      font-size: 16px;
    }
  }
  &__error {
    margin-top: 2px;
    border-radius: 10px;
    font-size: 12px;
    color: #F87171;
    padding: 2px 10px;
  }
  &_is-readonly {
    .base-textarea__control {
      background: rgba(255, 255, 255, 0.05);
    }
  }
  &_is-border {
    .base-textarea__control{
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
    .base-textarea__label {
      font-size: 12px;
      line-height: 16px;
      min-height: auto;
    }
    .base-textarea__control {
      background: #18181B;
      border: none;
      border-bottom: 1px solid transparent;
      transition: border-bottom 0.3s ease;
    }
    .base-textarea__control:focus-within {
      border: none;
      border-bottom: 1px solid #E4E4E7;
    }
    .base-textarea__input {
      font-size: 14px;
      line-height: 20px;
      color: #E4E4E7;
    }
    .base-textarea__input::placeholder {
      font-size: 14px;
      line-height: 20px;
      color: #52525B;
    }
    .base-textarea__error {
      color: #F87171;
      padding: 0;
    }
    .base-textarea__control:has(+ .base-textarea__error) {
      border: none;
      border-bottom: 1px solid #DC2626;
    }
  }
  &_is-gray {
    .base-textarea__control {
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
    }
  }
}
</style>
