<template>
  <div class="onboarding">
    <div class="onboarding__body d-flex justify-center flex-column">
      <div class="onboarding__logo-container d-flex">
        <img alt="logo" class="onboarding__logo" src="@/assets/images/logo-green.svg">
        <span>sez us</span>
      </div>
      <div class="onboarding__content mt-[120px] px-[16px] sm:px-0">
        <h2 class="onboarding__title mb-[12px] d-flex items-center">Add a profile picture<span v-if="false" class="onboarding__badge ml-[12px]">+100 pts!</span></h2>
        <p class="onboarding__text mb-[36px]">Your profile picture will be visible to everyone. You can change it at any
          time.</p>
        <div class="onboarding__profile-info flex-column items-center flex justify-center mb-[50px]">
          <label class="file-input-label text-[#ffffff] cursor-pointer" for="file-upload">
            <div class="profile-avatar">
              <img v-if="!isLoading" :class="{ 'img-ready': isAddImg }" :src="previewImage" alt="user's avatar">
              <span v-else class="loader"></span>
              <input id="file-upload" ref="fileInput" :value="previewImage.name" class="file-input hidden" type="file"
                     @change="uploadImage">
            </div>
          </label>
          <div v-if="errorMessage" class="error mt-[10px]">{{ errorMessage }}</div>
        </div>
        <div class="d-flex justify-center" style="gap: 6px;">
          <BaseButton v-if="true" :name="isAddImg ? 'Change' : 'Skip'"
                      class="onboarding__button onboarding__button-secondary" @click="handleSecondaryButtonClick">
          </BaseButton>
          <BaseButton v-if="true" :name="isAddImg ? 'Done' : 'Add picture'" class="onboarding__button onboarding__button"
                      isIcon @click="handleButtonClick">
            <img v-if="isAddImg" alt="next" src="@/assets/images/arrow-outward-black.svg">
            <img v-else class="ml-[18px]" alt="next" src="@/assets/images/plus.svg">
          </BaseButton>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import {useRouter} from "vue-router";
import {onMounted, ref} from "vue";
import {useStore} from "vuex";

const router = useRouter();
const store = useStore();
const userAuth = ref(null);
const uploadImg = ref(null);
const previewImage = ref('/images/avatar.svg');
const isLoading = ref(false);
const isAddImg = ref(false);
const fileInput = ref(null);
const errorMessage = ref('');

const handleSecondaryButtonClick = () => {
  if (isAddImg.value) {
    fileInput.value.click();
  } else {
    saveImage();
  }
};
const handleButtonClick = () => {
  if (!isAddImg.value) {
    fileInput.value.click();
  } else {
    saveImage();
  }
};
const uploadImage = async (e) => {
  isAddImg.value = false;
  uploadImg.value = await e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(uploadImg.value);
  reader.onload = e => {
    isLoading.value = true;
    previewImage.value = e.target.result;
    isLoading.value = false;
    isAddImg.value = true;
  };
}
const saveImage = async () => {
  errorMessage.value = '';
  if (uploadImg.value) {
    isLoading.value = true;
    let formData = new FormData();
    formData.append('file', uploadImg.value,);
    try {
      const response = await fetch(`/api/users/avatar`, {
        method: 'POST',
        body: formData
      });
      if (response.ok) {
        isLoading.value = false;
        goToHome();
      } else {
        const errorData = await response.json();
        throw new Error(errorData.message || `Failed to save image: ${response.statusText}`);
      }
    } catch (error) {
      errorMessage.value = error.message;
      console.error(error.message);
    } finally {
      isLoading.value = false;
    }
  } else {
    goToHome();
  }
}
const goToHome = () => {
  router.push('/');
}
onMounted(async()=> {
  userAuth.value = JSON.parse(localStorage.getItem("user"));
});
</script>
<style lang="scss" scoped>
.onboarding__profile-info {
  .profile-avatar {
    img {
      outline: 2px solid #F4F4F5;
      border-radius: 50%;
      mix-blend-mode: screen;
      width: 128px;
      height: 128px;
    }

    img.img-ready {
      mix-blend-mode: normal;
      border: 1px solid black;
    }

    .loader {
      width: 128px;
      height: 128px;
      border: 8px solid #18181B;
      border-top: 8px solid #443b3b;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      display: flex;
      mix-blend-mode: screen;
    }
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
  }
  .error {
    color: #F87171;
    mix-blend-mode: screen;
    font-size: 12px;
    line-height: 16px;
  }
}
</style>
