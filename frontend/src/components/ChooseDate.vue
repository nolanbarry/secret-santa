<script setup lang="ts">
import { ref } from 'vue'

let chosenDate = ref();
</script>

<template>
  <div class="date-picker-div">
    <input type="date" v-model="chosenDate" class="date-picker" @input="$emit('chosen-date', chosenDate)" />
  </div>
</template>

<style>
.date-picker {
  border: none;
  padding: 1.2em;
  margin-top: 1em;
}

.date-picker::-webkit-calendar-picker-indicator {
  cursor: pointer;
}
</style>
