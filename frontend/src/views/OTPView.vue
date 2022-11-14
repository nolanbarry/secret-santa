<script setup lang="ts">
import TitleLogo from '../components/TitleLogo.vue'
import router from '@/router';
import { ref } from 'vue'
import { submitOtp } from '@/services/Network';

let loading = ref(false)
let userid = history.state.userid
let otp = ref()

const submitOTPHandler = async () => {
  loading.value = true;
  let data = await submitOtp(userid, otp.value)
  console.log(data)
  //Go to '/defaultpath' if no redirectPath value is set
  router.push(sessionStorage.getItem('redirectPath') || '/');

  //Cleanup redirectPath
  sessionStorage.removeItem('redirectPath');
}
</script>

<template>
  <main>
    <TitleLogo />
    <div class="text-input-div">
      <p class="input-label">Check your email for a one-time login code</p>
      <input class="text-input" type="text" v-model="otp" placeholder="Code from email" />
    </div>
    <div class="button-div">
      <button @click="submitOTPHandler" class="button">
        <div v-if="!loading">Continue</div>
        <div v-if="loading" class="button-loading-spinner" id="loading"></div>
      </button>
    </div>
  </main>
</template>

<style scoped lang="scss">
.text-input-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding-bottom: 30px
}

.input-label {
  margin-bottom: 20px;
}
</style>
