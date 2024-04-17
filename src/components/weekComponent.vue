<script setup>
const props = defineProps({
  weekDays: { type: Array, required: false, default: () => [] },
  hours: { type: Array, required: true },
  today: { type: Date, required: true }
})

const isCurrentDay = (day) => {
  const todayDate = props.today.getDate()
  const todayMonth = props.today.getMonth()
  const currentMonth = day.date.getMonth()

  return todayDate === day.id && currentMonth === todayMonth
}

const getDayEventsByHour = (time, events) => {
  return events.filter((event) => event.date.getHours() === Number.parseInt(time))
}

const getAllDayEvents = (events) => {
  return events.filter((event) => event.allDay)
}
</script>

<template>
  <div class="week__days__titles">
    <div class="week__days--empty" />
    <div
      class="week__day__title"
      :class="{ 'current-day': isCurrentDay(day) }"
      v-for="day in props.weekDays"
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
</template>

<style scoped>

.week__days__titles {
  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));
}
.week__days--empty {
  grid-column-start: 1;
  grid-column-end: 2;

  border: 1px solid #e5e7ebff;
}

.week__day__title {
  width: 100%;

  border: 1px solid #e5e7ebff;

  padding: 8px;

  text-align: center;
}

.week__events__container {
  height: 100%;
  width: 100%;
  overflow-y:auto;
}

.day__events {
  width: 100%;
  min-height: 3rem;

  display: grid;
  grid-template-columns: repeat(8, minmax(0, 1fr));

  grid-column-start: 1;
  grid-column-end: 9;

  border-style: solid;
  border-color: #e5e7ebff;

  border-bottom-width: 1px;
}

.week__day__time {
  grid-column-start: 1;
  grid-column-end: 2;

  border-style: solid;
  border-color: #e5e7ebff;

  border-bottom-width: 1px;
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
}

.current-day {
  font-weight: 600;
}
</style>
