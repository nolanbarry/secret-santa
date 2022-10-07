<script setup lang="ts">
</script>
    
<template>
    <div class="text-input-div">
        <p>Enter game code:</p>
        <input type="text" 
            placeholder="Game code" 
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

    .button-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .button {
        margin-top: 2rem;
        display: flex;

        border: none;
        background-color: #A74141;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 40px;
        width: 20em;
        padding:1em;

        text-decoration: none;
        color: white;
        font-family: 'Inter' sans-serif;
        font-size: 1rem;
        justify-content: center;

        cursor: pointer;
    }
</style>