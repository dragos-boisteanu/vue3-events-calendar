<script setup>
import Calendar from '@/components/calendarComponent.vue'
import { ref } from 'vue'

const events = ref([
  {
    id: 1,
    date: new Date(),
    title: 'Today event'
  },
  {
    id: 2,
    date: new Date(),
    title: '2nd today event'
  },
  {
    id: 3,
    date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    title: 'Tomorrow event'
  },
  {
    id: 4,
    date: new Date(new Date().getTime() + 24 * 60 * 60 * 1000),
    title: 'Tomorrow all day event',
    allDay: true
  }
])

const handleEventClick = (event) => {
  console.log('event', event)
}

const handleMothChanged = (month) => {
  console.log('monthChanged', month)
}


const draggedEvent = ref(null)
const handleDragStart = (payload) => {
  draggedEvent.value = payload
}

const handleDropEvent = (payload) => {
  // console.log('handleDropEvent', payload)
  const eventIndex = events.value.findIndex((e) => e.id === draggedEvent.value.id)

  let newDate

  switch (payload.type) {
    case 'month':
      newDate = new Date(payload.date.getFullYear(), payload.date.getMonth(),
        payload.date.getDate(), events.value[eventIndex].date.getHours(),
        events.value[eventIndex].date.getMinutes())
      break
    case 'week' : {
      if (payload.time === 'all') {
        events.value[eventIndex].allDay = true
        newDate = new Date(payload.date.getFullYear(), payload.date.getMonth(),
          payload.date.getDate(), events.value[eventIndex].date.getHours(),
          events.value[eventIndex].date.getMinutes())
      } else {
        events.value[eventIndex].allDay = false
        newDate = new Date(payload.date.getFullYear(), payload.date.getMonth(),
          payload.date.getDate(), Number.parseInt(payload.time),
          events.value[eventIndex].date.getMinutes())
      }
      break
    }
  }

  console.log('newDate', newDate)
  events.value[eventIndex].date = newDate

  draggedEvent.value = null
}
</script>

<template>
  <div>
    <calendar :events="events" :enabler-drag-drop="true" v-slot="{ event }" @month-changed="handleMothChanged"
              @eventDropped="handleDropEvent">
      <div
        @dragstart="handleDragStart(event)"
        draggable="true"
        class="event"
        :class="{'event--all-day': event.allDay}"
        @click="handleEventClick(event)"
      >
        <div>{{ event.id }}.</div>
        <div>{{ event.title }}</div>
      </div>
    </calendar>
  </div>
</template>

<style>
.event {
  display: flex;
  vertical-align: center;
  padding: 4px;
  color: white;
  background-color: #2075cf;
  font-size: 12px;
  font-family: Roboto;
  border-radius: 4px;
  cursor: pointer;
}

.event--all-day {
  flex: 1;
}

.event:hover {
  box-shadow: 2px 2px 13px -5px rgba(0, 0, 0, 0.54);
}
</style>

