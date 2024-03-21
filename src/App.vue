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

const days =[
  {
    id: 1,
    name: 'Monday',
    short: "Mon",
    date: ''
  },
  {
    id: 2,
    name: "Tuesday",
    short: 'Tues',
    date: ''
  },
  {
    id: 3,
    name: 'Wednesday',
    short: 'Wed',
    date: ''
  },
  {
    id: 4,
    name: 'Thursday',
    short: 'Thurs',
    date: ""
  },
  {
    id: 5,
    name: 'Friday',
    short: 'Fri',
    date: "",
  },
  {
    id: 6,
    name: 'Saturday',
    short: 'Sat',
    date: ""
  },
  {
    id:  0,
    name: 'Sunday',
    short: 'Sun',
    date: ""
  },

]

const hours24 = ['00', '01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12', '13', '14', '15',
  '16', '17', '18', '19', '20', '21', '22', '23']
const hours12 = ['12am', '1am', '2am', '3am', '4am', '5am', '6am', '7am', '8am', '9am', '10am', '11am', '12pm',
  '1pm', '2pm', '3pm', '4pm', '5pm', '6pm', '7pm', '8pm', '9pm', '10pm', '11pm']

const today = new Date()

const modes = ['month', 'week', 'day', 'list']
const mode = ref(modes[0])

const currentDate = ref(new Date())


const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())

// TODO: find a better name for this computed
// it represents the days of prev month that are
// overlapping with the current month calendar
const weekDayOfFirstDayOfMonth = computed(() => {
  const firstDayOfMonth =  new Date(year.value, month.value, 1)
  return firstDayOfMonth.getDay() === 0 ? 6 : firstDayOfMonth.getDay() - 1
})

/*const weekDayOfLastDayOfMonth = computed(() => {
  const lastDayOfMonth =  new Date(year.value, month.value + 1, 0)
  return lastDayOfMonth.getDay() === 0 ? 6 : lastDayOfMonth.getDay() - 1
})*/
const monthDays = computed(() => new Date(year.value, month.value + 1, 0).getDate())


const getTitleForDay = (includeMonthName) => {
  let day = ''

  if(mode.value === modes[2]) {
    const dayOfTheWeek = currentDate.value.getDay()
    const dayOfWeek = days.find(day => day.id === dayOfTheWeek)

    if(includeMonthName) {
      const foundMonth = months.find(m => m.id === month.value)
      const monthName = foundMonth.name
      day = ` ${currentDate.value.getDate()} ${monthName}, ${year.value}`
    } else {
      day = `${dayOfWeek.name}`
    }
  }

  return day
}

const daysTitle = computed(() => {
  let titles = []
  switch(mode.value) {
      // month
    case modes[0]: titles = days.map(day => day.short); break
      // week
    case modes[1]: titles = days.map(day => `${day.short}`); break
      // day
    case modes[2]: titles.push(getTitleForDay()) ; break;
  }

  return titles
})

// TODO: better name for this computed
const title = computed(() => {
  let title = ''

  switch(mode.value) {
      // month
    case modes[0]: {
      const foundMonth = months.find(m => m.id === month.value)
      const monthName = foundMonth.name
      title = `${monthName}, ${year.value}`
      break
    }
      // week
    case modes[1]: {
    title = 'week title'
    } break
      // day
    case modes[2]: {
      title = getTitleForDay(true)
      break
    }
  }

  return title
})

const previous = () => {
  switch(mode.value) {
    // month
    case modes[0]: currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1 ); break
    // week
    case modes[1]: console.log('prev week'); break
    // day
    case modes[2]: currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(),currentDate.value.getDate() - 1); break
  }
}
const next = () => {
  switch (mode.value) {
    // month
    case modes[0]: currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1 ); break
    // week
    case modes[1]: console.log('next week'); break
    // day
    case modes[2]: currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() ,currentDate.value.getDate() + 1); break
  }
}
const setToday = () => currentDate.value = today

const setMode = (m) => mode.value = m
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
          <button @click="previous"> Prev</button>
          <button @click="next"> Next </button>
        </div>
        <button @click="setToday">Today</button>
      </div>
      <div class="bg-white">
        {{ title }}
      </div>
      <div class="flex items-center bg-white gap-x-2">
        <button v-for="(mode, index) in modes" :key="index" @click="setMode(mode)" class="capitalize">{{ mode }}</button>
      </div>
    </div>
    <div class="grid" :class="{
      'grid-cols-7': mode === modes[0] || mode === modes[1],
      'grid-cols-1': mode === modes[2] || mode === modes[3]
    }">
      <div v-for="(day, index) in daysTitle" :key="index" class="text-center p-2">
        {{ day }}
      </div>
    </div>
    <div class="grid size-full" :class="{
      'grid-cols-7': mode === modes[0] || mode === modes[1],
      'grid-cols-1': mode === modes[2] || mode === modes[3]
    }">
<!--      week structure  -->
      <template v-if="mode === modes[0]">
        <div v-for="day in weekDayOfFirstDayOfMonth" :key="day" class="day day--empty">
        </div>

        <div v-for="day in monthDays" :key="day" class="day">
          <div class="header" :class="{'current-day': isCurrentDay(day)}" >{{day}}</div>
          <div class="content">
            <slot/>
          </div>
        </div>
      </template>

<!--      day structure -->
      <template v-if="mode === modes[2]">
        <div class="flex size-full">
          <div class="w-full">
            <div class="w-full border justify-stretch flex items-start">
              <div class="border-r p-2 w-24 text-center">All day</div>
              <div class="w-full flex-1 basis-full px-2">event</div>
            </div>
            <div class="border flex items-start" v-for="(time, index) in hours24" :key="index">
              <div class="border-r p-2 w-24 text-center">{{ time }}</div>
              <div class="w-full flex-1 basis-full flex px-2">event</div>
            </div>
          </div>
        </div>
      </template>
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
