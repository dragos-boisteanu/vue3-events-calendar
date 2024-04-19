<script setup>
import {computed} from "vue";

const props = defineProps({
  date: { type: Date, required: true },
  hours: { type: Array, required: true },
  events: { type: Array, required: false, default: () => [] },
  days: {type: Array, required: true}
})

const getCurrentDayEventsByHour = (time) => {
  return props.events.filter((event) => !event.allDay && event.date.getHours() === Number.parseInt(time))
}

const getAllDayEvents = () => {
  return props.events.filter((event) => event.allDay)
}

const dayTitle = computed(() => props.days.find(day => day.id === props.date.getDay()).name)
</script>

<template>
    <div class="day">
      <div class="day_title__container">
        <div  class="day__title">
          {{ dayTitle }}
        </div>
      </div>
      <div class="day__events">
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
.day {
  width: 100%;
  height: 100%;
}

.day_title__container {
  text-align: center;
  width: 100%
}

.day__title {
  padding: 8px;
  text-align: center;

  border: 1px solid #e5e7ebff;

  font-weight: bold;
}

.day__events {
  height: 100%;
  overflow-y: auto;
}

.day__time {
  display: flex;
  align-items: flex-start;

  min-height: 47px;

  border: 1px solid #e5e7ebff;
  border-top: none
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
