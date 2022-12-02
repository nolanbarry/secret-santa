<script setup lang="ts">
import TitleLogo from '../components/TitleLogo.vue'
import ErrorMessage from '@/components/ErrorMessage.vue';
import router from '@/router';
import { ref } from 'vue'
import { submitOtp } from '@/services/Network';
import HamburgerPopout from '@/components/HamburgerPopout.vue';

let loading = ref(false)
let userid = history.state.userid
let otp = ref()

let errorMessageSet = ref(false)
let errorMessage = ref("")

const submitOTPHandler = async () => {
  console.log(userid)
  loading.value = true;

  let data = await submitOtp(userid, otp.value)
  errorMessageSet.value = false;

  if (data.success == false) {
    errorMessageSet.value = true;
    errorMessage.value = "Error logging in. Verify that the email and one time code you provided are correct."
    loading.value = false;
  } else {
    router.push({ name: sessionStorage.getItem('redirectName')?.toString() } || '/');

    //Cleanup redirectPath
    sessionStorage.removeItem('redirectName');
  }
}
</script>

<template>
  <main>
    <HamburgerPopout :isAuthPage="true" />
    <TitleLogo />
    <div class="text-input-div">
      <p class="input-label">Check your email for a one-time login code. It may take up to 2 minutes to arrive.</p>
      <input class="text-input" type="text" v-model="otp"
        placeholder="Code from email" />
    </div>
    <div class="button-div">
      <button @click="submitOTPHandler" class="button">
        <div v-if="!loading">Continue</div>
        <div v-if="loading" class="button-loading-spinner" id="loading"></div>
      </button>
    </div>
    <ErrorMessage v-if="errorMessageSet">
      <template #message>
        {{ errorMessage }}
      </template>
    </ErrorMessage>
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
  text-align: center;
}
</style>
