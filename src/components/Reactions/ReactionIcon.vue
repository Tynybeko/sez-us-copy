<template>
  <div class="reaction-icon" :class="{'inCircle': inCircle}">
    <img :src="icons[type]" class="reaction-icon-img" alt="">
  </div>
</template>

<script setup>
const props = defineProps(['type', 'inCircle'])

const icons = {
  'like': "/icon/reactions/like.png",
  'BadFaith': "/icon/reactions/BadFaith.png",
  'boom': "/icon/reactions/boom.png",
  'dislike': "/icon/reactions/dislike.png",
  'Important': "/icon/reactions/Important.png",
  'Insightful': "/icon/reactions/Insightful.png",
  'Kind': "/icon/reactions/Kind.png",
  'hmm': "/icon/reactions/hmm.png",
  'Misleading': "/icon/reactions/Misleading.png",
  'Troll': "/icon/reactions/Troll.png",
}
</script>

<style scoped lang="scss">
.reaction-icon {
  width: 27px;
  height: 26px;
  &-img{
    width: 27px;
    object-fit: contain;
    height: 26px;
  }
  &.inCircle{
    background: #09090B;
    display: flex;
    border: 1px solid #18181B;
    border-radius: 50%;
    align-items: center;
    justify-content: center;
    .reaction-icon-img{
      width: 15px;
      height: 15px;
    }
  }
}
</style>