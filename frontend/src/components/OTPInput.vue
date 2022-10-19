<script setup lang="ts">
    import router from '@/router';

    const submitOTPHandler = async () => {

        //Go to '/defaultpath' if no redirectPath value is set
        router.push(sessionStorage.getItem('redirectPath') || '/');

        //Cleanup redirectPath
        sessionStorage.removeItem('redirectPath');
    }
</script>
    
<template>
    <div class="text-input-div">
        <input class="text-input"
            type="text" 
            placeholder="Code from email" 
            v-model="name" />
    </div>
    <div class="button-div">
        <button @click="submitOTPHandler" class="button">
            Continue
        </button>
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