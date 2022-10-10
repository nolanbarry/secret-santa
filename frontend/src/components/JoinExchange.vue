<script setup lang="ts">
</script>
    
<template>
    <div class="text-input-div">
        <p>Enter exchange code:</p>
        <input type="text" 
            placeholder="Exchange code" 
            v-model="name" />
        <p>Enter your name:</p>
        <input type="text" 
            placeholder="Your name" 
            v-model="name" />
    </div>
    <div class="button-div">
        <router-link to="/" class="button">
            Join Exchange
        </router-link>
    </div>
</template>

<style scoped lang="scss">

    .text-input-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }
</style>