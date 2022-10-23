<script setup lang="ts">
import TitleLogo from '../components/TitleLogo.vue'
</script>

<template>
  <main>
    <TitleLogo />
    <div class="button-div">
      <router-link to="/createExchange" class="button">
        Create a new Game
      </router-link>

      <router-link to="/joinExchange" class="button">
        Join a Game
      </router-link>

      <router-link to="/chooseExchange" class="button">
        View my Games
      </router-link>
    </div>
  </main>
</template>
