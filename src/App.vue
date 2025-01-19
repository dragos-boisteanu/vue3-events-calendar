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
  console.log("monthChanged", month)
}


const draggedEvent = ref(null)
const handleDragStart = (payload) => {
  draggedEvent.value = payload
}

const handleDropEvent = (payload) => {
  const eventIndex = events.value.findIndex((e) => e.id === draggedEvent.value.id)
  events.value[eventIndex].date = new Date(events.value[eventIndex].date.getFullYear(), events.value[eventIndex].date.getMonth(), payload)
  draggedEvent.value = null
}
</script>

<template>
  <div>
    <calendar :events="events" :enabler-drag-drop="true" v-slot="{ event }" @month-changed="handleMothChanged" @eventDropped="handleDropEvent">
      <div
        @dragstart="handleDragStart(event)"
        draggable="true"
        class="flex w-full cursor-pointer items-center gap-x-2 bg-sky-500 p-0.5 text-sm text-white hover:shadow"
        @click="handleEventClick(event)"
      >
        <div>{{ event.id }}.</div>
        <div>{{ event.title }}</div>
      </div>
    </calendar>
  </div>
</template>
