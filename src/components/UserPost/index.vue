<template>
  <div v-if="userdata">
    <div class="d-flex items-center">
      <div class="" style="margin-right: 10px;">
        <BaseAvatar
            :storage-id="userdata?.avatarFile?.storageId"
            :href="`/profile/${userData.id}`"
        />
      </div>
      <div class="flex justify-start items-start h-[40px]">
        <span v-if="userData.firstName || userData.lastName" class="post__username mr-2">{{userData?.firstName}} {{userData?.lastName }}</span>
        <span v-if="userData.username" class="post__badge post__badge--grey mt-1">Newbie</span>
      </div>
    </div>
    <div class="userpost__text pl-[48px] flex flex-col">
      <input v-model="title" type="text" placeholder="Add a headline (optional)...">
      <editor-content :editor="editor" class="editor" />
    </div>
    <div v-if="loadinglinks" class="preview-link pl-[48px] mb-4">loading preview...</div>
    <div v-else class="preview-link pl-[48px] mb-4">
      <h2 v-if="linksTitle && link?.[0]">{{ linksTitle }}</h2>
      <p v-if="linksDeskription && link?.[0]"> {{ linksDeskription }}</p>
      <div class="relative">
        <img v-if="linksUrlImg && link?.[0]" :src="linksUrlImg" alt="og:image">
        <div v-if="linksUrlImg && link?.[0]" class="close-preview-img absolute left-2 top-2">
          <img v-if="linksUrlImg && link?.[0]" src="/icon/editor/close.svg" class="cursor-pointer" alt="" @click="removeImagePreview">
        </div>
      </div>
      <div class="grid gap-4" :class="{'grid-cols-2': testArr[1], 'min-h-[500px]': testArr[1] && !testArr[3] && !testArr[2]}">
        <div class="relative" v-if="!isLoading && testArr[0]">
          <video v-if="testArr[0]?.type === 'video'" :src="testArr[0]?.isEdit ? BaseURL+testArr[0]?.image : testArr[0].image" controls class="post__video my-2"></video>
          <img v-else :src="testArr[0]?.isEdit ? BaseURL+testArr[0]?.image : testArr[0].image" class="uploading-image my-2" />
          <label v-if="!editData" class="text-[#fff] cursor-pointer opacity-50 rounded-[100%] absolute right-4 top-4 bg-[rgba(0,0,0)] w-6 h-6 flex items-center justify-center" @click="removeImg(testArr[0].id)"><img src="/icon/editor/close.svg" class="w-4" alt=""></label>
        </div>
        <div class="relative" v-if="!isLoading && testArr[1] && !testArr[3] && !testArr[2]">
          <video v-if="testArr[1].type === 'video'" :src="testArr[1]?.isEdit ? BaseURL+testArr[1]?.image : testArr[1].image" controls class="post__video my-2"></video>
          <img v-else :src="testArr[1]?.isEdit ? BaseURL+testArr[1]?.image : testArr[1].image" class="uploading-image my-2" />
          <label v-if="!editData" class="text-[#fff] cursor-pointer opacity-60 absolute right-4 top-4 rounded-[100%] bg-[rgba(0,0,0)] w-6 h-6 flex items-center justify-center" @click="removeImg(testArr[1].id)"><img src="/icon/editor/close.svg" class="w-4" alt=""></label>
        </div>
        <div class="relative" v-if="!isLoading && testArr[1] && testArr[3]">
          <video v-if="testArr[1].type === 'video'" :src="testArr[1]?.isEdit ? BaseURL+testArr[1]?.image : testArr[1].image" controls class="post__video my-2"></video>
          <img v-else :src="testArr[1]?.isEdit ? BaseURL+testArr[1]?.image : testArr[1].image" class="uploading-image my-2" />
          <label v-if="!editData" class="text-[#fff] cursor-pointer opacity-60 absolute right-4 top-4 rounded-[100%] bg-[rgba(0,0,0)] w-6 h-6 flex items-center justify-center" @click="removeImg(testArr[1].id)"><img src="/icon/editor/close.svg" class="w-4" alt=""></label>
        </div>
        <div v-if="!isLoading && testArr[2] && !testArr[3]" class="grid gap-4 grid-rows-2 max-h-[500px]">
          <div class="relative" v-if="!isLoading && testArr[1]">
            <video v-if="testArr[1].type === 'video'" :src="testArr[1]?.isEdit ? BaseURL+testArr[1]?.image : testArr[1].image" controls class="post__video my-2"></video>
            <img v-else class="uploading-image my-2" :src="testArr[1]?.isEdit ? BaseURL+testArr[1]?.image : testArr[1].image" />
            <label v-if="!editData" class="text-[#fff] cursor-pointer opacity-60 absolute right-4 top-4 rounded-[100%] bg-[rgba(0,0,0)] w-6 h-6 flex items-center justify-center" @click="removeImg(testArr[1].id)"><img src="/icon/editor/close.svg" class="w-4" alt=""></label>
          </div>
          <div class="relative" v-if="!isLoading && testArr[2]">
            <video v-if="testArr[2].type === 'video'" :src="testArr[2]?.isEdit ? BaseURL+testArr[2]?.image : testArr[2].image" controls class="post__video my-2"></video>
            <img v-else class="uploading-image my-2" :src="testArr[2]?.isEdit ? BaseURL+testArr[2]?.image : testArr[2].image"/>
            <label class="text-[#fff] cursor-pointer opacity-60 absolute right-4 top-4 rounded-[100%] bg-[rgba(0,0,0)] w-6 h-6 flex items-center justify-center" @click="removeImg(testArr[2].id)"><img src="/icon/editor/close.svg" class="w-4" alt=""></label>
          </div>
        </div>
        <div class="relative" v-if="!isLoading && testArr[2] && testArr[3]">
          <video v-if="testArr[2].type === 'video'" :src="testArr[2]?.isEdit ? BaseURL+testArr[2]?.image : testArr[2].image" controls class="post__video my-2"></video>
          <img v-else :src="testArr[2]?.isEdit ? BaseURL+testArr[2]?.image : testArr[2].image" class="uploading-image my-2" />
          <label v-if="!editData" class="text-[#fff] cursor-pointer opacity-60 absolute right-4 top-4 rounded-[100%] bg-[rgba(0,0,0)] w-6 h-6 flex items-center justify-center" @click="removeImg(testArr[2].id)"><img src="/icon/editor/close.svg" class="w-4" alt=""></label>
        </div>
        <div class="relative" v-if="!isLoading && testArr[3]">
          <video v-if="testArr[3].type === 'video'" :src="testArr[3]?.isEdit ? BaseURL+testArr[3]?.image : testArr[3].image" controls class="post__video my-2"></video>
          <img v-else :src="testArr[3]?.isEdit ? BaseURL+testArr[3]?.image : testArr[3].image" class="uploading-image my-2" />
          <label v-if="!editData" class="text-[#fff] cursor-pointer opacity-60 absolute right-4 top-4 rounded-[100%] bg-[rgba(0,0,0)] w-6 h-6 flex items-center justify-center" @click="removeImg(testArr[3].id)"><img src="/icon/editor/close.svg" class="w-4" alt=""></label>
        </div>
        <span v-if="isLoading" class="text-[#ffffff]">Loading...</span>
      </div>
    </div>
    <div class="flex gap-[5px] pl-[48px] w-[234px]">
      <div class="relative">
        <img src="/icon/editor/format.svg" class="cursor-pointer" alt="" @click="showMenuTooltip">
        <div class="menu--tooltip tiptap-menu" :class="{'active': isShowMenuTooltip}">
          <div class="header--tooltip flex justify-between mb-4">
            <span>Format</span>
            <img src="/icon/editor/close.svg" class="cursor-pointer" alt="" @click="isShowMenuTooltip = false">
          </div>
          <div class="flex">
            <div class="editor-btn editor-btn__left mr-[2px]" @click="editor.chain().focus().toggleBold().run()" :disabled="!editor.can().chain().focus().toggleBold().run()" :class="{ 'is-active': editor.isActive('bold') }">
              <img src="/icon/editor/bold.svg" alt="">
            </div>
            <div class="editor-btn mr-[2px]" @click="editor.chain().focus().toggleItalic().run()" :disabled="!editor.can().chain().focus().toggleItalic().run()" :class="{ 'is-active': editor.isActive('italic') }">
              <img src="/icon/editor/italic.svg" alt="">
            </div>
            <!-- <div class="editor-btn mr-[2px]" @click="editor.chain().focus().toggleUnderline().run()" :class="{ 'is-active': editor.isActive('underline') }">
              <img src="/icon/editor/format_underlined.svg" alt="">
            </div>
            <div class="editor-btn editor-btn__right" @click="editor.chain().focus().toggleStrike().run()" :class="{ 'is-active': editor.isActive('strike') }">
              <img src="/icon/editor/strikethrough_s.svg" alt="">
            </div> -->
          </div>
          <div class="flex mt-2">
            <div class="editor-btn editor-btn__left mr-[2px]" @click="editor.chain().focus().toggleOrderedList().run()" :class="{ 'is-active': editor.isActive('orderedList') }">
              <img src="/icon/editor/list_numbered.svg" alt="">
            </div>
            <div class="editor-btn editor-btn__right mr-2" @click="editor.chain().focus().toggleBulletList().run()" :class="{ 'is-active': editor.isActive('bulletList') }">
              <img src="/icon/editor/bulleted.svg" alt="">
            </div>
            <div class="editor-btn editor-btn__left mr-[2px]" @click="editor.chain().focus().setBlockquote().run()" :disabled="!editor.can().setBlockquote()">
              <img src="/icon/editor/indent_decrease.svg" alt="">
            </div>
            <div class="editor-btn editor-btn__right" @click="editor.chain().focus().unsetBlockquote().run()" :disabled="!editor.can().unsetBlockquote()">
              <img src="/icon/editor/indent_increase.svg" alt="">
            </div>
          </div>
          <!-- <div class="flex mt-2">
            <div class="editor-btn editor-btn__left w-[58px] mr-[2px]" @click="editor.chain().focus().setTextAlign('left').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'left' }) }">
              <img src="/icon/editor/align_left.svg" alt="">
            </div>
            <div class="editor-btn w-[58px] mr-[2px]" @click="editor.chain().focus().setTextAlign('center').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'center' }) }">
              <img src="/icon/editor/align_center.svg" alt="">
            </div>
            <div class="editor-btn editor-btn__right w-[58px]" @click="editor.chain().focus().setTextAlign('right').run()" :class="{ 'is-active': editor.isActive({ textAlign: 'right' }) }">
              <img src="/icon/editor/align_right.svg" alt="">
            </div>
          </div> -->
        </div>
      </div>
      <label class="file-input-label text-[#ffffff] cursor-pointer" for="file-upload" :class="{'pointer-events-none opacity-50' : testArr[3]}"><img src="/icon/editor/photo.svg" alt=""></label>
      <!-- <label v-else @click="previewImages = [], idImage = undefined" class="text-[#fff] cursor-pointer opacity-50"><img src="/icon/editor/close.svg" alt=""></label> -->
      <input id="file-upload" class="file-input hidden" type="file" @change="uploadImage" multiple>
      <label v-if="link?.[0]" @click="closeLinkPreview" class="text-[#fff] cursor-pointer opacity-50"><img src="/icon/editor/close.svg" alt=""></label>
    </div>
    <div class="absolute left-[20px] right-[20px] bottom-[70px] bg-[#18181B] rounded-[10px] flex justify-between items-center">
      <div class="flex justify-between items-center py-3">
        <img alt="x login" class="w-8 ml-4 mr-2" src="@/assets/images/x.svg">
        <span>Post to X</span>
      </div>
      <BaseToggle v-model="changePostToX" className="mr-4"/>
    </div>      
    <div class="absolute right-[20px] bottom-4 flex items-center w-full justify-between pl-10">
      <div class="flex items-center">
        <span v-if="changeReply">Anyone can weigh in</span>
        <span v-else>No one can weigh in</span>
        <BaseToggle v-model="changeReply" className="ml-2" @click="changeStatusReplyEditable"/>
      </div>
      <BaseButton class="!max-w-[106px]" @click="post"
                  :disabled="disabledBtn"
      >Post</BaseButton>
    </div>
    <div>
    <div v-if="editor" class="tiptap-menu hidden">
    <button @click="setLink" :class="{ 'is-active': editor.isActive('link') }">
          Set link
        </button>
        <button @click="editor.chain().focus().unsetLink().run()" :disabled="!editor.isActive('link')">
          Unset link
        </button>
  </div>
  <!-- <div class="text-[#fff] mt-4" v-html="text"></div> -->
      <!-- <img v-if="!isLoading" :src="previewImage" class="uploading-image my-2" />
      <span class="text-[#ffffff]" v-else>Loading...</span> -->
      <!-- <div class="flex justify-between">
        <div class="file-input-container">
        </div>
      </div> -->
    </div>
  </div>
</template>

<script setup>
import {computed, onMounted, ref, watch} from "vue";
import { useStore } from "vuex";
import { useEditor, EditorContent } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Image from '@tiptap/extension-image'
import Link from '@tiptap/extension-link'
import Placeholder from '@tiptap/extension-placeholder'
import TextAlign from '@tiptap/extension-text-align'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import { useToast } from 'primevue/usetoast';
import { BaseURL } from "@/global/baseUrls.js"
import {useRoute} from "vue-router";

const toast = useToast();
const route = useRoute();
const store = useStore();
const setPost = (payload) => store.dispatch("setPost", payload);
const updatePost = (payload) => store.dispatch("updatePost", payload);
const setUpdateStatus = (payload) => store.dispatch("setUpdateStatus", payload);
const setEditData = (data) => store.dispatch("addModalDataToState", data)
const getOnlyUserPosts = (payload) => store.dispatch("setOnlyUserPosts", payload);
const isShowModal = (value) => store.dispatch("showModal", value);
const editData = computed(() => store.getters.getModalData);
const getUserPosts = () => store.dispatch("setUserPosts");
const getRecomendedPosts = () => store.dispatch("setRecomendedPosts");
const getPost = (id) => store.dispatch("setRecomendedPost", id);
const props = defineProps({
  userData: {
    type: Object,
    default: "",
  },
});

const disabledBtn = computed(() => {
  if(testArr.value[0] || text.value || isChangeReply.value){
    return false
  }

  return !userdata.value?.firstName || !text.value || isLoading.value || text.value === '<p></p>'
})

const area = ref(null);
const areatext = ref('');
const result = ref(null);
const userdata = ref(null);
const text = ref("")
const previewImages = ref([]);
const changePostToX = ref(false);
const isLoading = ref(false);
const idsImage = ref([]);
const link = ref(null);
const linksTitle = ref('');
const linksDeskription = ref('');
const changeReply = ref(true);
const linksUrlImg = ref('');
const title = ref('');
const loadinglinks = ref(false);
const isLoadingMetaData = ref(true);
const isShowMenuTooltip = ref(false);
const isChangeReply = ref(false);
const testArr = ref([]);

const changeStatusReplyEditable = () => {
  isChangeReply.value = true;
}

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
      placeholder: 'What’s on your mind?',
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
    if(text.value === '<p></p>') {
      text.value = null;
      return;
    }
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

watch(
  () => changePostToX.value,
  () => {
    if(changePostToX.value === true && !userdata.value.hasTwitterToken) {
      toast.add({
        severity: "error",
        summary: "Error",
        detail: 'To use this feature, please sign in with your X account.',
        life: 7000
      });
      changePostToX.value = false;
    }
  }
);

onMounted(async() => {
  userdata.value = await JSON.parse(localStorage.getItem("user"));
  if(!userdata.value.hasTwitterToken) {
    changePostToX.value = false;
  } else {
    changePostToX.value = true;
  }
  if(editData.value) {
    isChangeReply.value = false;
    title.value = editData.value.title;
    editor.value.commands.setContent(editData.value.text);
    changeReply.value = editData.value.isAnyoneCanReply;
    editData.value.attachedFiles.forEach(item => {
      const payload = {
        id: item.id,
        image: item.storageId,
        type: item.mimetype.split('/')[0] === 'video' ? 'video' : 'image',
        isEdit: true
      }
      testArr.value.push(payload);
    })
  }
})

const showConfirmPostToX = () => {
  confirm.require({
        message: 'To use this feature, please sign in with your X account',
        acceptLabel: "Submit",
        rejectLabel: "Cancel",
        accept: async () => {
          const reportResp = await fetch (`/api/posts/${id}/mark-bot`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
            }
          );
          if(reportResp.status !== 200 && reportResp.status !== 201) {
            toast.add({ severity: 'error', summary: 'Rejected', detail: 'Report not created', life: 3000 });
          } else {
            // await getRecomendedPosts();
            // if(route.name === 'post') {
            //   await getReportPost(id);
            // } else {
            //   await getRecomendedPosts();
            // }
            toast.add({ severity: 'info', summary: 'Confirmed', detail: 'Report submitted', life: 3000 });
          }
        },
        reject: () => {
            
        }
    });
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

const removeImg = (id) => {
  testArr.value = testArr.value.filter(item => item.id !== id);
  previewImages.value.pop();
}

const post = async () => {
  testArr.value.forEach(item => {
    idsImage.value.push(item.id);
  })
  const textObj = text.value ? {text: text.value} : {}
  let payload = {
    ...textObj,
    title: title.value ? title.value : undefined,
    id: editData.value ? editData.value.id : undefined,
    attachedFileIds: idsImage.value && !editData.value ? idsImage.value : undefined,
    isAnyoneCanReply: changeReply.value,
    postToTwitter: changePostToX.value,
    urls: link?.value?.[0] ? [{
      url: link?.value?.[2],
      title: linksTitle?.value,
      description: linksDeskription?.value,
      imageUrl: linksUrlImg?.value
    }] : undefined,
    toast
  }
  if(editData.value) {
    await updatePost(payload);
    const data = {
      id: editData.value.authorUserId
    }
    if(route.name === 'post') {
      await getPost(editData.value.id);
    }
    if(route.name === 'profile') {
      await getOnlyUserPosts(data);
    }
    setEditData(null);
  } else {
    await setPost(payload);
  }
  previewImages.value = [];
  testArr.value = [];
  idsImage.value = undefined;
  text.value = '';
  isShowModal(false);
  document.body.style.overflow = "auto";
  setUpdateStatus(true);
  window.scrollTo({
    top: 0,
    left: 0,
    behavior: "smooth",
  });
  await getRecomendedPosts();
  setUpdateStatus(false);

}

const validatePost = computed(() => {
  return true;
})

const uploadImage = (e) => {
    const images = e.target.files;
    console.log('imgs', images)
    if (images.length > 5) {
      alert('You are only allowed to upload a maximum of 4 files at a time');
      return;
    }
    Object.values(images).forEach((item,i,arr) => {
      isLoading.value = true;
      const reader = new FileReader();
      reader.readAsDataURL(item);
      reader.onload = e =>{
        previewImages.value.push(e.target.result);
        let formData = new FormData();
        if(i <= 3) {
        formData.append('file', item,);
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
                      console.log('d', data)
                      const payload = {
                        id: data.id,
                        image: e.target.result,
                        type: data.mimetype.split('/')[0] === 'video' ? 'video' : 'image'
                      }
                      testArr.value.push(payload);
                      if(testArr.value.length === previewImages.value.length) {
                        isLoading.value = false;
                      }
                    } else {

                    }
                  }
                });
            } catch (error) {
                console.log('error', error)
            }
        }

    };
    })
}
</script>

<style lang="scss">
body {
  color: #F2F2F2;
}

.uploading-image {
  width: 100%;
  height: 100%;
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
    list-style: auto !important;
  }

  ol {
    list-style: auto !important;
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
  &.is-active {
    background: #14532D;
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
</style>