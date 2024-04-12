<script setup>
import Calendar from '@/components/calendarComponent.vue'
const events = [
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
]

const handleEventClick = (event) => {
  console.log('event', event)
}
</script>

<template>
  <div class="size-full">
    <calendar :events="events" v-slot="{ event }">
      <div
        class="flex w-full cursor-pointer items-center gap-x-2 bg-sky-500 p-0.5 text-sm text-white hover:shadow"
        @click="handleEventClick(event)"
      >
        <div>{{ event.id }}.</div>
        <div>{{ event.title }}</div>
      </div>
    </calendar>
  </div>
</template>
