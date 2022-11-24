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
        <div class="row">
            <div class="col">
                <h1 class="exchange-date">
                  12/25/22
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
      <p class="assignment-label">
        Your Assignment: 
      </p>
      <p class="assignment">
        <em>Pending</em>
      </p>
    </div>
    <div class="assignment-button">
      <p>
        Send out Assignments
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

.row {
  justify-content: center;
}

.col {
  display: inline-block;
  padding: 1rem 1rem;
  vertical-align: middle;
  position: middle;
  justify-content: center;
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

.assignment-button {
  margin: 1.5rem;
  margin-top: 0.5rem;
  vertical-align: middle;

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
