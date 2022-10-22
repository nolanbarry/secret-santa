<script setup lang="ts">
</script>
    
<template>
    <div class="title-wrapper">
        <header class="title">
            Exchange Name
        </header>
    </div>
    <div class="exchange-date-wrapper">
        <h1 class="exchange-date">
            Exchange Date
        </h1>
    </div>
    <div class="assignment-div">
        <p class="assignment">
            Your Assignment: <em id="emphasized">Pending</em>
        </p>
    </div>
    <div class="player-list-div">
        <h2 class="player-list">
            Player List:
        </h2>
    </div>
    <div class="row">
        <div class="column">
            <p>Player 1</p>
            <p>Player 2</p>
            <p>Player 3</p>
            <p>Player 4</p>
        </div>
        <div class="column">
            <p>Player 5</p>
            <p>Player 6</p>
            <p>Player 7</p>
            <p>Player 8</p>
        </div>
    </div>
</template>

<style scoped lang="scss">
    .title {
        font-family: 'Coiny';
        font-style: normal;
        font-weight: 400;
        font-size: 4rem;
        color: #FFFFFF;
        -webkit-text-stroke: 0.27rem #A74141;
        flex-wrap: wrap;
    }

    .title-wrapper {
        display: flex;
        justify-content: center;
        text-align: center;
    }

    .exchange-date-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .exchange-date{
        text-decoration: none;
        color: black;
        font-family: 'Inter' sans-serif;
        font-size: 1.7rem;
        justify-content: center;
    }

    .assignment-div {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
    }

    .assignment {
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
    }

    #emphasized {
        padding-left: 12px
    }

    .player-list-wrapper {
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        padding: 30px
    }

    .player-list{
        padding-top: 30px;
        text-decoration: none;
        color: black;
        font-family: 'Inter' sans-serif;
        font-size: 1.5rem;
        text-align: center;
        justify-content: center;
    }

    .column{
        text-align: center;
        color: black;
        font-family: 'Inter' sans-serif;
        font-size: 1.3rem;
        justify-content: center;
    }
</style>