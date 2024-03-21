<script setup>
import {computed, ref} from "vue";

const months = [
  { id: 0, name: 'January'},
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
const modes = {
  Month: 'month',
  Week: 'week',
  Day: 'day',
  List: 'list'
}


const today = new Date()

const mode = ref(modes.Month)

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

const monthDays = computed(() => {
  if(mode.value !== modes.Month) return

  const firstMonthDate = new Date(year.value, month.value , 1)
  const lastMonthDate =  new Date(year.value, month.value + 1, 0)
  const days = []

  while(firstMonthDate < lastMonthDate) {
    const date = new Date(firstMonthDate)
    days.push({
      id: date.getDate(),
      date,
      events: []
    })

    firstMonthDate.setDate(firstMonthDate.getDate() + 1)
  }

  return days

})

const firstWeekDay = computed( () => {
  const day = currentDate.value.getDate() - currentDate.value.getDay()+ (currentDate.value.getDay() === 0 ? -6:1)
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day)
})
const lastWeekDay = computed(() => {
  return new Date(new Date(currentDate.value.setDate(currentDate.value.getDate()
      - currentDate.value.getDay() +7)))
})


const weekDays = computed(() => {
  if(mode.value !== modes.Week) return

  let result = []

  const firstDate = new Date(firstWeekDay.value)
  while(firstDate < lastWeekDay.value) {
    const dayOfWeek = days.find(day => firstDate.getDay() === day.id)
    const name = `${dayOfWeek.short} ${firstDate.getDate() }/${firstDate.getMonth() + 1}`

    result.push({
      id: dayOfWeek.id,
      name,
      date: new Date(firstDate),
      events: []
    })
    firstDate.setDate(firstDate.getDate() + 1)
  }

  return result
})

const getTitleForDay = (includeMonthName) => {
  let day = ''

  if (mode.value === modes.Week) {

  } else if (mode.value === modes.Day) {
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
    case modes.Month: titles = days.map(day => day.short); break
    case modes.Day: titles.push(getTitleForDay()) ; break;
  }

  return titles
})
const title = computed(() => {
  let title = ''

  switch(mode.value) {
    case modes.Month: {
      const foundMonth = months.find(m => m.id === month.value)
      const monthName = foundMonth.name
      title = `${monthName}, ${year.value}`
      break
    }
    case modes.Week: {
      const startMonthName = months.find(month => month.id === firstWeekDay.value.getMonth()).name
      const endMonthName = months.find(month => month.id === lastWeekDay.value.getMonth()).name

      title = `${firstWeekDay.value.getDate()} ${startMonthName} - ${lastWeekDay.value.getDate()} ${endMonthName}, ${year.value}`
      break
    }
    case modes.Day: {
      title = getTitleForDay(true)
      break
    }
  }

  return title
})

const previous = () => {
  switch(mode.value) {
    // month
    case modes.Month: currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() - 1, 1 ); break
    // week
    case modes.Week: currentDate.value = new Date(currentDate.value.setDate(firstWeekDay.value.getDate() - 1)); break
    // day
    case modes.Day: currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(),currentDate.value.getDate() - 1); break
  }
}
const next = () => {
  switch (mode.value) {
    // month
    case modes.Month: currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() + 1, 1 ); break
    // week
    case modes.Week: currentDate.value = new Date(currentDate.value.setDate(lastWeekDay.value.getDate() + 1)); break
    // day
    case modes.Day: currentDate.value = new Date(currentDate.value.getFullYear(), currentDate.value.getMonth() ,currentDate.value.getDate() + 1); break
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
  <div class="size-full flex flex-col">
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
      'grid-cols-7': mode === modes.Month || mode === modes.Week,
      'grid-cols-1': mode === modes.Day || mode === modes.List
    }">
      <div v-for="(day, index) in daysTitle" :key="index" class="text-center p-2">
        {{ day }}
      </div>
    </div>
    <div class="flex-1 grid size-full overflow-y-auto" :class="{
      'grid-cols-7': mode === modes.Month,
      'grid-cols-1': mode === modes.Week || mode === modes.Day || mode === modes.List
    }">
<!--      month structure  -->
      <template v-if="mode === modes.Month">
        <div v-for="day in weekDayOfFirstDayOfMonth" :key="day" class="day day--empty"/>

        <div v-for="day in monthDays" :key="day.id" class="day">
          <div class="header" :class="{'current-day': isCurrentDay(day.id)}" >{{day.id}}</div>
          <div class="content">
            <slot/>
          </div>
        </div>
      </template>

      <template v-if="mode === modes.Week">
        <div class="grid grid-cols-8">
          <div class="col-start-1 col-end-2 border-r border-b"/>
          <div class="p-2 border-r border-b w-full text-center" v-for="day in weekDays" :key="day.id">{{ day.name }}</div>
          <div class="h-12 col-start-1 col-end-9 w-full grid grid-cols-8 border-b">
            <div class="col-start-1 col-end-2 border-r p-2 text-center">All day</div>
            <div v-for="day in weekDays" :key="day.id" class="p-2 border-r ">

            </div>
          </div>
          <div class="h-36 col-start-1 col-end-9 w-full grid grid-cols-8 border-b" v-for="(time, index) in hours24" :key="index">
            <div class="col-start-1 col-end-2 border-r p-2 text-center ">{{ time }}</div>
            <div v-for="day in weekDays" :key="day.id" class="p-2 border-r">

            </div>
          </div>
        </div>
      </template>

<!--      day structure -->
      <template v-if="mode === modes.Day">
        <div class="flex size-full">
          <div class="w-full">
            <div class="w-full h-36 border justify-stretch flex items-start">
              <div class="border-r h-full p-2 w-24 text-center">All day</div>
              <div class="w-full  flex-1 basis-full px-2"></div>
            </div>
            <div class="border  h-36 flex items-start" v-for="(time, index) in hours24" :key="index">
              <div class="border-r h-full p-2 w-24 text-center">{{ time }}</div>
              <div class="w-full flex-1 basis-full flex px-2"></div>
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
  @apply text-center p-2 text-sm
}

.current-day {
  @apply font-bold
}
</style>
