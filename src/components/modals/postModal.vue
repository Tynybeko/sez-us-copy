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
          <span
            v-if="isCloseActive"
            class="base-modal__close"
            @click="modalHide"
          />
          <div class="base-modal__content py-4">
            <div class="base-modal__header flex flex-col">
              <span class="base-modal__close text-[#A1A1AA]" @click="modalHide">Cancel</span>
              <h2
                v-if="title"
                class="text-[16px] text-[#E4E4E7] mx-auto"
              >
                {{ title }}
              </h2>
            </div>

            <div class="base-modal__body">
              <slot name="body" />
            </div>

            <div class="base-modal__footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { computed, onMounted } from "vue";
import { useStore } from "vuex";
const store = useStore();
const isShowModal = (value) => store.dispatch("showModal", value);
const setEditData = (data) => store.dispatch("addModalDataToState", data)
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
  setEditData(null);
  document.body.style.overflow = "auto";
};
</script>

<style lang="scss" scoped>
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
    padding-bottom: 15px;
  }
  &__container {
    max-width: 800px;
    min-height: 600px;
    margin: 0 auto;
    background: #09090B;
    border-radius: 20px;
  }
  &__banner {
    border-radius: 16px 0px 0px 16px;
  }
  &__body {
    margin-bottom: 45px;
    padding: 10px 20px;
    max-height: 600px;
    min-height: 500px;
    overflow-y: scroll;
  }
  &__footer {
    display: flex;
    justify-content: center;
  }
  &__close {
    position: absolute;
    top: 18px;
    left: 20px;
    width: 26px;
    height: 26px;
    cursor: pointer;
    transition: opacity ease 0.5s;
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
  @include _1024 {
    &__wrapper {
      padding: 0;
      height: 100%;
    }
    &__container {
      padding: 40px 0;
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
      padding: 30px 0;
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
.base-modal__body {
  scrollbar-width: thin;          /* "auto" or "thin" */
  scrollbar-color: #272727 #121212;   /* scroll thumb and track */
}

.base-modal__body::-webkit-scrollbar {
  width: 8px;               /* width of the entire scrollbar */
}

.base-modal__body::-webkit-scrollbar-track {
  background: #121212;        /* color of the tracking area */
}

.base-modal__body::-webkit-scrollbar-thumb {
  background-color: #272727;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 2px solid #121212;  /* creates padding around scroll thumb */
}
</style>