<template>
  <component :is="layout">
    <router-view />
  </component>
</template>

<script setup>
import {computed, onMounted} from "vue";
import { useRoute } from "vue-router";
import {useStore} from "vuex";
import guestLayout from "./layouts/guest.vue";
import defaultLayout from "./layouts/default.vue";

const route = useRoute();
const store = useStore();
const layout = computed(() => {
  const layout = route.meta.layout;
  return layout === "default" ? defaultLayout : guestLayout;
});

onMounted(() => {
  store.dispatch('startGlobalTimer');
  store.dispatch('fetchReactionsPrices')
});
</script>
