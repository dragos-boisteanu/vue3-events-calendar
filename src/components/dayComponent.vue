<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  date: { type: Date, required: true },
  hours: { type: Array, required: true },
  events: { type: Array, required: false, default: () => [] },
  days: { type: Array, required: true }
})

const emits = defineEmits(['drop'])

const getCurrentDayEventsByHour = (time) => {
  return props.events.filter((event) => !event.allDay && event.date.getHours() === Number.parseInt(time))
}

const getAllDayEvents = () => {
  return props.events.filter((event) => event.allDay)
}

const dayTitle = computed(() => props.days.find(day => day.id === props.date.getDay()).name)


const dragOverHour = ref("")
const handleEventDrop = (time) => {
  dragOverHour.value = ''

  emits('drop', {type: 'hour', date: props.date, time})
}

const handleDragEnter = (payload) => {
  dragOverHour.value = payload
}

const handleDragLeave = () => {
  dragOverHour.value = ''
}
</script>

<template>
  <div class="day">
    <div class="day_title__container">
      <div class="day__title">
        {{ dayTitle }}
      </div>
    </div>
    <div class="day__events">
      <div class="day__time">
        <div class="day__time__title">All day</div>
        <div class="day__content"
             :class="{'hour--drag-over': 'all' === dragOverHour}"
             @dragleave.prevent="handleDragLeave" @dragover.prevent="handleDragEnter('all')"
             @drop.prevent="handleEventDrop('all')"
        >
          <slot :event="event" v-for="event in getAllDayEvents()" :key="event.id" />
        </div>
      </div>
      <div class="day__time" v-for="(time, index) in props.hours" :key="index">
        <div class="day__time__title">{{ time }}</div>
        <div class="day__content"
             :class="{'hour--drag-over': time === dragOverHour}"
             @dragleave.prevent="handleDragLeave" @dragover.prevent="handleDragEnter( time)"
             @drop.prevent="handleEventDrop( time)"
        >
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

  position: relative;
  overflow: auto;
  scrollbar-gutter: stable both-edges;

  display: flex;
  flex-direction: column;
}

.day_title__container {
  text-align: center;
  width: 100%;
  position: sticky;
  top: 0;
  background: white;
}

.day__title {
  padding: 8px;
  text-align: center;


  border: 1px solid #e5e7ebff;

  font-weight: bold;
}

.day__events {
  height: 100%;

  border: 1px solid #e5e7ebff;
  border-top: none;

  display: flex;
  flex-direction: column;
}

.day__time {
  display: grid;
  grid-template-columns: 96px 1fr;
  grid-template-rows: max-content;


  border: 1px solid #e5e7ebff;
  border-top: none;

  flex: 1 1 auto;
}

.day__time__title {
  height: 100%;
  width: 96px;


  padding: 8px;

  text-align: center;
}

.day__content {
  height: 100%;
  min-height: 36px;

  overflow-y: auto;
  scrollbar-gutter: stable;

  flex: 1 1 100%;

  display: flex;
  flex-direction: column;

  row-gap: 4px;

  padding: 8px;

  border-style: solid;
  border-color: #e5e7ebff;

  border-left-width: 1px;
}

.hour--drag-over {
  background: #f6f6f6;
}
</style>
