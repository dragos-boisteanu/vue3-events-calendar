<script setup>
import { computed, ref } from 'vue'
import DayComponent from '@/components/dayComponent.vue'
import WeekComponent from '@/components/weekComponent.vue'
import MonthComponent from '@/components/monthComponent.vue'
import {last} from "eslint-plugin-vue/lib/utils/indent-utils.js";

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
}

const props = defineProps({
  events: { type: Array, required: true, default: () => [] }
})
const emits = defineEmits(['monthChanged'])


const today = new Date()

const mode = ref(modes.Month)
const currentDate = ref(new Date())

const year = computed(() => currentDate.value.getFullYear())
const month = computed(() => currentDate.value.getMonth())


const firstWeekDay = computed(() => {
  const day =
      currentDate.value.getDate() -
      currentDate.value.getDay() +
      (currentDate.value.getDay() === 0 ? -6 : 1)
  return new Date(currentDate.value.getFullYear(), currentDate.value.getMonth(), day)
})
const lastWeekDay = computed(() => {
  const date = new Date(currentDate.value)
  return new Date(new Date(date.setDate(date.getDate() - date.getDay() + (currentDate.value.getDay() === 0 ? 0 : 7))))
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
/*const daysTitle = computed(() => {
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
})*/
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
      emits('monthChanged', currentDate.value)
      break
    case modes.Week:
      {
        const previousWeek = new Date(
            firstWeekDay.value.getFullYear(),
            firstWeekDay.value.getMonth(),
            firstWeekDay.value.getDate() - 7)

        if(currentDate.value.getMonth() !== previousWeek.getMonth()) {
          emits('monthChanged', previousWeek.value)
        }

        currentDate.value = previousWeek
      }
      break
    case modes.Day: {
      const previousDay = new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth(),
          currentDate.value.getDate() - 1
      )

      if(currentDate.value.getMonth() !== previousDay.getMonth()) {
        emits('monthChanged', previousDay.value)
      }

      currentDate.value = previousDay

      break
      }
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
      emits('monthChanged', currentDate.value)
      break
    // week
    case modes.Week: {
      const nextWeek = new Date(
          lastWeekDay.value.getFullYear(),
          lastWeekDay.value.getMonth(),
          lastWeekDay.value.getDate() + 1
      )

      if (currentDate.value.getMonth() !== nextWeek.getMonth()) {
        emits('monthChanged', nextWeek)
      }

      currentDate.value = nextWeek
      break
    }
    // day
    case modes.Day: {
      const nextDay = new Date(
          currentDate.value.getFullYear(),
          currentDate.value.getMonth(),
          currentDate.value.getDate() + 1
      )

      if (currentDate.value.getMonth() !== nextDay.getMonth()) {
        emits('monthChanged', nextDay)
      }

      currentDate.value = nextDay

      break
    }
  }
}

const setToday = () => {
  currentDate.value = new Date(today)
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
        class="calendar__content"
    >
      <!--      month structure  -->
      <month-component
        v-if="mode === modes.Month"
        v-slot="{ event }"
        :today="today"
        :year="year"
        :month="month"
        :days="days"
        :events="events"
      >
        <slot :event="event" />
      </month-component>

      <!--      week structure-->
      <week-component
        v-if="mode === modes.Week"
        :today="today"
        :hours="hours24"
        :current-date="currentDate"
        :last-week-day="lastWeekDay"
        :first-week-day="firstWeekDay"
        :events="events"
        v-slot="{ event }"
       :days="days">
        <slot :event="event" />
      </week-component>

      <!--      day structure -->
      <day-component
        v-if="mode === modes.Day"
        :hours="hours24"
        :days="days"
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
@import "../assets/main.css";

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

.calendar__content {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  height: 100%
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

.days__container {
  display: grid;
  width: 100%;
  height: 100%;
  flex: 1 1 0;
}
</style>
