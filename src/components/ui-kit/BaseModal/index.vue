<template>
  <Transition>
    <div class="base-modal" v-if="isShow">
      <div class="base-modal__wrapper">
        <div class="base-modal__container" :class="containerClass">
          <span
            v-if="isCloseActive"
            class="base-modal__close"
            @click="modalHide"
          />
          <div class="base-modal__header header">
            <a
              v-if="isLogo"
              class="header__logo-link"
              href="#"
              target="_blank"
            >
              <img
                class="header__logo-img"
                src="@/assets/images/logo.svg"
                alt="logo"
              />
            </a>
            <h2 class="header__title" v-if="title">{{ title }}</h2>
            <h2 class="header__subtitle" v-if="subTitle">{{ subTitle }}...</h2>
          </div>

          <div class="base-modal__body">
            <slot name="body"></slot>
          </div>

          <div class="base-modal__footer">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from "vue";
const emit = defineEmits(["update:isShow"]);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  subTitle: {
    type: String,
    default: "",
  },
  isLogo: {
    type: Boolean,
    default: false,
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  isCloseActive: {
    type: Boolean,
    default: false,
  },
  isShadow: {
    type: Boolean,
    default: false,
  },
  isSucces: {
    type: Boolean,
    default: false,
  },
});

const containerClass = computed(() => {
  return [
    {
      "base-modal__container_is-shadow": props.isShadow,
      "base-modal__container_is-succes": props.isSucces,
    },
  ];
});

const modalHide = () => {
  emit("update:isShow", false);
  document.body.style.overflow = "auto";
};
</script>

<style lang="scss" scoped>
.base-modal {
  position: fixed;
  z-index: 9998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  &__wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  &__container {
    position: relative;
    display: flex;
    flex-direction: column;
    align-items: center;
    max-width: 510px;
    margin: 0px auto;
    padding: 40px 28px 60px;
    background: #09090B;
    border: 1px solid rgba(39, 39, 39, 0.1);
    border-radius: 10px;
    &_is-shadow {
      box-shadow: 0px 10px 15px -3px #00000040;
    }
    &_is-succes {
      opacity: 0.9;
      width: fit-content;
      padding: 20px 50px;
      box-shadow: 0px 10px 50px rgba(0, 0, 0, 0.2);
      .base-modal__header {
        .header__title {
          color: #29ab87;
        }
      }
    }
  }
  &__body {
    margin-bottom: 30px;
  }
  &__footer {
    display: flex;
    justify-content: center;
  }
  &__close {
    position: absolute;
    top: 12px;
    right: 15px;
    width: 16px;
    height: 16px;
    opacity: 0.2;
    cursor: pointer;
    transition: opacity ease 0.5s;
    &:hover {
      opacity: 1;
    }
    &::before,
    &::after {
      content: "";
      position: absolute;
      top: 10px;
      display: block;
      width: 16px;
      height: 2px;
      background: #000;
    }
    &::before {
      transform: rotate(45deg);
    }
    &::after {
      transform: rotate(-45deg);
    }
  }
  &__header {
    display: flex;
    flex-direction: column;
    align-items: center;
    .header {
      &__logo-link {
        display: inline-block;
        text-decoration: none;
        margin-bottom: 10px;
        max-width: 100px;
      }
      &__logo-img {

      }
      &__title {
        text-align: center;
        font-weight: 500;
        font-size: 18px;
        color: #000000;
        margin-bottom: 10px;
      }
      &__subtitle {
        margin-bottom: -20px;
        color: #7c838d;
        display: inline-block;
        font-size: 12px;
        font-weight: 100;
        clip-path: inset(0 1.4ch 0 0);
        animation: l 2s steps(4) infinite;
      }
      @keyframes l {
        to {
          clip-path: inset(0 -1ch 0 0);
        }
      }
    }
  }
  @include _575 {
    &__wrapper {
      padding: 20px;
    }
    &__container {
      padding: 40px 20px;
      max-width: 100%;
    }
    &__body {
      width: 100%;
      margin-bottom: 20px;
    }
    &__footer {
      width: 100%;
    }
  }
  @include _380 {
    &__container {
      padding: 30px 10px;
    }
  }
}
</style>
