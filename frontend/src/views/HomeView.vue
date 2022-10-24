<script setup lang="ts">
import TitleLogo from '../components/TitleLogo.vue'
</script>

<template>
  <main>
    <TitleLogo />
    <div class="button-div">
      <router-link to="/create-exchange" class="button">
        Create a new Exchange
      </router-link>

      <router-link to="/join-exchange" class="button">
        Join an Exchange
      </router-link>

      <router-link to="/choose-exchange" class="button">
        View my Exchanges
      </router-link>
    </div>
  </main>
</template>
