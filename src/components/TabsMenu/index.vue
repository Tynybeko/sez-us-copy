<template>
  <div class="tabs-container">
    <div class="sub-menu" :class="{ 'floating-tabs': isFloatingTabs }">
      <div class="sub-menu__inner">
        <div class="sub-menu__items">
          <div v-for="(item, index) in tabs" ref="tabItems" :key="item.title" class="sub-menu__item"
            @click="selectTab(index)"
            :class="{ 'active': selectedIndex === index, 'pointer-events-none': item.disabled }">
            <nuxt-link :to="item.to">
              {{ item.title }}
            </nuxt-link>
          </div>
          <div class="sub-menu__shape" :style="currentLinkBorderPosition" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, ref, nextTick, watch, onMounted } from 'vue';

const props = defineProps({
  tabs: {
    type: Array,
    required: true,
  },
  initialIndex: {
    type: Number,
    default: 0,
  },
  isFloatingTabs: {
    default: false,
  }
});

const emit = defineEmits(['update:selectedIndex']);
const selectedIndex = ref(props.initialIndex);
const tabItems = ref([]);

const updateShapePosition = () => {
  if (tabItems.value[selectedIndex.value]) {
    const itemRect = tabItems.value[selectedIndex.value].getBoundingClientRect();
    const containerRect = tabItems.value[0].parentElement.getBoundingClientRect();
    currentLinkBorderPosition.value = {
      width: `${itemRect.width}px`,
      left: `${itemRect.left - containerRect.left}px`,
    };
  }
};

watch(selectedIndex, (newValue) => {
  emit('update:selectedIndex', newValue);
  nextTick(updateShapePosition);
});

onMounted(() => {
  nextTick(updateShapePosition);
});

const selectTab = (index) => {
  selectedIndex.value = index;
};

const currentLinkBorderPosition = ref({
  width: '0px',
  left: '0px',
});

// const currentLinkBorderPosition = computed(() => {
//   const widthPercentage = 100 / props.tabs.length;
//   const leftPercentage = selectedIndex.value * widthPercentage;
//   return {
//     width: `${widthPercentage}%`,
//     left: `${leftPercentage}%`,
//   };
// });
</script>

<style lang="scss" scoped>
.sub-menu {
  position: static;
  width: 100%;
  background: #09090B;

  &.floating-tabs {
    position: fixed;
    top: 12px;
    z-index: 110;
  }

  &__inner {
    margin: 0 auto;
    height: 100%;
    display: flex;
    align-items: center;
    overflow: auto;

    &::-webkit-scrollbar {
      width: 0;
      height: 0;
      background-color: transparent;
    }

    scrollbar-color: transparent transparent;
    scrollbar-width: none;
  }

  &__items {
    position: relative;
    display: flex;
    justify-content: space-around;
    width: 100%;

    @include _767 {
      justify-content: flex-start;
      width: auto;
    }
  }

  &__item {
    font-family: 'ClashDislay', serif;
    font-size: 16px;
    font-weight: 500;
    line-height: 16px;
    letter-spacing: 0.02em;
    text-align: left;
    padding: 20px 0 21px;
    color: #A1A1AA;
    cursor: pointer;
    transition: 0.2s ease-in-out;
    min-width: 168px;
    display: flex;
    justify-content: center;
    align-items: center;

    @include _767 {
      min-width: 1px;
      flex-shrink: 0;
      padding: 20px 15px 21px;
    }

    &.active {
      color: #E4E4E7;
      font-weight: 600;
    }

    a {
      display: block;
      color: #FFFFFF;
      text-decoration: none;
      transition: 0.2s ease-in-out;
      word-break: break-all;
    }

    &:hover a {
      color: #E1E4ED;
    }
  }

  &__shape {
    //$tabsCount: 5;
    //$pagePadding: 10px;
    //margin: 0 $pagePadding;
    margin: 0;
    position: absolute;
    height: 2px;
    left: 0;
    bottom: 12px;
    //width: calc((100% / #{$tabsCount}) - #{$pagePadding * 2});
    background: #FFFFFF;
    transition: 0.3s ease-in-out;
  }
}
</style>
