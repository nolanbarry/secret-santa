<script setup lang="ts">
import { getPlayers, getGame, endGame } from '@/services/Network';
import { ref } from 'vue'
import ErrorMessage from '../components/ErrorMessage.vue';
import HamburgerPopout from '../components/HamburgerPopout.vue';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';

let exchanges = ref();
let loading = ref(true);
let noExchanges = ref(false);

let errorMessageSet = ref(false);
let errorMessage = ref("");

const getExchanges = async () => {
  let playersData = await getPlayers();
  errorMessageSet.value = false;

  if (playersData.success == false) {
    errorMessageSet.value = true;
    errorMessage.value = "There was an error loading your gift exchanges. Please refresh and try again."
  }

  if (playersData.players.length <= 0) {
    noExchanges.value = true;
  } else {
    noExchanges.value = false;
  }

  let data = []
  for (const i in playersData.players) {
    let gameData = await getGame(playersData.players[i].gameCode)
    if (gameData.success == false) {
      errorMessageSet.value = true;
      errorMessage.value = "There was an error loading your gift exchanges. Please refresh and try again."
    }
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
  loading.value = false;
}

getExchanges();

const deleteExchange = async (exchangeCode: string) => {
  loading.value = true;
  let data = await endGame(exchangeCode);
  await getExchanges();
  loading.value = false;
}

</script>
  
<template>
  <main>
    <HamburgerPopout />
    <div class="title-wrapper">
      <header class="title">
        Choose Your Exchange
      </header>
    </div>
    <div class="choose-button-div">
      <div v-if="loading" class="loading-spinner" id="loading"></div>
      <div v-else>
        <div v-for="exchange in exchanges">
          <div class="choose-button-container">
            <router-link class="choose-button"
              :to="{ name: 'userView', params: { gameid: exchange.gameCode }, state: { displayName: exchange.displayName } }">
              {{ exchange.exchangeName }}: {{ exchange.displayName }}
            </router-link>
            <button class="trash-can" v-if="(exchange.hostName == exchange.displayName)"
              @click="deleteExchange(exchange.gameCode)">
              <font-awesome-icon icon="fa-solid fa-trash-can" />
            </button>
          </div>
        </div>
      </div>
      <h2 v-if="(noExchanges && !loading)">
        Use the menu to add your first Gift Exchange!
      </h2>
    </div>

    <ErrorMessage v-if="errorMessageSet">
      <template #message>
        {{ errorMessage }}
      </template>
    </ErrorMessage>
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
  text-decoration: none;
  color: black;

  font-family: 'Inter' sans-serif;
  font-size: 1rem;
  text-align: center;
  flex-grow: 1;
  padding: 1rem;
}

.choose-button-container {
  margin-top: 2rem;

  width: 25em;


  border: none;
  background-color: #D9D9D9;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);

  display: flex;
  flex-direction: row;
  align-items: center;

  cursor: pointer;

}

.trash-can {
  flex-grow: 0;
  padding: 1rem;

  font-size: 1.25rem;

  background-color: #D9D9D9;
  border: none;

  cursor: pointer;
}
</style>
