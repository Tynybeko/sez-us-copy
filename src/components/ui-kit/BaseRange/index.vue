<template>
  <div class="base-range">
    <input
      :value="modelValue"
      class="base-range__input"
      :type="'range'"
      :max="max"
      :min="min"
      @input="$emit('update:modelValue', $event.target.value)"
      :style="{
        background: `linear-gradient(to right, #1390e5cc ${isRangeValue}%, #d5d5d5 ${isRangeValue}%), #FFFFFF`,
      }"
    />
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";
const props = defineProps({
  modelValue: {
    type: String,
    default: "",
  },
  max: {
    type: Number,
    default: 50,
  },
  min: {
    type: Number,
    default: 1,
  },
});
const isRangeValue = computed(() => {
  return (props.modelValue / props.max) * 100;
});
</script>

<style lang="scss" scoped>
.base-range {
  width: 100%;
  &__input {
    position: relative;
    appearance: none;
    -webkit-appearance: none;
    -moz-appearance: none;
    display: block;
    color: #1390e5cc;
    background: rgba(23, 23, 25, 0.3);
    border-radius: 3px;
    outline: none;
    width: 100%;
    height: 6px;

    &::-webkit-slider-runnable-track {
      -webkit-appearance: none;
      height: 8px;
    }

    &::-moz-track {
      -moz-appearance: none;
      height: 8px;
    }

    &::-ms-track {
      appearance: none;
      height: 8px;
    }

    &::-webkit-slider-thumb {
      -webkit-appearance: none;
      height: 20px;
      width: 20px;
      border: 2px solid #1390e5;
      border-radius: 50%;
      cursor: grab;
      margin-top: -6px;
      background: white;
    }

    &::-moz-range-thumb {
      -moz-appearance: none;
      height: 20px;
      width: 20px;
      border: 2px solid #1390e5;
      border-radius: 50%;
      cursor: grab;
      margin-top: -6px;
      background: white;
    }
    &::-ms-thumb {
      appearance: none;
      height: 20px;
      width: 20px;
      border: 2px solid #1390e5;
      border-radius: 50%;
      cursor: grab;
      margin-top: -6px;
      background: white;
    }

    &:active::-webkit-slider-thumb {
      background-color: white;
      border: 2px solid #1390e5;
      cursor: grabbing;
    }
  }
}
</style>
