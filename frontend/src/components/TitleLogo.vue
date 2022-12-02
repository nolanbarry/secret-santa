<script setup lang="ts">
</script>
    
<template>
    <div class="title-wrapper">
        <header class="title">
            Secret Santa
        </header>
    </div>
</template>

<style lang="scss">
$mobile-threshold: 800px;

.title {
    font-family: 'Coiny';
    font-style: normal;
    font-weight: 400;
    font-size: 5rem;
    color: #FFFFFF;
    -webkit-text-stroke: 0.27rem #A74141;
    flex-wrap: wrap;

    @media screen and (max-width: $mobile-threshold) {
        font-size: 3rem;
        -webkit-text-stroke: 0.2rem #A74141;
    }
}

.title-wrapper {
    display: flex;
    justify-content: center;
    text-align: center;
}
</style>