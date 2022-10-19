<script setup lang="ts">
    import router from '@/router';
    import TitleLogo from '../components/TitleLogo.vue';
    import { loginUser, login } from '@/services/Network';

    const loginHandler = async () => {
        await loginUser();

        let data = await login();
        console.log(data);

        //Go to '/defaultpath' if no redirectPath value is set
        router.replace(sessionStorage.getItem('redirectPath') || '/');

        //Cleanup redirectPath
        sessionStorage.removeItem('redirectPath');
    }
</script>

<template>
    <main>
        <TitleLogo />
        <div class="button-div">
            <button @click="loginHandler" class="button">
                Login
            </button>
        </div>
    </main>
</template>