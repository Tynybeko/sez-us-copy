<template>
  <div v-click-outside="closeDropdown" class="base-dropdown">
    <span v-if="label" class="base-dropdown__label">{{ label }}</span>
    <div
      class="base-dropdown__head head"
      :class="classActive"
      @click="toggleDropdown()"
    >
      <div class="head__inner">
        <span
          class="base-dropdown__title"
          :class="{ 'base-dropdown__title_selected': getValue !== -1 }"
        >
          {{ getValue === -1 ? "Без сортировки" : options[getValue].label }}
        </span>
        <span class="base-dropdown__icon" :class="iconClass" />
      </div>
    </div>
    <div v-if="isOptionVisible" class="base-dropdown__items">
      <div class="base-dropdown__wrapper">
        <div
          v-for="(option, i) in options"
          :key="option.label"
          class="base-dropdown__item item"
          @click="selectOption(i)"
        >
          <div class="item__inner">
            <span class="base-dropdown__title">
              {{ option.label }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from "vue";
import { directive as vClickOutside } from "click-outside-vue3";

const emit = defineEmits(["selected"]);
const props = defineProps({
  modelValue: {
    type: Number,
    default: -1,
  },
  options: {
    type: Array,
    default: () => [],
  },
  active: {
    type: String,
    default: "",
  },
  mode: {
    type: String,
    default: "",
  },
  iconClass: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
});

const isOptionVisible = ref(false);

const classActive = computed(() => {
  return [
    {
      "base-dropdown__head_active": isOptionVisible.value === true,
    },
  ];
});

const getValue = computed(() => {
  return props.modelValue;
});

const closeDropdown = () => {
  isOptionVisible.value = false;
};
const selectOption = (i) => {
  emit("selected", i);
  isOptionVisible.value = false;
};
const toggleDropdown = () => {
  isOptionVisible.value = !isOptionVisible.value;
};
</script>

<style lang="scss" scoped>
.base-dropdown {
  position: relative;
  width: 100%;
  color: rgba(39, 39, 39, 0.3);
  font-size: 20px;
  &__label {
    color: #272727;
    font-size: 16px;
  }
  &__title {
    &_selected {
      color: #272727;
    }
  }
  &__head {
    position: relative;
    display: flex;
    align-items: center;
    padding: 10px 15px;
    border: 1px solid rgba(23, 23, 25, 0.1);
    border-radius: 10px;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    &_active {
      background: rgba(197, 228, 249, 0.3);
      border-color: #1390e5;
    }
    &_active .base-dropdown__icon:before {
      color: #d1d1d1;
    }
    &_active .base-dropdown__icon {
      transform: rotate(180deg);
    }
  }
  .head {
    &__inner {
      display: flex;
      align-items: center;
      width: 100%;
    }
  }
  &__wrapper {
    overflow-y: auto;
    max-height: 170px;
  }
  &__items {
    position: absolute;
    top: 82px;
    display: flex;
    width: 100%;
    padding: 0 12px;
    flex-direction: column;
    background: #ffffff;
    color: #272727;
    box-shadow: 0 25px 35px rgba(70, 70, 76, 0.19);
    border-radius: 10px;
    z-index: 100;
  }
  &__item {
    display: flex;
    justify-content: space-between;
    align-items: center;
    border-radius: 7px;
    margin: 5px 0;
    padding: 10px;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    &:hover {
      background: rgba(197, 228, 249, 0.3);
    }
  }
  .item {
    &__inner {
      display: flex;
      align-items: center;
    }
  }
  &__icon {
    position: absolute;
    right: 15px;
    transition: 0.2s ease-in-out;
    &:before {
      font-size: 14px;
      color: #d1d1d1;
      transition: 0.2s ease-in-out;
    }
  }
  @include _480 {
    font-size: 16px;
  }
  @include _380 {
    font-size: 16px;
  }
}
</style>
