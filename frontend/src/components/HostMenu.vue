<script setup lang="ts">
</script>
    
<template>
    <div class="title-wrapper">
        <header class="title">
            Exchange Name
        </header>
    </div>
    <div class="exchange-date-wrapper">
        <div class="row">
            <div class="col">
                <h1 class="exchange-date">
                    Exchange Date
                </h1>
            </div>
            <div class="col">
                <p class="date-button">
                Change Date
                </p>
            </div>        
        </div>
    </div>
    <div class="assignment-div">
        <div class="row">
            <div class="col">
                <p class="assignment">
                Your Assignment: <em id="emphasized">Pending</em>
                </p>
            </div>
            <div class="col">
                <p class="assignment-button">
                Send out Assignments
                </p>
            </div>        
        </div>
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

    .date-button {
        display: flex;

        border: none;
        background-color: #D9D9D9;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        /* border-radius: 40px; */
        width: 8em;
        height: 2em;
        padding:0.2em;

        text-align: center;
        text-decoration: none;
        color: black;
        font-family: 'Inter' sans-serif;
        font-size: 1rem;
        justify-content: center;

        cursor: pointer;
    }

    .date-button:active {
        transform: scale(0.98);
        /* Scaling button to 0.98 to its original size */
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
        /* Lowering the shadow */
    }

    .col {
        display: inline-block;
        padding: 1rem 1rem;
        vertical-align: middle;
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

    .assignment-button {
        margin-top: 2rem;
        display: flex;

        border: none;
        background-color: #D9D9D9;
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        /* border-radius: 40px; */
        width: 12em;
        height: 2em;
        padding:0.2em;

        text-align: center;
        text-decoration: none;
        color: black;
        font-family: 'Inter' sans-serif;
        font-size: 1rem;
        justify-content: center;

        cursor: pointer;
    }

    .assignment-button:active {
        transform: scale(0.98);
        /* Scaling button to 0.98 to its original size */
        box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
        /* Lowering the shadow */
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