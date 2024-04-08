<script setup>
import { computed, ref } from 'vue'

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
]

const days = [
  {
    id: 1,
    name: 'Monday',
    short: 'Mon',
    date: ''
  },
  {
    id: 2,
    name: 'Tuesday',
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
    date: ''
  },
  {
    id: 5,
    name: 'Friday',
    short: 'Fri',
    date: ''
  },
  {
    id: 6,
    name: 'Saturday',
    short: 'Sat',
    date: ''
  },
  {
    id: 0,
    name: 'Sunday',
    short: 'Sun',
    date: ''
  }
]

const hours24 = [
  '00',
  '01',
  '02',
  '03',
  '04',
  '05',
  '06',
  '07',
  '08',
  '09',
  '10',
  '11',
  '12',
  '13',
  '14',
  '15',
  '16',
  '17',
  '18',
  '19',
  '20',
  '21',
  '22',
  '23'
]
/*const hours12 = [
  '12am',
  '1am',
  '2am',
  '3am',
  '4am',
  '5am',
  '6am',
  '7am',
  '8am',
  '9am',
  '10am',
  '11am',
  '12pm',
  '1pm',
  '2pm',
  '3pm',
  '4pm',
  '5pm',
  '6pm',
  '7pm',
  '8pm',
  '9pm',
  '10pm',
  '11pm'
]*/
const modes = {
  Month: 'month',
  Week: 'week',
  Day: 'day',
  List: 'list'
}

const props = defineProps({
  events: { type: Array, required: true, default: () => [] }
})

const today = new Date()

const mode = ref(modes.Month)

const currentDate = ref(new Date())

const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())

const daysOfPreviousMonth = computed(() => {
  if (mode.value !== modes.Month) return []

  const firstDayOfMonth = new Date(year.value, month.value, 1)
  const days = []

  let firstDay

  if (firstDayOfMonth.getDay() > 0) {
    firstDay = new Date(year.value, month.value, 2 - firstDayOfMonth.getDay())
  } else {
    firstDay = new Date(year.value, month.value, -5)
  }

  const lastDay = new Date(year.value, month.value, 0)

  console.log('firstDay', firstDay)
  while (firstDay <= lastDay) {
    const day = {
      id: firstDay.getDate(),
      date: firstDay,
      events: []
    }
    days.push(day)

    firstDay.setDate(firstDay.getDate() + 1)
  }
  // }

  return days
})

const daysOfNextMonth = computed(() => {
  if (mode.value !== modes.Month) return []

  const lastDayOfMonth = new Date(year.value, month.value + 1, 0)
  const days = []

  if (lastDayOfMonth.getDay() > 0) {
    const firstDay = new Date(year.value, month.value + 1, 1)
    const lastDay = new Date(year.value, month.value + 1, 7 - lastDayOfMonth.getDay())

    while (firstDay <= lastDay) {
      const day = {
        id: firstDay.getDate(),
        date: firstDay,
        events: []
      }
      days.push(day)

      firstDay.setDate(firstDay.getDate() + 1)
    }
  }

  return days
})

const monthDays = computed(() => {
  if (mode.value !== modes.Month) return

  const firstMonthDate = new Date(year.value, month.value, 1)
  const lastMonthDate = new Date(year.value, month.value + 1, 0)
  const days = []

  while (firstMonthDate <= lastMonthDate) {
    const date = new Date(firstMonthDate)
    const events = props.events.filter(
      (event) => new Date(event.date).setHours(0, 0, 0, 0) === date.getTime()
    )
    days.push({
      id: date.getDate(),
      date,
      events
    })

    firstMonthDate.setDate(firstMonthDate.getDate() + 1)
  }

  return days
})

const firstWeekDay = computed(() => {
  const day =
    currentDate.value.getDate() -
    currentDate.value.getDay() +
    (currentDate.value.getDay() === 0 ? -6 : 1)
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day)
})
const lastWeekDay = computed(() => {
  const date = new Date(currentDate.value)
  return new Date(new Date(date.setDate(date.getDate() - date.getDay() + 7)))
})

const weekDays = computed(() => {
  if (mode.value !== modes.Week) return

  let result = []

  const firstDate = new Date(firstWeekDay.value)

  while (firstDate <= lastWeekDay.value) {
    const date = new Date(firstDate)

    const dayOfWeek = days.find((day) => firstDate.getDay() === day.id)
    const name = `${dayOfWeek.short} ${firstDate.getDate()}/${firstDate.getMonth() + 1}`

    const events = props.events.filter(
      (event) => new Date(event.date).setHours(0, 0, 0, 0) === date.getTime()
    )

    result.push({
      id: firstDate.getDate(),
      name,
      date,
      events
    })
    firstDate.setDate(firstDate.getDate() + 1)
  }

  return result
})

const getCurrentDayEventsByHour = (time) => {
  const currentDayEvents = props.events.filter(
    (event) =>
      new Date(event.date).setHours(0, 0, 0, 0) === new Date(currentDate.value).setHours(0, 0, 0, 0)
  )

  return currentDayEvents.filter((event) => event.date.getHours() === Number.parseInt(time))
}
const getDayEventsByHour = (time, events) => {
  return events.filter((event) => event.date.getHours() === Number.parseInt(time))
}

const getTitleForDay = (includeMonthName) => {
  let day = ''

  if (mode.value === modes.Day) {
    const dayOfTheWeek = currentDate.value.getDay()
    const dayOfWeek = days.find((day) => day.id === dayOfTheWeek)

    if (includeMonthName) {
      const foundMonth = months.find((m) => m.id === month.value)
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
  switch (mode.value) {
    case modes.Month:
      titles = days.map((day) => day.short)
      break
    case modes.Day:
      titles.push(getTitleForDay())
      break
  }

  return titles
})
const title = computed(() => {
  let title = ''

  switch (mode.value) {
    case modes.Month: {
      const foundMonth = months.find((m) => m.id === month.value)
      const monthName = foundMonth.name
      title = `${monthName}, ${year.value}`
      break
    }
    case modes.Week: {
      const startMonthName = months.find((month) => month.id === firstWeekDay.value.getMonth()).name
      const endMonthName = months.find((month) => month.id === lastWeekDay.value.getMonth()).name
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
  switch (mode.value) {
    case modes.Month:
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() - 1,
        1
      )
      break
    case modes.Week:
      {
        currentDate.value = new Date(
          firstWeekDay.value.getFullYear(),
          firstWeekDay.value.getMonth(),
          firstWeekDay.value.getDate() - 7
        )
      }
      break
    case modes.Day:
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth(),
        currentDate.value.getDate() - 1
      )
      break
  }
}
const next = () => {
  switch (mode.value) {
    // month
    case modes.Month:
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth() + 1,
        1
      )
      break
    // week
    case modes.Week:
      currentDate.value = new Date(
        lastWeekDay.value.getFullYear(),
        lastWeekDay.value.getMonth(),
        lastWeekDay.value.getDate() + 1
      )
      break
    // day
    case modes.Day:
      currentDate.value = new Date(
        currentDate.value.getFullYear(),
        currentDate.value.getMonth(),
        currentDate.value.getDate() + 1
      )
      break
  }
}
const setToday = () => (currentDate.value = new Date(today))

const setMode = (m) => (mode.value = m)

const isCurrentDay = (day) => {
  const todayDate = today.getDate()
  const todayMonth = today.getMonth()
  const currentMonth = currentDate.value.getMonth()

  let isToday = false

  if (todayDate === day && currentMonth === todayMonth) isToday = true

  return isToday
}
</script>

<template>
  <div class="calendar flex size-full flex-col">
    <div class="calendar__header flex items-center justify-between bg-orange-500 p-4">
      <div class="flex items-center gap-x-4 bg-white">
        <div>
          <button @click="previous">Prev</button>
          <button @click="next">Next</button>
        </div>
        <button @click="setToday">Today</button>
      </div>
      <div class="calendar__title bg-white">
        {{ title }}
      </div>
      <div class="calendar__modes__container flex items-center gap-x-2 bg-white">
        <button
          v-for="(mode, index) in modes"
          :key="index"
          @click="setMode(mode)"
          class="calendar__mode capitalize"
        >
          {{ mode }}
        </button>
      </div>
    </div>
    <div
      class="day-title__container grid"
      :class="{
        'days-title__container-seven-cols grid-cols-7': mode === modes.Month || mode === modes.Week,
        'days-title__container-one-col grid-cols-1': mode === modes.Day || mode === modes.List
      }"
    >
      <div v-for="(day, index) in daysTitle" :key="index" class="day-title p-2 text-center">
        {{ day }}
      </div>
    </div>
    <div
      class="days__container grid size-full flex-1 overflow-y-auto"
      :class="{
        'days__container-seven-cols grid-cols-7': mode === modes.Month,
        'days-container-one-col grid-cols-1':
          mode === modes.Week || mode === modes.Day || mode === modes.List
      }"
    >
      <!--      month structure  -->
      <template v-if="mode === modes.Month">
        <div v-for="day in daysOfPreviousMonth" :key="day" class="day day--empty">
          <div class="day__header">{{ day.id }}</div>
          <div class="day__content">
            <slot />
          </div>
        </div>

        <div v-for="day in monthDays" :key="day.id" class="day">
          <div class="day__header" :class="{ 'current-day': isCurrentDay(day.id) }">
            {{ day.id }}
          </div>
          <div class="day__content flex flex-col gap-y-1 px-0.5">
            <div v-for="event in day.events" :key="event.id" class="day__event">
              <slot :event="event" />
            </div>
          </div>
        </div>

        <div v-for="day in daysOfNextMonth" :key="day" class="day day--empty">
          <div class="day__header">{{ day.id }}</div>
          <div class="day__content">
            <div v-for="event in day.events" :key="event.id" class="day__event">
              <slot :event="event" />
            </div>
          </div>
        </div>
      </template>

      <!--      week structure-->
      <template v-if="mode === modes.Week">
        <div class="weeks__container grid grid-cols-8">
          <div class="week__cell-empty col-start-1 col-end-2 border-b border-r" />
          <div
            class="week-day__title w-full border-b border-r p-2 text-center"
            :class="{ 'current-day': isCurrentDay(day.id) }"
            v-for="day in weekDays"
            :key="day.id"
          >
            {{ day.name }}
          </div>
          <div
            class="week-days__container col-start-1 col-end-9 grid h-12 w-full grid-cols-8 border-b"
          >
            <div class="week-day__time col-start-1 col-end-2 border-r p-2 text-center">All day</div>
            <div v-for="day in weekDays" :key="day.id" class="week-day border-r p-2">
              <!--              TODO: all day events list-->
            </div>
          </div>
          <div
            class="week-days__container col-start-1 col-end-9 grid h-36 w-full grid-cols-8 border-b"
            v-for="(time, index) in hours24"
            :key="index"
          >
            <div class="week-day__time col-start-1 col-end-2 border-r p-2 text-center">
              {{ time }}
            </div>
            <div
              v-for="day in weekDays"
              :key="day.id"
              class="week-day flex flex-col gap-y-0.5 border-r p-2"
            >
              <div
                v-for="event in getDayEventsByHour(time, day.events)"
                :key="event.id"
                class="day__event"
              >
                <slot :event="event" />
              </div>
            </div>
          </div>
        </div>
      </template>

      <!--      day structure -->
      <template v-if="mode === modes.Day">
        <div class="day__containerw flex size-full">
          <div class="w-full">
            <div class="flex h-36 w-full items-start justify-stretch border">
              <div class="h-full w-24 border-r p-2 text-center">All day</div>
              <div class="w-full flex-1 basis-full px-2">
                <!--                TODO: get all day events-->
              </div>
            </div>
            <div class="flex h-36 items-start border" v-for="(time, index) in hours24" :key="index">
              <div class="h-full w-24 border-r p-2 text-center">{{ time }}</div>

              <div class="flex w-full flex-1 basis-full flex-col gap-y-0.5 px-2">
                <div v-for="event in getCurrentDayEventsByHour(time)" :key="event.id">
                  <slot :event="event" />
                </div>
              </div>
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

.day__header {
  text-align: center;

  padding: 8px;

  font-size: 0.875rem /* 14px */;
  line-height: 1.25rem; /* 20px */
}
.day--empty {
  @apply bg-gray-50;
}
.day .header {
  @apply p-2 text-center text-sm;
}

.current-day {
  @apply font-bold;
}
</style>
