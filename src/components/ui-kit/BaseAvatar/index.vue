<script setup>
import {computed} from "vue";
import clsx from "clsx";
import {RouterLink, useRouter} from 'vue-router'
import { BaseURL } from "@/global/baseUrls.js"

const props = defineProps({
  src: {
    type: String,
    default: "",
  },
  href: {
    type: String,
    default: ''
  },
  storageId: {
    type: String,
    default: ""
  },
  size: {
    type: String,
    default: "",
  },
  classes: {
    type: String,
    default: "",
  },
  verified: {
    type: Boolean,
    default: false,
  }
})

const getSrc = computed(() => {
  if (props.src) {
    return props.src
  }
  if (props.storageId) {
    return BaseURL+props.storageId
  }
  return '/images/DefaultAvatar.svg'
})

</script>

<template>
  <component
      @click.stop
      :is="props.href ? 'RouterLink' : 'div'"
      :to="props.href || undefined" class="avatar" :class="clsx(size, classes)">
    <img
        class="avatar-img"
        :src="getSrc"
        alt="user's avatar"/>
    <span v-if="verified" class="ml-2">
      <img
          class="absolute -bottom-[5px] -right-[3px] w-[16px] h-[16px]"
          src="/src/assets/images/verified-icon.svg"/>
    </span>
  </component>
</template>

<style scoped lang="scss">
.avatar {
  display: block;
  width: 40px;
  height: 40px;
  border: 1px solid #71767b;
  position: relative;
  border-radius: 100%;

  &-img {
    width: 100%;
    height: 100%;
    border-radius: 50%;
    object-fit: cover;
  }

  &.lg {
    width: 66px;
    height: 66px;
  }
}
</style>