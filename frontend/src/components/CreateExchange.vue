<script setup lang="ts">
</script>
    
<template>
  <div class="text-input-div">
    <p>Enter a name for your new exchange:</p>
    <input class="text-input" type="text" placeholder="Exchange name"
      v-model="name" />
    <p>Enter your name:</p>
    <input class="text-input" type="text" placeholder="Your name"
      v-model="name" />
  </div>
  <div class="date-picker-div">
    <p>Choose a date for your exchange:</p>
    <!-- <vue-englishdatepicker placeholder="YYYY-MM-DD" /> -->
    <!-- <Datepicker :format="customDate" :value="time" :inline="true"></Datepicker> -->
    <input type="text" placeholder="Exchange date" v-model="date" />
  </div>
  <div class="button-div">
    <router-link to="/" class="button">
      Create Exchange
    </router-link>
  </div>
</template>

<!-- <script>
import VueEnglishdatepicker from 'vue-englishdatepicker';
  export default {
    name: "Datepick",
    components: {
      VueEnglishdatepicker
    },
    data() {
      return {
        customDate: new Date()
      }
    }
  }
</script> -->

<style scoped lang="scss">
.text-input-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}

.date-picker-div {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
</style>