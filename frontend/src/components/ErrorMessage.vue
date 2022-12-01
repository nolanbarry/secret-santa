<script setup lang="ts">
</script>
    
<template>
    <div class="container">
        <div class="error-box">
            <div class="error-text">
                <slot name="message"></slot>
            </div>
        </div>
    </div>
</template>

<style>
.container {
    display: flex;
    justify-content: center;
}

.error-box {
    display: flex;
    background-color: #FFE0E0;
    margin: 2rem;
    width: 30em;
    justify-content: center;
    align-items: center;
    padding: 1rem;
    border-radius: 5px;
}

.error-text {
    color: red;
    text-align: center;
}
</style>