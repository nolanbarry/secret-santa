<script setup lang="ts">
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
      <input type="text" class="text-input" placeholder="Exchange code" />
      <p>Enter your name:</p>
      <input type="text" class="text-input" placeholder="Your name" />
    </div>
    <div class="button-div">
      <router-link to="/user-view" class="button">
        Join Exchange
      </router-link>
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