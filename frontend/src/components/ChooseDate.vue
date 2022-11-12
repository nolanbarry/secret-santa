<script setup lang="ts">
</script>

<template>
  <div class="date-picker-div">
    <input type="date" class="date-picker" />
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
