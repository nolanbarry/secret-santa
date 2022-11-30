<script setup lang="ts">
import ChooseDate from '../components/ChooseDate.vue'
import router from '@/router';
import { ref } from 'vue'
import { createGame } from '@/services/Network';

let loading = ref(false)
let exchangeName = ref()
let hostDisplayName = ref()
let exchangeDate = ref()

const createExchangeHandler = async () => {
  loading.value = true;

  let data = await createGame(exchangeName.value, hostDisplayName.value, exchangeDate.value);

  router.push({ name: "userView", params: { gameid: data.gameCode } })
}
</script>

<template>
  <main>
    <div class="title-wrapper">
      <header class="title">
        Create Exchange
      </header>
    </div>
    <div class="text-input-div">
      <p>Enter a name for your new exchange:</p>
      <input class="text-input" type="text" v-model="exchangeName"
        placeholder="Exchange name" />
      <p>Enter your name:</p>
      <input class="text-input" type="text" v-model="hostDisplayName"
        placeholder="Your name" />
    </div>
    <div class="date-picker-div">
      <p>Choose a date for your exchange:</p>
      <ChooseDate @chosen-date="(chosenDate) => exchangeDate = chosenDate" />
    </div>
    <div class="button-div">
      <button @click="createExchangeHandler" class="button">
        <div v-if="!loading">Create Exchange</div>
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

.date-picker-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>
