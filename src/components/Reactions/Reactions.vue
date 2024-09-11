<template>
  <div
      class="reactions"
      ref="reactionRef"
  >
    <div @click="handleOpen" class="d-flex reactions-btns items-center gap-2">
      <div class="reactions-btn">
        <ReactionIcon :in-circle="true" :type="'Kind'"/>
        <ReactionIcon :in-circle="true" :type="'Insightful'"/>
        <ReactionIcon :in-circle="true" :type="'hmm'"/>
        <div class="pl-4 reactions-txt">{{ reactionGood }}</div>
      </div>

      <div class="reactions-btn">
        <ReactionIcon :in-circle="true" :type="'dislike'"/>
        <ReactionIcon :in-circle="true" :type="'BadFaith'"/>
        <div class="pl-4 reactions-txt" style="'color: #18181B'">{{ reactionBad }}</div>
      </div>

    </div>

    <div v-if="isActive" v-click-outside="closeModal"
         ref="modal"
         class="reactions--tooltip"
         :class="{'active': isActive}" :style="{top: positionTop}"
    >
      <div class="reactions-close" @click="closeModal">
        <div>
          <svg width="14" height="14" viewBox="0 0 14 14" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M1.39953 13.6553L0.345703 12.6015L5.9457 7.00148L0.345703 1.40148L1.39953 0.347656L6.99953 5.94766L12.5995 0.347656L13.6534 1.40148L8.05335 7.00148L13.6534 12.6015L12.5995 13.6553L6.99953 8.05531L1.39953 13.6553Z" fill="#F4F4F5"/>
          </svg>
        </div>
      </div>
      <div class="reactions-head">
        <img src="/icon/1111.svg" alt="">
        {{ abbreviateNumber(userdata.rating) }}
        <svg width="6" height="8" viewBox="0 0 6 8" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path
              d="M3.62917 3.99969L0.5625 0.933019L1.26505 0.230469L5.03427 3.99969L1.26505 7.7689L0.5625 7.06635L3.62917 3.99969Z"
              fill="#F4F4F5"/>
        </svg>
        <div class="reactions-head-title">
          Choose one or more reactions below.
        </div>
      </div>
      <div class="reactions-body px-[10px]">
        <div class="reactions-item rounded-lg">
          <div class="reactions-item-head">
            <div class="reactions-label">You changed my mind</div>
            <img src="/icon/1111.svg" alt="">
            <span class="reactions-price" v-if="reactionsPrices">{{ reactionsPrices['mindPrice'] }}</span>
          </div>
          <div class="d-flex items-center justify-center mt-1">
            <ReactionIcon :type="'boom'"/>
            <BaseToggle v-model="changeMind" className="mx-2 "/>
            <div>Yes</div>
          </div>
        </div>
        <div class="reactions-wrp gap-y-[10px] mt-[10px]">
          <div class="reactions-item reactions-react" v-for="(reaction, index) in reactions">
            <ReactionIcon :type="reaction?.img || reaction.name"/>
            <div class="reactions-react-r">
              <div class="reactions-item-head mb-1">
                <div class="reactions-label">{{ capitalizeFirstLetter(reaction.name) }}</div>
                <img src="/icon/1111.svg" alt="">
                <span class="reactions-price" v-if="reactionsPrices">{{ reactionsPrices[reaction.priceKey] }}</span>
              </div>
              <BaseRangeSelect v-model="reaction.value" @update:model-value="(v) => changedReaction(v, index)" :isRed="!reaction.isGood"/>
            </div>
          </div>
        </div>
      </div>
      <div class="reactions-form">
        <div class="d-flex items-center mb-2">
          <div class="mr-2">TOTAL:</div>
          <div class="mr-1" :style="{maxWidth: '9px'}">
            <img src="/icon/1111.svg" alt="">
          </div>
          <div class="reactions-total"  :class="{'text-red': !isEnoughBalance}">{{ totalPrice }}</div>
        </div>
        <div class="mb-1">Use reputation points or explain your point of view below:</div>
        <BaseField
            v-model:value="inputText"
            :placeholder="'Input text'"
            :isGray="true"
        />
      </div>
      <div class="reactions-actions">
        <button color="reactions-actions-green" @click="closeModal">Cancel</button>
        <button class="reactions-actions-main" :class="{'disabled': !isEnoughBalance}" @click="submit" :disabled="!isEnoughBalance">
          {{loading ? 'Loading...' : 'Submit'}}
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import ReactionIcon from "./ReactionIcon.vue";
import {computed, onMounted, ref, nextTick, onUnmounted} from 'vue'
import { abbreviateNumber } from '@/utils/utils.js';
import { directive as vClickOutside } from "click-outside-vue3";
import {useToast} from "primevue/usetoast";
import {useStore} from "vuex";

const props = defineProps(['post', 'disabled'])
const emits = defineEmits(['update:addReply'])

const store = useStore();

const total = ref(null)
const inputText = ref('')
const changeMind = ref(false)
const positionTop = ref('0px')
const reactionRef = ref(null)
const userdata = ref(null)
const modal = ref(null)
const getProfile = (id) => store.dispatch("setProfile", id);

const reactions = ref([
  {
    name: 'like',
    isGood: true,
    apiKey: "like",
    priceKey: 'likePrice',
    value: 0,
  },
  {
    name: 'dislike',
    isGood: false,
    apiKey: "dislike",
    priceKey: "dislikePrice",
    value: 0,
  },
  {
    name: 'Important',
    isGood: true,
    apiKey: "important",
    priceKey: "importantPrice",
    value: 0,
  },
  {
    name: 'Bad Faith',
    isGood: false,
    img: 'BadFaith',
    apiKey: "badFaith",
    priceKey: "badFaithPrice",
    value: 0,
  },
  {
    name: 'Kind',
    isGood: true,
    apiKey: "kind",
    priceKey: "kindPrice",
    value: 0,
  },
  {
    name: 'Troll',
    isGood: false,
    priceKey: "trollPrice",
    apiKey: "troll",
    value: 0,
  },
  {
    name: 'Insightful',
    isGood: true,
    priceKey: "insightfulPrice",
    apiKey: "insightful",
    value: 0,
  },
  {
    name: 'Misleading',
    isGood: false,
    priceKey: "misleadingPrice",
    apiKey: "misleading",
    value: 0,
  },
])

const reactionsPrices = computed(() => {
  return store.getters["getReactionsPrices"]
});

const toast = useToast();

const isActive = ref(false)
const reactionBad = ref(0)
const reactionGood = ref(0)
const loading = ref(false)

const setTotalReactions = (data) => {
  const post = data || props.post

  if(post){
    reactionBad.value = post.numNegativeReactions;
    reactionGood.value = post.numPositiveReactions;
  }
}

const closeModal = () => {
  inputText.value = ''
  reactions.value = reactions.value.map(el => ({...el, value: 0}))
  changeMind.value = false
  isActive.value = false
  window.removeEventListener('scroll', handleScroll);
}

const handleScroll = () => {
  if (modal.value) {
    const rect = modal.value.getBoundingClientRect();
    const modalHeight = rect.height;

    if (rect.top + modalHeight * 0.7 < 0 || rect.bottom - modalHeight * 0.7 > window.innerHeight) {
      closeModal();
    }
  }
};

const handleOpen = async (event) => {
  userdata.value = await JSON.parse(localStorage.getItem("user"));
  if(!userdata.value || props.disabled){
    return
  }
  
  const rect =  reactionRef.value.getBoundingClientRect()
  positionTop.value = -(rect.top - 100) + 'px';

  nextTick(() => {
    window.addEventListener('scroll', handleScroll);
  });

  isActive.value = true;
}

onMounted(async() => {
  userdata.value = await JSON.parse(localStorage.getItem("user"));
  setTotalReactions(props.post)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll);
});

const submit = async () => {
  if (!isEnoughBalance.value) {
    console.log('not enough balance');
    return;
  }


  const data = {};
  let total = 0

  reactions.value.forEach(reaction => {
    total += reaction.value;
    data[reaction.apiKey] = reaction.value;
  });

  if(total === 0){
    toast.add({
      severity: "error",
      summary: "Select reaction",
      life: 7000
    })
    return
  }

  loading.value = true;
  try {
    if(inputText.value){
      const replyResp = await fetch (
          `/api/posts`,
          {
            method: 'POST',
            body: JSON.stringify({
              text: inputText.value,
              repostedPostId: props.post.id ? props.post.id : undefined,
            }),
            headers: {
              'Content-Type': 'application/json',
            },
          }
      );

      if(replyResp.status !== 200 && replyResp.status !== 201){
        toast.add({
          severity: 'error',
          summary: 'Reply not created',
          life: 7000,
        });
        return
      }else{
        emits('update:addReply')
      }
    }

    const response = await fetch(`/api/posts/${props.post.id}/react`, {
      method: 'POST',
      body: JSON.stringify({
        ...data,
        "mind": changeMind.value,
        "description": inputText.value || null
      }),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    const responseData = await response.json();

    if (responseData.error || responseData.statusCode === 409) {
      toast.add({
        severity: 'error',
        summary: Array.isArray(responseData.message) ? responseData.message.join('\n') : responseData.message,
        life: 7000,
      });
    } else {
      setTotalReactions(responseData);
      store.dispatch('getMe');
      closeModal();
    }
  } catch (error) {
    console.log('error', error);
    toast.add({
      severity: 'error',
      summary: 'An unexpected error occurred',
      life: 7000,
    });
  } finally {
    loading.value = false;
  }
};


const totalPrice = computed(() => {
  if(inputText.value){
    return 0
  }

  let total = 0
  reactions.value.forEach(el => {
    if(el.value){
      total += reactionsPrices.value[el.priceKey] * ( el.value  )
    }
  })
  if(changeMind.value){
    total += reactionsPrices.value['mindPrice']
  }

  return total
})

const isEnoughBalance = computed(() => {
  return userdata.value?.rating >= totalPrice.value;
})

const changedReaction = (value, index) => {
  const chainElIndex = index % 2 === 0 ?  index + 1 : index - 1

  if(reactions.value[chainElIndex]){
    reactions.value[chainElIndex].value = 0
  }
}

function capitalizeFirstLetter(text) {
  if (!text) {
    return text;
  }
  return text.charAt(0).toUpperCase() + text.slice(1);
}
</script>

<style scoped lang="scss">
.reactions {
  font-size: 14px;
  position: relative;

  .text-red{
    color: #DC2626;
  }

  &-btn{
    display: flex;
    align-items: center;
    @apply space-x-[-12px];
    transition: .2s ease-in-out;
    &:hover{
      transform: scale(1.1);
    }
  }
  &-btns {
    cursor: pointer;
  }

  &-txt {
    font-size: 12px;
    color: #A1A1AA;
  }

  &-actions {
    display: grid;
    grid-template-columns: 1fr 1fr;
    border-radius: 0 0 12px 12px;
    overflow: hidden;
    
    @include _639 {
      overflow: unset;
    }

    button:nth-child(1) {
      background: #09090B;
      color: #E4E4E7 !important;
      cursor: pointer;

      &:hover {
        background: #1d1d21;
      }
    }

    button:nth-child(2) {
      background: #A3E635;
      cursor: pointer;
      color: #09090B;

      &:hover {
        background: #86c027;
      }
      &.disabled{
        pointer-events: none;
      }
    }

    button {
      height: 44px;
      transition: .3s;
      display: flex;
      text-align: center;
      font-weight: 500;
      justify-content: center;
      align-items: center;
    }
  }

  &-form {
    //background: #09090B;
    //border-left: 2px solid #48484A;
    //border-right: 2px solid #48484A;
    padding: 12px 14px;
  }

  &-total {
    font-size: 16px;
    font-family: 'ClashDislay', serif;
  }

  &-item {
    border: 1px solid rgba(255, 255, 255, 0.1);
  }

  &-wrp {
    display: grid;
    grid-template-columns: 1fr 1fr;
    .reactions-item{
      border: 1px solid rgba(255, 255, 255, 0.1);
      &:nth-child(2n - 1){
        border-radius: 0.5rem 0 0 0.5rem;
        border-right: none;
      }
      &:nth-child(2n){
        border-radius: 0 0.5rem 0.5rem 0 ;
        border-left: none;
      }
    }
  }

  &-close{
    height: 48px;
    display: flex;
    justify-content: flex-end;
    align-items: center;
    padding-right: 20px;
    width: 100%;
    cursor: pointer;
  }
  &-head {
    display: flex;
    align-items: center;
    gap: 5px;
    padding: 12px 25px;

    &-title {
      margin-left: 24px;
    }
  }

  &-label {
    font-size: 14px;
  }

  &-price {
    font-size: 9px;
    font-weight: 500;
    font-family: 'ClashDislay', serif;
  }

  &-body {
    //background: #09090B;
    //border-left: 1px solid #48484A;
    //border-right: 1px solid #48484A;
    //border-top: 2px solid #48484A;
    //border-bottom: 2px solid #48484A;
  }


  &-item {
    padding: 10px 0;
    background: #1d1d21;
    //border-bottom: 2px solid #48484A;
    //border-left: 1px solid #48484A;
    //border-right: 1px solid #48484A;


    &-head {
      display: flex;
      justify-content: center;
      align-items: center;
      gap: 5px;

      img {
        margin-left: 5px;
        width: 10px;
        height: 10px;
      }
    }
  }

  &-react {
    display: flex;
    align-items: center;
    padding-left: 5px;
    padding-right: 8px;

    &-r {
      width: 100%;
      margin-left: 7px;
    }
  }
}

.reactions--tooltip {
  display: none;
  background: #09090B;
  border: 1px solid rgba(255, 255, 255, 0.1);

  position: absolute;
  z-index: 110;
  width: 420px;
  left: -50%;
  border-radius: 13px;
  box-shadow: 0 0 12px rgba(0, 0, 0, 0.3);
  height: fit-content;
  
  @include _639 {
    position: fixed;
    top: 0 !important;
    left: 0;
    width: 100%;
    height: 100%;
    overflow-y: auto;
    z-index: 110;
    padding-bottom: 80px;
  }
  //@media (max-width: 500px) {
  //  width: 370px;
  //}

  &.active {
    display: flex;
    flex-direction: column;
    animation: slide 350ms ease-in-out forwards;
    @keyframes slide {
      0% {
        opacity: 0;
        transform: scale(0.1) translateY(0%);
      }
      100% {
        opacity: 1;
        transform: scale(1) ;
      }
    }
  }
}
</style>