<script setup>
import { computed, ref } from 'vue'
import DayComponent from '@/components/dayComponent.vue'
import WeekComponent from '@/components/weekComponent.vue'
import MonthComponent from '@/components/monthComponent.vue'

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

  while (firstDay <= lastDay) {
    const events = props.events.filter(
      (event) => new Date(event.date).setHours(0, 0, 0, 0) === firstDay.getTime()
    )
    const day = {
      id: firstDay.getDate(),
      date: firstDay,
      events
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
      const events = props.events.filter(
        (event) => new Date(event.date).setHours(0, 0, 0, 0) === firstDay.getTime()
      )
      const day = {
        id: firstDay.getDate(),
        date: firstDay,
        events
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
    const events = props.events.filter(
      (event) => new Date(event.date).setHours(0, 0, 0, 0) === firstMonthDate.getTime()
    )
    days.push({
      id: firstMonthDate.getDate(),
      date: firstMonthDate,
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
      {
        currentDate.value = new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth(),
          currentDate.value.getDate() + 1
        )
      }

      break
  }
}

const currentDateEvents = computed(() => {
  if (mode.value === modes.Day) {
    return getCurrentDayEvents(currentDate.value)
  }

  return []
})
const getCurrentDayEvents = (currentDateValue) => {
  return props.events.filter(
    (event) =>
      new Date(event.date).setHours(0, 0, 0, 0) === new Date(currentDateValue).setHours(0, 0, 0, 0)
  )
}
const setToday = () => (currentDate.value = new Date(today))

const setMode = (m) => {
  mode.value = m
}
</script>

<template>
  <div class="calendar">
    <div class="calendar__header">
      <div class="calendar__navigation">
        <button @click="previous">Prev</button>
        <button @click="next">Next</button>
        <button @click="setToday">Today</button>
      </div>
      <div class="calendar__title">
        {{ title }}
      </div>
      <div class="calendar__modes">
        <button
          v-for="(mode, index) in modes"
          :key="index"
          @click="setMode(mode)"
          class="calendar__mode"
        >
          {{ mode }}
        </button>
      </div>
    </div>
    <div
      class="day-title__container"
      :class="{
        'days__title__container--seven-cols': mode === modes.Month || mode === modes.Week,
        'days__title__container--one-col': mode === modes.Day || mode === modes.List
      }"
    >
      <div v-for="(day, index) in daysTitle" :key="index" class="day__title">
        {{ day }}
      </div>
    </div>
    <div
      class="days__container"
      :class="{
        'days__container--seven-cols': mode === modes.Month,
        'days__container--one-col': mode === modes.Week || mode === modes.Day || mode === modes.List
      }"
    >
      <!--      month structure  -->
      <month-component
        v-if="mode === modes.Month"
        v-slot="{ event }"
        :today="today"
        :month-days="monthDays"
        :prev-month-days="daysOfPreviousMonth"
        :next-month-days="daysOfNextMonth"
      >
        <slot :event="event" />
      </month-component>

      <!--      week structure-->
      <week-component
        v-if="mode === modes.Week"
        :today="today"
        :hours="hours24"
        :week-days="weekDays"
        v-slot="{ event }"
      >
        <slot :event="event" />
      </week-component>

      <!--      day structure -->
      <day-component
        v-if="mode === modes.Day"
        :hours="hours24"
        :date="currentDate"
        :events="currentDateEvents"
        v-slot="{ event }"
      >
        <slot :event="event" />
      </day-component>
    </div>
  </div>
</template>

<style scoped>
.calendar {
  display: flex;
  flex-direction: column;

  width: 100%;
  height: 100%;
}

.calendar__header {
  display: flex;
  align-items: center;
  justify-content: space-between;

  padding: 16px;
}

.calendar__navigation {
  display: flex;
  align-items: center;
  column-gap: 16px;
}

.calendar__modes {
  display: flex;
  align-items: center;
  column-gap: 16px;
}

.calendar__mode {
  text-transform: capitalize;
}

.day-title__container {
  display: grid;
}

.days__title__container--seven-cols,
.days__container--seven-cols {
  grid-template-columns: repeat(7, minmax(0, 1fr));
}

.days__title__container--one-col,
.days__container--one-col {
  grid-template-columns: repeat(1, minmax(0, 1fr));
}

.day__title {
  padding: 8px;
  text-align: center;
  border-collapse: collapse;

  border: 1px solid #e5e7ebff;
}

.days__container {
  display: grid;
  width: 100%;
  height: 100%;
  flex: 1 1 0;

  overflow-y: auto;
}
</style>