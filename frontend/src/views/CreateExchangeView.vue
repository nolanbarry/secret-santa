<script setup lang="ts">
  import ChooseDate from '../components/ChooseDate.vue'
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
      <input class="text-input" type="text" placeholder="Exchange name" />
      <p>Enter your name:</p>
      <input class="text-input" type="text" placeholder="Your name" />
    </div>
    <div class="date-picker-div">
      <p>Choose a date for your exchange:</p>
      <ChooseDate/>
    </div>
    <div class="button-div">
      <router-link to="/" class="button">
        Create Exchange
      </router-link>
    </div>
    <!-- <ChooseDate/>  -->
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
