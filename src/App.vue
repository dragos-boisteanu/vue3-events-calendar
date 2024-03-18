<script setup>
import {computed, ref} from "vue";

const months = [
  { id: 0, name: 'January' },
  { id: 1, name: 'February' },
  { id: 2, name: 'March' },
  { id: 3, name: 'April' },
  { id: 4, name: 'May' },
  { id: 5, name: 'June' },
  { id: 6, name: 'July' },
  { id: 7, name: 'August' },
  { id: 8, name: 'September' },
  { id: 9, name: 'October' },
  { id: 10, name: 'November' },
  { id: 11, name: 'December' }
];

const days = [
  {
    id:'0',
    name: 'Monday',
    short: "Mon"
  },
  {
    id:'1',
    name: "Tuesday",
    short: 'Tues'
  },
  {
    id:'2',
    name: 'Wednesday',
    short: 'Wed'
  },
  {
    id:'3',
    name: 'Thursday',
    short: 'Thurs'
  },
  {
    id:'4',
    name: 'Friday',
    short: 'Fri',
  },
  {
    id:'5',
    name: 'Saturday',
    short: 'Sat',
  },
  {
    id:'6',
    name: 'Sunday',
    short: 'Sun'
  }
]

const today = new Date()

const currentDate = ref(new Date())

const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())
const weekDayOfFirstDayOfMonth = computed(() => {
  const firstDayOfMonth =  new Date(year.value, month.value, 1)
  return firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
})

/*const weekDayOfLastDayOfMonth = computed(() => {
  const lastDayOfMonth =  new Date(year.value, month.value + 1, 0)
  return lastDayOfMonth.getDay() === 0 ? 6 : lastDayOfMonth.getDay() - 1
})*/
const monthDays = computed(() => new Date(year.value, month.value + 1, 0).getDate())

// TODO: better name for this computed
const dayMonthYear = computed(() => {
  const foundMonth = months.find(m => m.id === month.value)
  const monthName = foundMonth.name

  return ` ${monthName}, ${year.value}`
})

const prevMonth = () => currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1 )
const nextMonth = () => {
  currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1 )
}
const setToday = () => currentDate.value = today

const isCurrentDay = (day) => {
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const currentMonth = currentDate.value.getMonth()

  let isToday = false

  if(todayDate === day && currentMonth === todayMonth) isToday = true

  return isToday
}
</script>

<template>
  <div class="size-full">
    <div class="flex items-center justify-between bg-orange-500 p-4">
      <div class="flex items-center gap-x-4 bg-white">
        <div>
          <button @click="prevMonth"> Prev</button>
          <button @click="nextMonth"> Next </button>
        </div>
        <button @click="setToday">Today</button>
      </div>
      <div class="bg-white">
        {{ dayMonthYear }}
      </div>
      <div class="flex items-center bg-white">
        <button>month</button>
        <button>week</button>
        <button>day</button>
        <button>list</button>
      </div>
    </div>
    <div class="grid grid-cols-7">
      <div v-for="day in days" :key="day.id" class="text-center p-2">
        {{ day.short}}
      </div>
    </div>
    <div class="grid grid-cols-7 size-full">
      <div v-for="day in weekDayOfFirstDayOfMonth" :key="day" class="day day--empty">

      </div>
      <div v-for="day in monthDays" :key="day" class="day">
        <div class="header" :class="{'current-day': isCurrentDay(day)}" >{{day}}</div>
        <div class="content">
          <slot/>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.day {
  @apply border;

}

.day--empty {
  @apply bg-gray-50
}
.day .header {
  @apply text-center p-2 text-sm  border-b
}

.current-day {
  @apply font-bold
}
</style>
