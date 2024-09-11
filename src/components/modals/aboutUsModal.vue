<template>
  <Transition name="bounce">
    <div
      v-if="isShow"
      class="base-modal"
    > 
      <div class="base-modal__wrapper">
        <div
          class="base-modal__container relative"
          :class="containerClass"
        >
          <div class="bg">
          </div>
          <div class="base-modal__content">
            <div class="base-modal__body">
              <slot name="body" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed } from "vue";
import { useStore } from "vuex";
const store = useStore();
const isShowModal = (value) => store.dispatch("showModal", value);
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
  isShowModal(false);
  document.body.style.overflow = "auto";
};
</script>

<style lang="scss" scoped>
.bg {
  background-image: url("/images/bg_mobile.jpg");
  background-repeat: no-repeat;
  background-size: cover;
  width: 98vw;
  height: 98vh;
  z-index: 0;
  position: absolute;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;

  @media (min-width: 768px) {
    background-image: url("/images/bg_desktop.jpg");
  }
  @media (min-width: 1400px) {
    background-position: center;
  }
}
.base-modal {
  position: fixed;
  z-index: 19998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  &__wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  &__header {
    width: 100%;
    border-color: #fff;
    border-bottom: 1px solid #3b3b3b;
  }
  &__container {
    max-width: 98vw;
    min-height: 98vh;
    overflow: hidden;
    margin: 0 auto;
    border-radius: 20px;
  }
  &__banner {
    border-radius: 16px 0px 0px 16px;
  }
  &__body {
    max-height: 98vh;
    min-height: 500px;
    overflow-y: scroll;
  }
  &__footer {
    display: flex;
    justify-content: center;
  }
  &__close {
    position: absolute;
    top: 222px;
    left: 20px;
    width: 26px;
    height: 26px;
    cursor: pointer;
    transition: opacity ease 0.5s;
    z-index: 11;
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
      }
      &__logo-img {
        min-width: 88px;
        height: 88px;
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
  @include _1024 {
    &__wrapper {
      padding: 0;
      height: 100%;
    }
    &__container {
      max-width: 100%;
      min-height: 100%;
    }
    &__body {
      width: 100%;
      margin-bottom: 20px;
      min-height: 300px;
      height: 100%;
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
.bounce-enter-active {
  animation: bounce-in 0.5s ease-out;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
	0% {
		transform: translateY(-100%);
	}
	30%{
		transform: translateY(5%);
	}
	65%{
		transform: translateY(-2%);
	}
	100%{
		transform: translateY(0%);
	}
}
</style>