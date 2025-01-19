<script setup>
import {computed} from "vue";

const props = defineProps({
  hours: { type: Array, required: true },
  days: { type: Array, required: true },
  events: { type: Array, required: true },

  today: { type: Date, required: true },
  currentDate: {type: Date, required: true},
  firstWeekDay: {type: Date, required: true},
  lastWeekDay: {type: Date, required: true},
})

const isCurrentDay = (day) => {
  const todayDate = props.today.getDate()
  const todayMonth = props.today.getMonth()
  const currentMonth = day.date.getMonth()

  return todayDate === day.id && currentMonth === todayMonth
}

const getDayEventsByHour = (time, events) => {
  return events.filter((event) =>  !event.allDay && event.date.getHours() === Number.parseInt(time))
}

const getAllDayEvents = (events) => {
  return events.filter((event) => event.allDay)
}


const weekDays = computed(() => {
  // if (props.mode.value !== modes.Week) return

  let result = []

  const firstDate = new Date(props.firstWeekDay)

  while (firstDate <= props.lastWeekDay) {
    const date = new Date(firstDate)

    const dayOfWeek = props.days.find((day) => firstDate.getDay() === day.id)
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
</script>

<template>
  <div class="week-container">
    <div class="week__days__titles">
      <div class="week__days--empty" />
      <div
          class="week__day__title"
          :class="{ 'current-day': isCurrentDay(day) }"
          v-for="day in weekDays"
          :key="day.id"
      >
        {{ day.name }}
      </div>
    </div>

    <div class="week__events__container">
      <div class="day__events">
        <div class="week__day__time">All day</div>
        <div v-for="day in weekDays" :key="day.id" class="week__day">
          <slot :event="event" v-for="event in getAllDayEvents(day.events)" :key="event.id" />
        </div>
      </div>
      <div class="day__events" v-for="(time, index) in hours" :key="index">
        <div class="week__day__time">
          {{ time }}
        </div>
        <div v-for="day in weekDays" :key="day.id" class="week__day">
          <slot
              :event="event"
              v-for="event in getDayEventsByHour(time, day.events)"
              :key="event.id"
          />
        </div>
      </div>
    </div>
  </div>

</template>

<style scoped>

.week-container {
  position: relative;
  height: 100%;
  width: 100%;
  overflow: auto;
  scrollbar-gutter: stable both-edges;
}

.week__days__titles {
  position: sticky;
  top: 0;
  background: white;

  display: grid;
  grid-template-columns: 96px  repeat(7, minmax(0, 1fr));
}
.week__days--empty {
  border: 1px solid #e5e7ebff;
}

.week__day__title {
  width: 100%;

  border-style: solid;
  border-color: #e5e7ebff;

  border-top-width: 1px;
  border-right-width: 1px;
  border-bottom-width: 1px;


  padding: 8px;

  text-align: center;
}

.week__events__container {
  height: 100%;
  width: 100%;

  display: grid;
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-rows: minmax(80px, 1fr);
}

.day__events {
  flex: 1 1 0;

  width: 100%;
  display: grid;
  grid-template-columns: 96px repeat(7, minmax(0, 1fr));
  grid-template-rows: 100%;
  
  border-style: solid;
  border-color: #e5e7ebff;
  border-bottom-width: 1px;
}

.week__day__time {
  grid-column-start: 1;
  grid-column-end: 2;


  border-style: solid;
  border-color: #e5e7ebff;

  border-right-width: 1px;

  text-align: center;

  padding: 8px;
}

.week__day {
  display: flex;
  flex-direction: column;
  row-gap: 4px;

  padding: 8px;

  border-style: solid;
  border-color: #e5e7ebff;

  border-right-width: 1px;

  overflow-y: auto;
}

.current-day {
  font-weight: 600;
}

</style>
