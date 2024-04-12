<script setup>
const props = defineProps({
  date: { type: Date, required: true },
  hours: { type: Array, required: true },
  events: { type: Array, required: false, default: () => [] }
})

const getCurrentDayEventsByHour = (time) => {
  return props.events.filter((event) => event.date.getHours() === Number.parseInt(time))
}

const getAllDayEvents = () => {
  return props.events.filter((event) => event.allDay)
}
</script>

<template>
  <div class="day__container">
    <div class="day">
      <div class="day__time">
        <div class="day__time__title">All day</div>
        <div class="day__content">
          <slot :event="event" v-for="event in getAllDayEvents()" :key="event.id" />
        </div>
      </div>
      <div class="day__time" v-for="(time, index) in props.hours" :key="index">
        <div class="day__time__title">{{ time }}</div>
        <div class="day__content">
          <slot :event="event" v-for="event in getCurrentDayEventsByHour(time)" :key="event.id" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.day__container {
  display: flex;

  width: 100%;
  height: 100%;
}

.day {
  width: 100%;
}

.day__all-day {
  display: flex;
  align-items: start;
  justify-content: stretch;

  border: 1px solid #e5e7ebff;
}

.day__time {
  display: flex;
  align-items: flex-start;

  height: 144px;

  border: 1px solid #e5e7ebff;
}

.day__time__title {
  height: 100%;
  width: 94px;

  border-style: solid;
  border-color: #e5e7ebff;

  border-right-width: 1px;

  padding: 8px;

  text-align: center;
}

.day__content {
  display: flex;
  flex: 1 1 100%;

  flex-direction: column;
  row-gap: 2px;

  padding: 8px;
}
</style>
