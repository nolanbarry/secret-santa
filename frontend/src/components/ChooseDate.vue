<template>
  <div class = "column:grid-7 center:grid-items">
    <div v-for="cal in calendar" :key="cal" class="padding-2">({cal})</div>
  </div>
</template>


<script>
import {defineComponent, ref} from 'vue'
import {$date as useDate} from '../assets/alga.min.js'

export default defineComponent({
  name: 'ChooseDate',
  setup() {
    const year = ref(0)
    const month = ref(0)

    const dateNow = new Date()
    year.value = dateNow.getFullYear()
    month.value = Number(dateNow.getMonth())

    const calendar = useDate.calendar(year.value, month.value)

    return {
      calendar
    }

  }
})
</script>

