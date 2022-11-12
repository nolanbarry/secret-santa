<script setup lang="ts">
import HamburgerPopout from '@/components/HamburgerPopout.vue';

</script>

<template>
  <HamburgerPopout></HamburgerPopout>
  <main class="content-wrapper">
    <div class="title-wrapper">
      <header class="exchange-title">
        Smith Family Gift Exchange
      </header>
    </div>
    <div class="exchange-date-wrapper">
      <h1 class="exchange-date">
        12/25/22
      </h1>
    </div>
    <div class="assignment-div">
      <p class="assignment-label">
        Your Assignment: 
      </p>
      <p class="assignment">
        <em>Pending</em>
      </p>
    </div>
    <div>
      <h2>
        Join Code: ABC123
      </h2>
    </div>
    <div class="player-list-div">
      <h2 class="player-list-label">
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
  </main>
</template>

<style lang="scss">

.content-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
}

.exchange-title {
  font-family: 'Coiny';
  font-style: normal;
  font-weight: 400;
  font-size: 3rem;
  color: #FFFFFF;
  -webkit-text-stroke: 0.21rem #A74141;
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

.exchange-date {
  text-decoration: none;
  color: black;
  font-family: 'Inter' sans-serif;
  font-size: 1.5rem;
  justify-content: center;
  // font-weight: bold;
}

.assignment-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;
  
  margin-top: 1rem;
  margin-bottom: 1rem;

  border: none;
  background-color: #A74141;
  // box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 18px;
  width: 25em;
  padding: 0.3em;
}

.assignment-label {
  text-decoration: none;
  color: white;
  font-family: 'Inter' sans-serif;
  font-size: 1.2rem;
  justify-content: center;
}

.assignment {
  text-decoration: none;
  color: white;
  font-family: 'Inter' sans-serif;
  font-size: 1.2rem;
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

.player-list-label {
  padding-top: 30px;
  text-decoration: none;
  color: black;
  // font-family: 'Inter' sans-serif;
  font-family: 'Coiny';

  font-size: 1.5rem;
  text-align: center;
  justify-content: center;
  margin-bottom: 0.5rem;
}

.column {
  text-align: center;
  color: black;
  font-family: 'Inter' sans-serif;
  font-size: 1.3rem;
  justify-content: center;
  margin-right: 5rem;
  margin-left: 5rem;
}

.row {
  display: flex;
  flex-direction: row;
}
</style>
