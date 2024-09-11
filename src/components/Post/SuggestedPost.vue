<template>
  <div class="post !bg-[#18181B]"
       :style="{marginBottom: `${gap}px`}">
    <div class="post__avatar-container" >
        <BaseAvatar
          :storage-id="getData.storageId"
          :verified="getData.verified"
          :href="`/profile/${getData.userId}`"
        />
      <div class="post__badge post__badge--gradient mx-auto">{{
          abbreviateNumber(getData.rating)
        }}
      </div>
    </div>
    <div class="grow">
      <div class="post__body">
        <div class="post__header">
          <a :href="`/profile/${getData.userId}`"
             class="post__username hover:underline text-left">{{ fullName }}</a>
          <div class="post__badge post__badge--grey">Newbie</div>
        </div>
        <div class="post__content flex flex-col justify-between text-left">
          <span v-if="getData.bio" class="text-[#A1A1AA] cutLines text-xs">{{
              getData.bio
            }}</span>
        </div>
      </div>
    </div>
    <div class="">
      <ButtonFollow
          v-if="isAuth"
          :loading="followLoading"
          :isFollow="isFollowing"
          @click="handleFollow(getData.userId)"
      />
    </div>
  </div>
</template>

<script setup>
import {ref, onMounted, computed} from "vue";
import {useStore} from "vuex";
import {abbreviateNumber} from '../../utils/utils.js';
import ButtonFollow from '../../components/ui-kit/ButtonFollow/index.vue'
import {useToast} from 'primevue/usetoast';

const toast = useToast();
const store = useStore();
const userdata = computed(() => store.getters.getUser);

const props = defineProps({
  data: {
    type: Object,
    default: null,
  },
  type: {
    type: String,
    default: 'post'
  },
  isAuth: {
    type: Boolean,
    default: false
  },
  gap: {
    type: String,
    default: "15"
  },
});

const getData = computed(() => {
  let obj = null

  if(props.type === 'post'){
    let post = props.data
    obj = {...post.authorUser};
    obj.storageId = post.authorUser.avatarFile?.storageId
    obj.verified = post.authorUser.verified
    obj.userId = post.authorUser.id

  }else if(props.type === 'user'){
    const user = props.data
    obj = {...user}
    obj.storageId = user?.avatarFile?.storageId
    obj.userId = user.id
  }

  return obj
})

const getMyProfile = async () => {
  await store.dispatch("getMe");
}
const followLoading = ref(false)


const isFollowing = computed(() => {
  if (!Array.isArray(userdata.value?.following)) return null
  return userdata.value.following.includes(getData.value.userId)
})
const fullName = computed(() => {
  let firstName = getData.value.firstName
  let lastName = getData.value.lastName
  let maxWidth = 9

  firstName = firstName.length <= maxWidth ? firstName : firstName.slice(0, maxWidth) + '..'
  lastName = lastName.length <= maxWidth ? lastName : lastName.slice(0, maxWidth) + '..'

  return firstName + ' ' + lastName
})

const handleFollow = async (id) => {
  followLoading.value = true
  if (!isFollowing.value) {
    try {
      const res = await fetch(
          `/api/users/${id}/follow`,
          {
            method: 'POST',
          }
      )
      const data = await res.json()
      if (data.statusCode === 409) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: data.message,
          life: 7000
        });
        return
      }
      if (data.error) {
        console.log('error', data.message)
      } else {
        await getMyProfile()
      }
    } catch (error) {
      console.log('e', error)
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 7000
      });
      console.log('error', error)
    } finally {
      followLoading.value = false
    }
  } else {
    try {
      const res = await fetch(
          `/api/users/${id}/unfollow`,
          {
            method: 'POST',
          }
      )
      const data = await res.json()
      if (data.statusCode === 409) {
        toast.add({
          severity: "error",
          summary: "Error",
          detail: data.message,
          life: 7000
        });
        return
      }
      if (data.error) {
        console.log('error', data.message)
      } else {
        await getMyProfile()
      }
    } catch (error) {
      console.log('error', error)
      commit("setUserDataError", error);
      console.log('e', error)
      toast.add({
        severity: "error",
        summary: "Error",
        detail: error.message,
        life: 7000
      });
      console.log('error', error)
    } finally {
      followLoading.value = false
    }
  }
}
</script>

<style lang="scss" scoped >

</style>