<script setup lang="ts">
import { getPlayers, getGame } from '@/services/Network';
import { ref } from 'vue'

let exchanges = ref();

const getExchanges = async () => {
  let playersData = await getPlayers();
  let data = []
  for (const i in playersData.players) {
    let gameData = await getGame(playersData.players[i].gameCode)
    let exchange = {
      playerId: playersData.players[i].id,
      gameCode: gameData.game?.code,
      displayName: playersData.players[i].displayName,
      assignedTo: playersData.players[i].assignedTo,
      exchangeName: gameData.game?.displayName,
      hostName: gameData.game?.hostName,
      started: gameData.game?.started,
      exchangeDate: gameData.game?.exchangeDate
    }
    data.push(exchange)
  }
  exchanges.value = data
}

getExchanges();

</script>
  
<template>
  <main>
    <div class="title-wrapper">
      <header class="title">
        Choose Your Exchange
      </header>
    </div>
    <div class="choose-button-div">
      <div v-for="exchange in exchanges">
        <router-link
          :to="{ name: 'userView', params: { gameid: exchange.gameCode }, state: { displayName: exchange.displayName } }"
          class="choose-button">
          {{ exchange.exchangeName }}: {{ exchange.displayName }}
        </router-link>
      </div>
    </div>
  </main>
</template>

<style>
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

.choose-button-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.choose-button {
  margin-top: 2rem;
  display: flex;

  border: none;
  background-color: #D9D9D9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  /* border-radius: 40px; */
  width: 20em;
  padding: 1em;

  text-decoration: none;
  color: black;
  font-family: 'Inter' sans-serif;
  font-size: 1rem;
  justify-content: center;

  cursor: pointer;
}
</style>
