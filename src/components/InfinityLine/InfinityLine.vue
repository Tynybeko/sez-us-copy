<template>
  <div v-if="startLoading" class="w-fit mx-auto">
    <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="5" fill="transparent"
                     animationDuration=".8s" aria-label="Custom ProgressSpinner"/>
  </div>
  <div class="scroll-container" v-else-if="total > 0">
    <slot :items="data"></slot>
    <div v-if="isLoading" class="w-fit mx-auto">
      <ProgressSpinner style="width: 40px; height: 40px" strokeWidth="5" fill="transparent"
                       animationDuration=".8s" aria-label="Custom ProgressSpinner"/>
    </div>
  </div>
  <div v-else class="text-center py-2 rounded" :style="{background: '#18181B'}">
    No data yet.
  </div>
</template>

<script setup>
import {onMounted, onBeforeUnmount, ref} from 'vue';
import ProgressSpinner from 'primevue/progressspinner';

const props = defineProps({
  action: Function,
});

const data = ref([]);
const total = ref(0);
const isLoading = ref(false);
const startLoading = ref(false);
const hasNext = ref(true);

const loadMore = async () => {
  if (isLoading.value || !hasNext.value || data.value.length === 0) return;
  isLoading.value = true;

  const lastElement = data.value[data.value.length - 1];

  const res = await props.action(lastElement.id);

  total.value = res.count;
  hasNext.value = res.hasNext;
  data.value.push(...res.results);
  isLoading.value = false;
};

const fetchData = async () => {
  const res = await props.action();
  total.value = res.count;
  hasNext.value = res.hasNext;
  data.value.push(...res.results);
}

const onScroll = () => {
  if ((window.innerHeight + window.scrollY) >= document.body.offsetHeight - 10) {
    loadMore();
  }
};

onMounted(async () => {
  startLoading.value = true
  await fetchData()
  startLoading.value = false
  window.addEventListener('scroll', onScroll);
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', onScroll);
});
</script>

<style lang="scss">
.scroll-container {
  padding: 20px;
}
</style>
