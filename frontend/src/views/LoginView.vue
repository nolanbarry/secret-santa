<script setup lang="ts">
import router from '@/router';
import TitleLogo from '../components/TitleLogo.vue';
import { login } from '@/services/Network';
import { ref } from 'vue'

let loading = ref(false)
let userEmail = ref()

const loginHandler = async () => {
    loading.value = true;
    let data = await login(userEmail.value);
    let userid = data.userId
    router.push({ name: "otp", state: { userid } })
}
</script>

<template>
    <main>
        <TitleLogo />
        <div class="text-input-div">
            <input class="text-input" type="text" v-model="userEmail" placeholder="Enter your Email" />
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
</style>