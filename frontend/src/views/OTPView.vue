<script setup lang="ts">
import TitleLogo from '../components/TitleLogo.vue'
import router from '@/router';
import { ref } from 'vue'

let loading = ref(false)

const submitOTPHandler = async () => {
  loading.value = true;
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
      <input class="text-input" type="text" placeholder="Code from email" />
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
</style>