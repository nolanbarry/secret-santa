<script setup lang="ts">
import TitleLogo from '../components/TitleLogo.vue'
</script>

<template>
  <main>
    <TitleLogo />
    <div class="button-div">
      <router-link to="/create-exchange" class="button">
        Create a new Game
      </router-link>

      <router-link to="/join-exchange" class="button">
        Join a Game
      </router-link>

      <router-link to="/choose-exchange" class="button">
        View my Games
      </router-link>
    </div>
  </main>
</template>
