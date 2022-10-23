<script setup lang="ts">
import router from '@/router';
import TitleLogo from '../components/TitleLogo.vue';
import { loginUser, login } from '@/services/Network';
import { ref } from 'vue'

let loading = ref(false)

const loginHandler = async () => {
    loading.value = true;
    await loginUser();
    let data = await login();
    console.log(data);
    // Head to OTP Page to submit
    router.push("/otp");
}
</script>

<template>
    <main>
        <TitleLogo />
        <div class="text-input-div">
            <input class="text-input" type="text"
                placeholder="Enter your Email" />
        </div>
        <div class="button-div">
            <button @click="loginHandler" class="button">
                <div v-if="!loading">Login</div>
                <div v-if="loading" class="button-loading-spinner" id="loading">
                </div>
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

.loading-bar-div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}
</style>