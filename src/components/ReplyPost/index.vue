<template>
  <div v-if="userdata">
    <div class="d-flex items-center">
      <div class="avatar" style="margin-right: 10px;">
        <BaseAvatar
            :href="`/profile/${userData.id}`"
            :storage-id="replyPostData.authorUser?.avatarFile?.storageId"
        />

        <div class="post__badge post__badge--gradient">{{ abbreviateNumber(replyPostData.authorUser.rating) }}</div>
      </div>
      <div class="flex justify-start items-start h-[40px]">
        <span v-if="replyPostData.authorUser.firstName || replyPostData.authorUser.lastName" class="post__username mr-2">{{replyPostData.authorUser?.firstName}} {{replyPostData.authorUser?.lastName }}</span>
        <span v-if="replyPostData.authorUser.username" class="post__badge post__badge--grey mt-1">{{ replyPostData.authorUser.username }}</span>
      </div>
    </div>
    <div class="post__content reply-box pb-4 -mt-4">
      <h2 v-if="replyPostData.title" class="pl-12">{{ replyPostData.title }}</h2>
      <span v-if="!replyPostData.text" class="text-[#fff] pl-12">#Reposted {{ replyPostData.repostedPost?.authorUser.username }}</span>
      <span v-if="replyPostData.text && replyPostData.repostedPost?.id" class="text-[#fff] pl-12">#Commented {{ replyPostData.repostedPost?.authorUser.username }}</span>
      <a :href="`/post/${replyPostData.id}`" class="text-[#E4E4E7] pl-12 block">
        <p id="text" class="text-[#E4E4E7]" v-html="replyPostData?.text || replyPostData.repostedPost?.text"></p>
        <p v-if="replyPostData.urls[0] && replyPostData.urls[0].title" class="text-[#E4E4E7]">{{ replyPostData.urls[0].title }}</p>
        <p v-if="replyPostData.urls[0] && replyPostData.urls[0].description" class="text-[#E4E4E7]">{{ replyPostData.urls[0].description }}</p>
        <img v-if="replyPostData.urls[0] && replyPostData.urls[0].imageUrl" :src="replyPostData.urls[0].imageUrl" alt="image">
      </a>
      <div class="rounded-[8px] overflow-hidden pl-12">
        <img v-if="replyPostData.attachedFile?.storageId" :src="BaseURL+replyPostData.attachedFile?.storageId" alt="image of the post" class="post__image !min-w-[200px] md:!min-w-[400px] rounded-[8px] mt-3" />
        <img v-if="replyPostData.repostedPost?.attachedFile?.storageId" :src="BaseURL+replyPostData.repostedPost?.attachedFile?.storageId" alt="image of the post" class="post__image !min-w-[200px] md:!min-w-[400px] rounded-[8px] mt-3" />
      </div>
    </div>
    <div class="d-flex items-center mt-[10px] relative z-10 -mb-6">
      <div class="avatar" style="margin-right: 10px;">
          <BaseAvatar
              :href="`/profile/${userData.id}`"
              :storage-id="userdata?.avatarFile?.storageId"
          />
      </div>
      <div class="flex justify-start items-start h-[40px]">
        <span v-if="userdata.firstName || userdata.lastName" class="post__username mr-2">{{userdata?.firstName}} {{userdata?.lastName }}</span>
        <span v-if="userdata.username" class="post__badge post__badge--grey mt-1">{{ userdata.username }}</span>
      </div>
    </div>
    <div class="userpost__text pl-[48px] flex flex-col">
      <editor-content :editor="editor" class="editor" />
    </div>
    <div class="absolute right-[20px] bottom-4 flex items-center w-full justify-between pl-10">
      <div class="flex items-center">
        <span v-if="changeReply">Anyone can weigh in</span>
        <span v-else>No one can weigh in</span>
        <BaseToggle v-model="changeReply" className="ml-2"/>
      </div>
      <BaseButton class="!max-w-[106px] h-[44px]" @click="post(replyPostData)" :disabled="!userData || !text || isLoading || text === '<p></p>'">Post</BaseButton>
    </div>
    <div>
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import { useStore } from "vuex";
import { useEditor, EditorContent } from '@tiptap/vue-3'
import { useRouter, useRoute } from "vue-router";
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import { useToast } from 'primevue/usetoast';
import { abbreviateNumber } from '../../utils/utils.js';
import { BaseURL } from "@/global/baseUrls.js"

const toast = useToast();
const store = useStore();
const router = useRouter();
const setPost = (payload) => store.dispatch("setPost", payload);
const getUserPosts = () => store.dispatch("setUserPosts");
const isShowModal = (value) => store.dispatch("showModalReply", value);
const getReplies = (id) => store.dispatch("setRepliesPosts", id);
const replyPostData = computed(() => store.getters.getReplyPostData);
const props = defineProps({
  userData: {
    type: Object,
    default: "",
  },
});

const area = ref(null);
const areatext = ref('');
const result = ref(null);
const userdata = ref(null);
const text = ref("")
const previewImage = ref('');
const isLoading = ref(false);
const idImage = ref('');
const link = ref(null);
const changeReply = ref(true);
const linksTitle = ref('');
const linksDeskription = ref('');
const linksUrlImg = ref('');
const title = ref('');
const loadinglinks = ref(false);
const isLoadingMetaData = ref(true);
const isShowMenuTooltip = ref(false);

const editor = useEditor({
  content: '',
  extensions: [
    StarterKit,
    Image,
    Strike,
    Underline,
    Link.configure({
      openOnClick: false,
      defaultProtocol: 'https',
    }),
    Placeholder.configure({
      // Use a placeholder:
      placeholder: `Reply to ${replyPostData.value.authorUser.username ? replyPostData.value.authorUser.username : replyPostData.value.authorUser.firstName + replyPostData.value.authorUser.lastName}...`,
      // Use different placeholders depending on the node type:
      // placeholder: ({ node }) => {
      //   if (node.type.name === 'heading') {
      //     return 'What’s the title?'
      //   }

      //   return 'Can you add some further context?'
      // },
    }),
    TextAlign.configure({
      types: ['heading', 'paragraph'],
    }),
  ],
  onUpdate({ editor }) {
    text.value = editor.getHTML();
    var reg = /href=([\"\'])([^\"\']+)\1/g;
  link.value = reg.exec(text.value);
  if(!link?.value?.[2]) isLoadingMetaData.value = true;
  if(link?.value?.[2] && isLoadingMetaData.value) {
    isLoadingMetaData.value = false;
    loadinglinks.value = true;
    const url = link.value[2];
    try {
      const response = fetch(`/api/url-preview`, {
        method: 'POST',
        body: JSON.stringify({
          url,
        }),
        headers: {
          'Content-Type': 'application/json',
        },
      }).then((response) => response.json())
        .then((data) => {
          if (data) {
            linksTitle.value = data.title;
            linksDeskription.value = data.description;
            linksUrlImg.value = data.imageUrl;
            loadinglinks.value = false;
          } else {

          }
        });
    } catch (error) {
      console.error('Error in save image:', error.message);
    }
  }
  },
})

onMounted(async() => {
  userdata.value = await JSON.parse(localStorage.getItem("user"));
  console.log('reply', replyPostData);
})

const addImage = () => {
  const url = window.prompt('URL')
  if (url) {
    this.editor.chain().focus().setImage({ src: url }).run()
  }
}

const  setLink = () => {
      const previousUrl = editor.value.getAttributes('link').href
      const url = window.prompt('URL', previousUrl)

      // cancelled
      if (url === null) {
        return
      }

      // empty
      if (url === '') {
        editor.value
          .chain()
          .focus()
          .extendMarkRange('link')
          .unsetLink()
          .run()

        return
      }

      // update link
      editor.value
        .chain()
        .focus()
        .extendMarkRange('link')
        .setLink({ href: url })
        .run()
    }

const closeLinkPreview = () => {
  link.value[0] = null;
  linksTitle.value = null;
  linksDeskription.value = null;
  linksUrlImg.value = null;
  areatext.value = '';
}

const showMenuTooltip = () => {
  isShowMenuTooltip.value = true;
}

const removeImagePreview = () => {
  linksUrlImg.value = null;
}

const closeMenuTooltip = () => {
  console.log('ffff')
  isShowMenuTooltip.value = false;
}

const post = async (data) => {
  const response = await fetch (
        `/api/posts`,
        {
          method: 'POST',
          body: JSON.stringify({
            text: text.value,
            repostedPostId: data.id,
            isAnyoneCanReply: changeReply.value,
          }),
          headers: {
            'Content-Type': 'application/json',
          },
        }
      );

      if (response.status === 409) {
        toast.add({
          severity: 'error',
          summary: 'You are not allowed to reply to this post/reply',
          life: 7000,
        });
        isShowModal(false);
        document.body.style.overflow = "auto";
        return;
      }

      const res = await response.json();

      if (res.error) {
        console.log('error', res.message);
      } else {
        if (!res.statusCode) {
          toast.add({
            severity: "success",
            summary: "Reply created",
            life: 7000,
          });
          setTimeout((handler) => {
            getReplies(props.postId);
            if(router.currentRoute.value.name === 'post' || router.currentRoute.value.name === 'profile') {
              document.location.href = `/post/${data.id}`;
            } else {
              router.push(`post/${data.id}`);
            }
          }, 500)
          isShowModal(false);
          document.body.style.overflow = "auto";
        } else {

        }
      }
}

const validatePost = computed(() => {
  if(text.value || idImage.value) return false;
  return true;
})

const uploadImage = (e) => {
    const image = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(image);
    reader.onload = e =>{
        isLoading.value = true;
        previewImage.value = e.target.result;
         let formData = new FormData();
        formData.append('file', image,);
            try {
              fetch(
                `/api/files`,
                {
                  method: 'POST',
                  body: formData
                }
              )
                .then((response) => response.json())
                .then((data) => {
                  if(data.error) {
                    console.log('error', data.message)
                  } else {
                    if(!data.satusCode && data.id) {
                      idImage.value = data.id
                      isLoading.value = false;
                    } else {
                      
                    }
                  }
                });
            } catch (error) {
                console.log('error', error)
            }
        console.log(previewImage.value);
    };
}
</script>

<style lang="scss" scoped>
body {
  color: #F2F2F2;
}
.uploading-image {
  width: 100%;
  height: auto;
  margin-bottom: 10px;
  border-radius: 8px;
  max-height: 520px;
  object-fit: cover;
  object-position: center;
}

.editor .tiptap {
  margin-top: 0;
  padding-left: 0;
  border: none;
  background: transparent;
}

.editor .ProseMirror-focused {
  border: transparent;
  outline: none;
}

.editor .ProseMirror-trailingBreak {
  color: #F2F2F2;
}

.editor .tiptap p.is-editor-empty:first-child::before {
  color: #52525B;
  font-size: 16px;
  content: attr(data-placeholder);
  float: left;
  height: 0;
  pointer-events: none;
}

.editor .tiptap p {
  color: #E4E4E7;
  font-size: 16px;
}

.tiptap-menu {
  padding: 15px;
  background: #18181B;
  button {
    border: 2px solid rgb(216, 180, 254);
    padding: 3px;
    border-radius: 6px;
    margin: 2px 4px;
    padding: 0 5px;
    color: #FFF;
    font-weight: 400 !important;
    font-size: 12px;
    &.is-active {
      background: green;
    }
  }
  .btn-upload-img {
    max-width: fit-content;
    display: inline-block;
    border: 2px solid rgb(216, 180, 254);
    padding: 3px;
    border-radius: 6px;
    margin: 2px 4px;
    padding: 0 5px;
    color: #FFF;
    font-weight: 400 !important;
    font-size: 12px;
    &.is-active {
      background: green;
    }
  }
}
.tiptap {
  border: 2px solid rgb(216, 180, 254);
  border-radius: 10px;
  padding: 15px;
  margin-top: 10px;
  color: #0D0D0D;
  background: #F2F2F2;
  > * + * {
    margin-top: 0.75em;
  }

  hr {
    background: rgb(216, 180, 254);
    margin: 0;
  }

  blockquote {
    border-left: 1px rgb(216, 180, 254);
  }

  a {
    color: #A78BFA;
    font-family: $protext;
    font-size: 14px;
    font-weight: 400;
    line-height: 20.02px;
  }

  ul,
  ol {
    padding: 0 1rem;
  }
  h1 {
    font-size: 32px;
  }
  h2 {
    font-size: 28px;
  }
  h3 {
    font-size: 24px;
  }
  h4 {
    font-size: 18px;
  }
  h5 {
    font-size: 16px;
  }
  h6 {
    font-size: 14px;
  }

  ul {
    color: #E4E4E7;
  }

  ol {
    list-style: auto;
    color: #E4E4E7;
  }

  code {
    background: green;
    border-radius: 10px;
    padding: 2px 10px;
    color: #fff;
    font-size: 14px;
    margin: 0 5px;
  }

  pre {
    background: #0D0D0D;
    color: #FFF;
    padding: 0.75rem 1rem;
    border-radius: 0.5rem;

    code {
      color: inherit;
      padding: 0;
      background: none;
      font-size: 0.8rem;
    }
  }

  img {
    max-width: 100%;
    height: auto;
  }

  blockquote {
    padding-left: 1rem;
    border-left: 2px solid rgba(#0D0D0D, 0.1);
  }

  hr {
    border: none;
    border-top: 2px solid rgba(#0D0D0D, 0.1);
    margin: 2rem 0;
  }
}

.post__image {
  position: relative;
  &::before {
    content: '';
    width: 4px;
    height: 100%;
    position: absolute;
    background: #52525B;
    left: -10px;
    top: 0;
  }
}

.post__badge {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2px 4px;
  height: 16px;
  border-radius: 50px;
  font-size: 11px;
  line-height: 14px;
  font-weight: 500;
}

.post__badge--gradient {
  background: radial-gradient(462.43% 272.02% at 23.33% 11.85%, #E2B6A0 0%, #AEB8E0 100%) /* warning: gradient uses a rotation that is not supported by CSS and may not behave as expected */;
  color: #09090B;
  max-width: fit-content;
  padding: 2px 8px;
  min-width: 35px;
  margin-left: 2px;
  margin-top: 5px;
}

.post__badge--grey{
  padding: 5px;
  background-color: #27272A;
  color: var(--color-light-grey);
}
.post__username {
  font-size: 14px;
  line-height: 20px;
  font-weight: 700;
  color: #E4E4E7;
}
.userpost__text {
  & input {
    position: relative;
    width: 100%;
    border: none;
    background: transparent;
    color: #E4E4E7;
    font-size: 18px;
    margin-bottom: 20px;
    &::placeholder {
      color: #52525B;
      font-size: 18px;
    }
  }
  & textarea {
    position: relative;
    width: 100%;
    border: none;
    background: transparent;
    color: #E4E4E7;
    font-size: 14px;
    min-height: 50px;
    &::placeholder {
      color: #52525B;
      font-size: 14px;
    }
  }
}

.menu--tooltip {
	display: none;
	background: #18181B;
	position: absolute;
  z-index: 100;
	top: -115%;
	left: -50%;
	box-shadow: none;
  height: fit-content;
  width: fit-content;
  &.active {
  display: flex;
  flex-direction: column;
  animation: slide 250ms ease-in-out;
    @keyframes slide {
      0% {
        opacity: 0;
        transform: scale(0.1) rotate(45deg);
        top: 0;
      }
      100% {
        opacity: 1;
        transform: scale(1);
      }
    }
  }
}

.editor-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  background: #27272A;
  width: 91.5px;
  height: 36px;
  cursor: pointer;
  &__left {
    border-top-left-radius: 8px;
    border-bottom-left-radius: 8px;
  }
  &__right {
    border-top-right-radius: 8px;
    border-bottom-right-radius: 8px;
  }
}
.close-preview-img {
  width: 35px;
  height: 35px;
  display: flex;
  justify-content: center;
  align-items: center;
  border-radius: 100%;
  background: #0D0D0D;

}

.base-modal__body {
  scrollbar-width: thin;          /* "auto" or "thin" */
  scrollbar-color: #272727 #121212;   /* scroll thumb and track */
}

.base-modal__body::-webkit-scrollbar {
  width: 5px;               /* width of the entire scrollbar */
}

.base-modal__body::-webkit-scrollbar-track {
  background: #121212;        /* color of the tracking area */
}

.base-modal__body::-webkit-scrollbar-thumb {
  background-color: #272727;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 2px solid #121212;  /* creates padding around scroll thumb */
}

.reply-box {
  position: relative;
  min-height: 120px;
  width: 100%;
  &::before {
    content: '';
    position: absolute;
    left: 18px;
    top: 45px;
    width: 4px;
    height: 95.73%;
    background: #52525B;
    z-index: 0;
  }
}

#text p {
  font-size: 11px;
  line-height: 20px;
  margin: 0 0 12px;
  max-width: 480px;
  word-wrap: break-word;
  color: #E4E4E7;
  text-decoration: none;
}
</style>