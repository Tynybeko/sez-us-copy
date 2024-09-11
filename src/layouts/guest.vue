<template>
  <div class="guest-layout">
    <RouterView />
  </div>
</template>

<style lang="scss">
.guest-layout {
  background: #101010;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  &__content {
    flex-grow: 1;
  }
}
</style>
