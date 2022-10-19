<script setup lang="ts">
    import router from '@/router';
    import TitleLogo from '../components/TitleLogo.vue';
    import { loginUser, login } from '@/services/Network';

    const loginHandler = async () => {

        await loginUser();

        let data = await login();
        console.log(data);

        // Head to OTP Page to submit
        router.push('/otp')
    }
</script>

<template>
    <main>
        <TitleLogo />
        <div class="text-input-div">
            <input class="text-input"
                type="text" 
                placeholder="Enter your Email" 
                v-model="name" />
        </div>
        <div class="button-div">
            <button @click="loginHandler" class="button">
                Login
            </button>
        </div>
    </main>
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