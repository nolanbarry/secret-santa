<script setup lang="ts">
import { getPlayers, getGame } from '@/services/MockNetwork';
import type { Player } from "@/model/network-models";
import { ref } from 'vue'

let exchanges = ref();

const getExchanges = async () => {
  let playersData = <[Player]>await getPlayers();
  let data = []
  for (const i in playersData) {
    let gameData = await getGame(playersData[i].gameCode)
    let exchange = {
      playerId: playersData[i].id,
      gameCode: gameData?.code,
      displayName: playersData[i].displayName,
      assignedTo: playersData[i].assignedTo,
      exchangeName: gameData?.displayName,
      hostName: gameData?.hostName,
      started: gameData?.started,
      exchangeDate: gameData?.exchangeDate
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
          :to="{ name: 'userView', params: { gameid: exchange.gameCode } }"
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
