<script setup lang="ts">
import HamburgerPopout from '@/components/HamburgerPopout.vue';
import { getGame, getPlayer, getGamePlayers, startGame } from '@/services/Network';
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();

let exchange = ref();
let assignedTo = ref();
let hasAssignment = ref(false);
let gameid = <string>route.params.gameid;
let displayName = history.state.displayName;
let exchangePlayers = ref();

let buttonLoading = ref(false);
let loading = ref(true);

let errorMessageSet = ref(false)
let errorMessage = ref("")

let isHost = ref(false)

const getExchange = async () => {
  let exchange_data = await getGame(gameid);
  let player_data = await getPlayer(gameid, displayName);
  errorMessageSet.value = false;

  if (exchange_data.success == false || player_data.success == false) {
    errorMessageSet.value = true;
    errorMessage.value = "There was an error loading your gift exchange. Please refresh and try again."
  }

  exchange.value = {
    playerId: player_data.player.id,
    gameCode: exchange_data.game.code,
    displayName: player_data.player.displayName,
    exchangeName: exchange_data.game.displayName,
    hostName: exchange_data.game.hostName,
    started: exchange_data.game.started,
    exchangeDate: exchange_data.game?.exchangeDate
  }
  assignedTo.value = player_data.player.assignedTo;
  if (player_data.player.assignedTo) {
    hasAssignment.value = true;
  }
  if (exchange.value.hostName === exchange.value.displayName) {
    isHost.value = true;
  }

  let list_of_players = await getGamePlayers(gameid);
  if (list_of_players.success == false) {
    errorMessageSet.value = true;
    errorMessage.value = "There was an error loading the players in your gift exchange. Please refresh and try again."
  }
  exchangePlayers.value = list_of_players.players;
  loading.value = false;
}

getExchange();

const startExchange = async () => {
  buttonLoading.value = true;
  let data = await startGame(gameid);

  errorMessageSet.value = false

  if (data.success == false) {
    errorMessageSet.value = true
    errorMessage.value = "There was an error sending out gift assignments. Please refresh the page and try again."
    buttonLoading.value = false
  } else {
    let player_data = await getPlayer(gameid, displayName);

    if (player_data.success == false) {
      errorMessageSet.value = true;
      errorMessage.value = "There was an error retrieving your gift assignment. Please refresh the page and try again."
    } else {
      if (player_data.player.assignedTo) {
        hasAssignment.value = true;
        assignedTo.value = player_data.player.assignedTo;
      }
    }

    buttonLoading.value = false

  }
}
</script>

<template>
  <div>
    <HamburgerPopout />
    <main class="content-wrapper">
      <div v-if="loading" class="loading-spinner" id="loading"></div>
      <div v-else>
        <div class="title-wrapper">
          <header class="exchange-title">
            {{ exchange?.exchangeName }}
          </header>
        </div>
        <div class="column-item-wrapper">
          <h1 class="exchange-date">
            {{ exchange?.exchangeDate }}
          </h1>
        </div>
        <div class="column-item-wrapper">
          <div class="assignment-div">
            <p class="assignment-label">
              {{ exchange?.displayName }}'s Assignment:
            </p>
            <p class="assignment">
              <em v-if="hasAssignment">{{ assignedTo }}</em>
              <em v-else>Pending</em>
            </p>
          </div>
          <button @click="startExchange" class="assignment-button" v-if="isHost">
            <div v-if="!buttonLoading">Send out Assignments</div>
            <div v-if="buttonLoading" class="button-loading-spinner" id="loading"></div>
          </button>
        </div>
        <div class="column-item-wrapper">
          <h2>
            Join Code: {{ exchange?.gameCode }}
          </h2>
        </div>
        <div class="player-list-div">
          <h2 class="player-list-label">
            Player List:
          </h2>
        </div>
        <div class="column" v-for="player in exchangePlayers">
          <p v-if="player.displayName === exchange.hostName">{{ player.displayName }} (Host)</p>
          <p v-else>{{ player.displayName }}</p>
        </div>
      </div>
    </main>
    <ErrorMessage v-if="errorMessageSet">
      <template #message>
        {{ errorMessage }}
      </template>
    </ErrorMessage>
  </div>
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

.column-item-wrapper {
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
}

.assignment-div {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: space-evenly;

  margin-top: 1rem;
  margin-bottom: 1rem;

  border: none;
  background-color: #D9D9D9;
  // box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  // border-radius: 18px;
  width: 25em;
  // padding: 0.3em;
  padding: 1em;

}

.assignment-label {
  text-decoration: none;
  color: black;
  font-family: 'Inter' sans-serif;
  font-size: 1.2rem;
  justify-content: center;
}

.assignment {
  text-decoration: none;
  color: black;
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

.assignment-button {
  margin: 1.5rem;
  margin-top: 0.5rem;

  // background-color: #D9D9D9;

  width: 12em;
  height: 2em;
  padding: 0.2em;
  text-align: center;
  text-decoration: none;
  font-family: 'Inter' sans-serif;
  font-size: 1rem;
  justify-content: center;
  align-items: center;

  display: flex;

  border: none;
  background-color: #A74141;
  box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
  border-radius: 40px;
  
  color: white;
  cursor: pointer;
}

.assignment-button:active {
  transform: scale(0.98);
  /* Scaling button to 0.98 to its original size */
  box-shadow: 3px 2px 22px 1px rgba(0, 0, 0, 0.24);
  /* Lowering the shadow */
}
</style>
