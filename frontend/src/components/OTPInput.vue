<script setup lang="ts">
</script>
    
<template>
    <div class="text-input-div">
        <input type="text" 
            placeholder="Code from email" 
            v-model="name" />
    </div>
    <div class="button-div">
        <router-link to="/" class="button">
            Continue
        </router-link>
    </div>
</template>

<style scoped lang="scss">

    .text-input-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding-bottom: 30px
    }
</style>