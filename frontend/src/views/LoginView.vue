<script setup lang="ts">
import router from '@/router';
import AuthService from '@/services/AuthService';
import TitleLogo from '../components/TitleLogo.vue'

const login = () => {
    AuthService.login();
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
            <button @click="login" class="button">
                Login
            </button>
        </div>
    </main>
</template>