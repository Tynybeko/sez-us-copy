<template>
  <div class="rangeSelect" :class="clsx(
    {
      'isRed': isRed,'isGreen': !isRed, 'hasSelected': model && !isHovered
    },
    `color-${model}`
  )"
       @mouseenter="isHovered = true"
       @mouseleave="isHovered = false"
  >
    <div class="rangeSelect-wrp" :style="{gridTemplateColumns: `repeat(${3}, 1fr)`}"
    >
      <div
          v-for="el in optionsLength"
          :key="el"
          class="rangeSelect-el"
          :class="clsx({
          'selected': model >= el && !isHovered
          }, `color-${el}`)"
          @click="handleSetValue(el)"
      >
        <div class="rangeSelect-el-line" :class="`color-${el}`">
        </div>
        <div class="rangeSelect-el-txt"
             :class="clsx({
                'selected': model >= el
             }, `color-${el}`)"
        >
          {{ el }}
        </div>
      </div>
    </div>

    <span v-if="model" class="rangeSelect-el-circle" :class="`color-${model}`" :style="
      {
        left: positionBullet,
      }"
    ></span>
  </div>
</template>

<script setup>
import {computed, ref} from 'vue';
import clsx from 'clsx';

const model = defineModel()

const positionBullet = computed(() => {
  if (model.value) {
    return positionsBullet[model.value] + '%'
  }
  return '0px'
})

const disabled = ref(false)

function handleSetValue(value) {
  if (model.value === value) {
    model.value = 0
    return
  }
  model.value = value
}

const props = defineProps(['optionsLength', 'isRed']);
const optionsLength = props.optionsLength || 3
const hoveredIndex = ref(null);
const isHovered = ref(false);

const positionsBullet = [0, 30, 60, 88]
</script>

<style scoped lang="scss">
.rangeSelect {
  position: relative;

  &-wrp {
    display: grid;
    width: 100%;
  }

  &.isRed {
    --color: #931919;
    --color_2: #B72020;
    --color_3: #DC2626;
    --borderSelected: #E24A4A;
    --colorHovered_1: #715353;
    --colorHovered_2: #835656;
  }

  &.isGreen {
    --color: #17833F;
    --color_2: #1CA44E;
    --color_3: #22C55E;
    --borderSelected: #035B21;
    --colorHovered_1: #526D5C;
    --colorHovered_2: #547660;
  }

  &.color-1 {
    --colorSelected: var(--color);
    --colorHovered: var(--colorHovered_1);
  }

  &.color-2 {
    --colorSelected: var(--color_2);
    --colorHovered: var(--colorHovered_2);
  }

  &.color-3 {
    --colorSelected: var(--color_3);
    --colorHovered: var(--colorHovered_2);
  }

  &.hasSelected {
    .rangeSelect-el-line {
      background: var(--colorHovered);
      border-color: var(--colorHovered);
      border-left-color: #959595;
    }
  }

  &:hover {
    .rangeSelect-el-circle {
      display: none !important;
    }
  }

  &-el {
    cursor: pointer;
    position: relative;


    &-circle {
      border: 3px solid #fff;
      width: 20px;
      pointer-events: none;
      border-radius: 50%;
      background: var(--color);
      position: absolute;
      top: -2px;
      height: 20px;
      transition: left .3s ease-in-out;
      z-index: 1;
      box-shadow: 0 0 7px var(--color);

      &.color-1 {
        background: var(--color);
        box-shadow: 0 0 7px var(--color);
      }

      &.color-2 {
        background: var(--color_2);
        box-shadow: 0 0 7px var(--color_2);
      }

      &.color-3 {
        background: var(--color_3);
        box-shadow: 0 0 7px var(--color_3);
      }
    }

    &-txt {
      text-align: center;
      margin-top: 4px;
      font-size: 12px;
      color: #A1A1AA;
      transition: .2s;

      &.selected {
        &.color-1 {
          color: var(--color);
        }

        &.color-2 {
          color: var(--color_2);
        }

        &.color-3 {
          color: var(--color_3);
        }
      }
    }

    &:nth-child(1) {
      .rangeSelect-el-line {
        border-radius: 40px 0 0 40px;
        border-left: none;
      }
    }

    &:last-child {
      .rangeSelect-el-line {
        border-radius: 0 40px 40px 0;
      }
    }


    &-line {
      background: #464648;
      border: 2px solid #464648;
      border-left: 1px solid #959595;
      height: 16px;
      position: relative;
      z-index: 0;
      transition: .15s;
    }

    &:hover .rangeSelect-el-line {
      &.color-1 {
        --cl: var(--color);
        --shadow: var(--borderSelected);
      }

      &.color-2 {
        --cl: var(--color_2);
        --shadow: var(--borderSelected);
      }

      &.color-3 {
        --cl: var(--color_3);
        --shadow: var(--borderSelected);
      }

      background: var(--cl);
      border-color: var(--shadow);
      box-shadow: 0 0 7px var(--cl);
    }

    &:hover + .rangeSelect-el .rangeSelect-el-line {
      border-left-color: transparent;
    }

    &.selected {
      .rangeSelect-el-line {
        box-shadow: 0 0 7px var(--colorSelected);
        background: var(--colorSelected);
        border: 2px solid var(--colorSelected);
      }
    }

    &.active {
      .rangeSelect-el-line {
        background: var(--color);
      }
    }
  }


}
</style>
