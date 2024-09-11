<template>
  <Transition name="bounce">
    <div
      v-if="isShow"
      class="base-modal"
    >
      <div class="base-modal__wrapper">
        <div
          class="base-modal__container relative"
          :class="containerClass"
        >
          <span
            v-if="isCloseActive"
            class="base-modal__close"
            @click="modalHide"
          />
          <div class="base-modal__content py-4" v-click-outside="modalHide">
            <div class="base-modal__header flex">
              <span class="base-modal__close text-[#A1A1AA]" @click="modalHide">Cancel</span>
              <h2
                v-if="title"
                class="text-[16px] text-[#E4E4E7] mx-auto"
              >
                {{ title }}
              </h2>
              <BaseButton
                type="submit"
                mode="text"
                :disabled="!isDataChanged && !isAddImg"
                @click="handleSave"
                class="base-modal__save max-h-[30px]">
                Save
              </BaseButton>
            </div>

            <div v-if="userAuth" class="base-modal__body">
              <form class="edit-profile-form">
                <div class="flex items-center">
                  <div class="flex items-center flex-wrap mb-2 w-full">
                    <BaseField
                      :value="userAuth?.username || userAuth?.twitterUsername || ''"
                      :is-readonly="true"
                      class="mr-[24px] min-w-[200px]  w-full"
                      :placeholder="'Your username'"
                      :label="'Username'"
                      isBottomBorderOnFocus
                    ></BaseField>
                  </div>
                  <label class="file-input-label text-[#ffffff] cursor-pointer" for="file-upload">
                    <div class="profile-avatar relative">
                      <BaseAvatar
                        :src="previewImage || undefined"
                        :storage-id="previewImage ? undefined : userAuth?.avatarFile?.storageId"
                        :size="'lg'"
                      />
                      <input id="file-upload" class="file-input hidden" type="file" @change="uploadImage">
                    </div>
                  </label>
                </div>
                <div class="flex items-center flex-wrap mb-2 w-full">
                  <BaseField
                    v-model:value="v.firstName.$model"
                    :error="v.firstName.$errors"
                    class="mr-2 min-w-[300px] w-full"
                    :placeholder="'Enter first name'"
                    :label="'First name'"
                    isBottomBorderOnFocus
                  ></BaseField>
                </div>
                <div class="flex items-center flex-wrap mb-2 w-full">
                  <BaseField
                    v-model:value="v.lastName.$model"
                    :error="v.lastName.$errors"
                    class="mr-2 min-w-[300px] w-full"
                    :placeholder="'Enter last name'"
                    :label="'Last name'"
                    isBottomBorderOnFocus
                  ></BaseField>
                </div>
                <div class="flex items-center flex-wrap mb-2 w-full">
                  <BaseTextarea
                    v-model:value="v.bio.$model"
                    :error="v.bio.$errors"
                    class="mr-2 min-w-[300px] w-full"
                    :placeholder="'Wrtie a bio'"
                    :label="'Bio'"
                    :maxlength="160"
                    isBottomBorderOnFocus
                  ></BaseTextarea>
                </div>
              </form>
              <slot name="body" />
            </div>

            <div class="base-modal__footer">
              <slot name="footer" />
            </div>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import {computed, ref, watch} from "vue";
import { useStore } from "vuex";
import { useToast } from 'primevue/usetoast';
import { directive as vClickOutside } from "click-outside-vue3";
import useVuelidate from "@vuelidate/core";
import {helpers, maxLength, required} from "@vuelidate/validators";

const emit = defineEmits(["update:isShow", "profileUpdated"]);
const props = defineProps({
  title: {
    type: String,
    default: "",
  },
  subTitle: {
    type: String,
    default: "",
  },
  isLogo: {
    type: Boolean,
    default: false,
  },
  isShow: {
    type: Boolean,
    default: false,
  },
  isCloseActive: {
    type: Boolean,
    default: false,
  },
  isShadow: {
    type: Boolean,
    default: false,
  },
  isSucces: {
    type: Boolean,
    default: false,
  }
});
const containerClass = computed(() => {
  return [
    {
      "base-modal__container_is-shadow": props.isShadow,
      "base-modal__container_is-succes": props.isSucces,
    },
  ];
});
const store = useStore();
const toast = useToast();
const userAuth = computed(() => store.getters.getUser)

const firstName = ref(userAuth.value.firstName);
const lastName = ref(userAuth.value.lastName);
const bio = ref(userAuth.value.bio);

const uploadImg = ref(null);
const previewImage = ref(null);
const isAddImg = ref(false);

const modalHide = () => {
  emit("update:isShow", false);
  document.body.style.overflow = "auto";
  resetForm();
};

const rules = computed(() => ({
  firstName: {
    required: helpers.withMessage("Field cannot be empty", required),
  },
  lastName: {
    required: helpers.withMessage("Field cannot be empty", required),
  },
  bio: {
    maxLength: helpers.withMessage("Bio cannot exceed 160 characters", maxLength(160)),
  },
}));

const v = useVuelidate(rules, {
  firstName,
  lastName,
  bio
});

const uploadImage = async (e) => {
  isAddImg.value = false;
  uploadImg.value = await e.target.files[0];
  const reader = new FileReader();
  reader.readAsDataURL(uploadImg.value);
  reader.onload = e =>{
    previewImage.value = e.target.result;
    isAddImg.value = true;
  };
}

const isDataChanged = computed(() =>
  firstName.value !== userAuth.value.firstName ||
  lastName.value !== userAuth.value.lastName ||
  bio.value !== userAuth.value.bio
);

const saveImage = async () => {
  if (!isAddImg.value) return true;
  let formData = new FormData();
  formData.append('file', uploadImg.value);
  try {
    const response = await fetch(`/api/users/avatar`, {
      method: 'POST',
      body: formData
    });
    if (response.ok) {
      isAddImg.value = false;
      return true;
    } else {
      const errorData = await response.json();
      return errorData.message;
    }
  } catch (error) {
    console.error('Error in save image:', error.message);
    return error.message;
  }
}

const saveInfo = async () => {
  if (!isDataChanged.value) return true;
  const dataToUpdate = {};

  if (firstName.value !== userAuth.value.firstName) {
    dataToUpdate.firstName = firstName.value;
  }
  if (lastName.value !== userAuth.value.lastName) {
    dataToUpdate.lastName = lastName.value;
  }
  if (bio.value !== userAuth.value.bio) {
    dataToUpdate.bio = bio.value;
  }
  try {
    const response = await fetch(`/api/users/me`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(dataToUpdate),
    });
    if (response.ok) {
      return true;
    } else {
      const errorData = await response.json();
      return errorData.message;
    }
  } catch (error) {
    console.error('Error updating profile:', error.message);
    return error.message;
  }
}

const handleSave = async () => {
  const avatarResult = await saveImage();
  const dataResult = await saveInfo();

  if (avatarResult === true && dataResult === true) {
    toast.add({
      severity: "success",
      summary: "Profile updated successfully",
      life: 7000
    });
    emit('profileUpdated');
    modalHide();
  } else {
    let errorMessages = [];
    if (avatarResult !== true) errorMessages.push(`Image: ${avatarResult}`);
    if (dataResult !== true) errorMessages.push(`Profile data: ${dataResult}`);

    toast.add({
      severity: "error",
      summary: "Error updating profile. Please try again",
      detail: errorMessages.join('. '),
      life: 7000
    });
    emit('profileUpdated');
    modalHide();
  }
};

const setFormFields = () => {
  firstName.value = userAuth.value.firstName;
  lastName.value = userAuth.value.lastName;
  bio.value = userAuth.value.bio;
};

const resetForm = () => {
  setFormFields();
  isAddImg.value = false;
  previewImage.value = null;
};

watch(userAuth, setFormFields);
</script>

<style lang="scss" scoped>
.base-modal {
  position: fixed;
  z-index: 19998;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: table;
  &__wrapper {
    display: table-cell;
    vertical-align: middle;
  }
  &__container {
    max-width: 680px;
    min-height: 600px;
    padding: 0 16px;
    margin: 0 auto;
    background: #09090B;
    border-radius: 20px;
  }
  &__header {
    width: 100%;
    border-color: #fff;
    border-bottom: 1px solid #3b3b3b;
    display: flex;
    align-items: center;
    padding-bottom: 8px;
    .header {
      &__logo-link {
        display: inline-block;
        text-decoration: none;
        margin-bottom: 10px;
      }
      &__logo-img {
        min-width: 88px;
        height: 88px;
      }
      @keyframes l {
        to {
          clip-path: inset(0 -1ch 0 0);
        }
      }
    }
  }
  &__body {
    margin-bottom: 45px;
    padding: 24px 16px;
    max-height: 600px;
    min-height: 500px;
    overflow-y: scroll;
  }
  &__footer {
    display: flex;
    justify-content: center;
  }
  &__close {
    cursor: pointer;
    transition: opacity ease 0.5s;
  }
  &__save {
    color: #52525B;
    font-size: 14px;
    line-height: 20px;
    font-weight: 700;
    margin-right: 12px;
  }
  @include _767 {
    &__container {
      padding: 0 16px;
    }
    &__body {
      padding: 24px 16px;
    }
  }
  @include _480 {
    &__container {
      height: 100vh;
    }
  }
}
.edit-profile-form {
  .profile-avatar::after {
    content: "";
    position: absolute;
    border-radius: 50%;
    background-image: url("/icon/add_circle-600.svg");
    width: 14px;
    height: 14px;
    right: 0;
    bottom: 3px;
  }
  .file-input-label {
    max-height: fit-content;
  }
}
.bounce-enter-active {
  animation: bounce-in 0.5s ease-out;
}
.bounce-leave-active {
  animation: bounce-in 0.5s reverse;
}
@keyframes bounce-in {
	0% {
		transform: translateY(-100%);
	}
	30%{
		transform: translateY(5%);
	}
	65%{
		transform: translateY(-2%);
	}
	100%{
		transform: translateY(0%);
	}
}
.base-modal__body {
  scrollbar-width: thin;          /* "auto" or "thin" */
  scrollbar-color: #272727 #121212;   /* scroll thumb and track */
}

.base-modal__body::-webkit-scrollbar {
  width: 8px;               /* width of the entire scrollbar */
}

.base-modal__body::-webkit-scrollbar-track {
  background: #121212;        /* color of the tracking area */
}

.base-modal__body::-webkit-scrollbar-thumb {
  background-color: #272727;    /* color of the scroll thumb */
  border-radius: 20px;       /* roundness of the scroll thumb */
  border: 2px solid #121212;  /* creates padding around scroll thumb */
}
</style>