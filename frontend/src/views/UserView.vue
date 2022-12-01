<script setup lang="ts">
import HamburgerPopout from '@/components/HamburgerPopout.vue';
import { getGame, getPlayer, getGamePlayers } from '@/services/Network';
import { ref } from 'vue'
import { useRoute } from 'vue-router'
import ErrorMessage from '@/components/ErrorMessage.vue';

const route = useRoute();

let exchange = ref();
let hasAssignment = ref(false);
let gameid = <string>route.params.gameid;
let displayName = history.state.displayName;
let exchangePlayers = ref();
let loading = ref(true);

let errorMessageSet = ref(false)
let errorMessage = ref("")

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
    assignedTo: player_data.player.assignedTo,
    exchangeName: exchange_data.game.displayName,
    hostName: exchange_data.game.hostName,
    started: exchange_data.game.started,
    exchangeDate: exchange_data.game?.exchangeDate
  }
  if (player_data.player.assignedTo) {
    hasAssignment.value = true;
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
              <em v-if="hasAssignment">{{ exchange?.assignedTo }}</em>
              <em v-else>Pending</em>
            </p>
          </div>
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
          <p>{{ player.displayName }}</p>
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
