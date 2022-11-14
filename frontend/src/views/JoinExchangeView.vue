<script setup lang="ts">
import router from '@/router';
import { ref } from 'vue'
import { joinGame } from '@/services/MockNetwork';

let loading = ref(false)
let displayName = ref()
let exchangeCode = ref()

const joinExchangeHandler = async () => {
  loading.value = true;

  let data = await joinGame(exchangeCode.value, displayName.value);

  if (data.success == true) {
    router.push(`/user-view/${exchangeCode.value}`);
  } else {
    router.push('/');
  }
}
</script>
  
<template>
  <main>
    <div class="title-wrapper">
      <header class="title">
        Join Exchange
      </header>
    </div>
    <div class="text-input-div">
      <p>Enter exchange code:</p>
      <input type="text" class="text-input" v-model="exchangeCode"
        placeholder="Exchange code" />
      <p>Enter your name:</p>
      <input type="text" class="text-input" v-model="displayName"
        placeholder="Your name" />
    </div>
    <div class="button-div">
      <button @click="joinExchangeHandler" class="button">
        <div v-if="!loading">Join Exchange</div>
        <div v-if="loading" class="button-loading-spinner" id="loading"></div>
      </button>
    </div>
  </main>
</template>

<style>
.title {
  font-family: 'Coiny';
  font-style: normal;
  font-weight: 400;
  font-size: 4rem;
  color: #FFFFFF;
  -webkit-text-stroke: 0.27rem #A74141;
  flex-wrap: wrap;
}

.title-wrapper {
  display: flex;
  justify-content: center;
  text-align: center;
}

.text-input-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>