<script setup lang="ts">
</script>
    
<template>
    <div class="button-div">
        <router-link to="/login" class="button">
            Create a new Game
        </router-link>

        <router-link to="/login" class="button">
            Join a Game
        </router-link>

        <router-link to="/login" class="button">
            View my Games
        </router-link>
    </div>
</template>

<style scoped lang="scss">

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
  
    