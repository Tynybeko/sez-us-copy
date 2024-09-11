<template>
  <div>
    <div class="d-flex items-center">
      <hr>
    </div>
  </div>
</template>

<script setup>
import {ref} from "vue";
import { useStore } from "vuex";
import { useToast } from 'primevue/usetoast';

const toast = useToast();
const store = useStore();
const setPost = (payload) => store.dispatch("setPost", payload);
const getUserPosts = () => store.dispatch("setUserPosts");
const getReplies = (id) => store.dispatch("setRepliesPosts", id);
const props = defineProps({
  postId: {
    type: String,
    default: "",
  },
});

const text = ref("")
const previewImage = ref('');

const post = async () => {
  let payload = {
    text: text.value,
    repostedPostId: props.postId,
    toast
  }
  await setPost(payload);
  setTimeout((handler) => {
    getReplies(props.postId);
  }, 500)
}

const uploadImage = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e =>{
        previewImage.value = e.target.result;
        console.log(previewImage.value);
    };
}
</script>