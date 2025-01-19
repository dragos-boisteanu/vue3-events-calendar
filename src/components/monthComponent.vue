<script setup>
import { computed, ref } from 'vue'

const props = defineProps({
  year: {type: Number, required: true},
  month: {type: Number, required: true},

  today: { type: Date, required: true },

  enableDragDrop: { type: Boolean, required: false, default: false },

  days: {type: Array, required: true},
  events: {type: Array, required: false, default: () => []},

})

const emits = defineEmits(["drop"])

const isCurrentDay = (day) => {
  const todayDate = props.today.getDate()
  const todayMonth = props.today.getMonth() + 1
  const currentMonth = day.date.getMonth()


  return todayDate === day.id && currentMonth === todayMonth
}

const prevMonthDays = computed(() => {
  const firstDayOfMonth = new Date(props.year, props.month, 1)
  const days = []

  let firstDay

  if (firstDayOfMonth.getDay() > 0) {
    firstDay = new Date(props.year, props.month, 2 - firstDayOfMonth.getDay())
  } else {
    firstDay = new Date(props.year, props.month, -5)
  }

  const lastDay = new Date(props.year, props.month, 0)

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
const nextMonthDays = computed(() => {
  const lastDayOfMonth = new Date(props.year, props.month + 1, 0)
  const days = []

  if (lastDayOfMonth.getDay() > 0) {
    const firstDay = new Date(props.year, props.month + 1, 1)
    const lastDay = new Date(props.year, props.month + 1, 7 - lastDayOfMonth.getDay())

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
  const firstMonthDate = new Date(props.year, props.month, 1)
  const lastMonthDate = new Date(props.year, props.month + 1, 0)
  const days = []

  let daysCount = 1
  while (firstMonthDate <= lastMonthDate) {
    const events = props.events.filter(
        (event) => new Date(event.date).setHours(0, 0, 0, 0) === firstMonthDate.getTime()
    )
    const dayDate = new Date(firstMonthDate.getFullYear(), firstMonthDate.getMonth(), daysCount++)
    days.push({
      id: firstMonthDate.getDate(),
      date: dayDate,
      events
    })

    firstMonthDate.setDate(firstMonthDate.getDate() + 1)
  }

  return days
})



const handleDropEvent = (dayDate) => {
  dragOverDayId.value = ""
  emits('drop', dayDate.getDate())
}

const dragOverDayId = ref("")
const handleDragEnter = (dayId) => {
  dragOverDayId.value = dayId
}

const handleDragLeave = () => {
  dragOverDayId.value = ""
}
</script>

<template>
  <div class="month">
    <div class="months__days__titles">
      <div v-for="(day) in days" :key="day.id" class="month__day__title">
        {{ day.short }}
      </div>
    </div>
    <div class="month__days">
      <div v-for="day in prevMonthDays" :key="day" class="day day--empty">
        <div class="day__header">{{ day.id }}</div>
        <div class="day__content">
          <slot :event="event" v-for="event in day.events" :key="event.id" />
        </div>
      </div>

      <div v-for="day in monthDays" :key="day.id" class="day" :class="{'day--drag-over': day.id === dragOverDayId}"  @dragleave.prevent="handleDragLeave" @dragover.prevent="handleDragEnter(day.id)" @drop.prevent="handleDropEvent( day.date)">
        <div class="day__header" :class="{ 'current-day': isCurrentDay(day) }">
          {{ day.id }}
        </div>
        <div class="day__content__container">
          <div class="day__content" >
            <slot :event="event" v-for="event in day.events" :key="event.id" />
          </div>
        </div>
      </div>
      <div v-for="day in nextMonthDays" :key="day" class="day day--empty" >
        <div class="day__header">{{ day.id }}</div>
          <div class="day__content">
            <slot :event="event" v-for="event in day.events" :key="event.id" />
          </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.month {
  flex: 1 1 0;
  display: flex;
  flex-direction: column;
}
.months__days__titles {
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
}
.month__day__title {
  padding: 8px;
  text-align: center;

  border: 1px solid #e5e7ebff;
  border-bottom: none;
  border-left: none;
}
.month__days {
  flex: 1 1 0;
  display: grid;
  grid-template-columns: repeat(7, minmax(0, 1fr));
  grid-auto-columns: minmax(0, 1fr);
  grid-auto-rows: minmax(0, 1fr);
  overflow-y: auto;
}
.day {
  border: 1px solid #e5e7ebff;
  border-bottom: none;
  border-left: none;

  display: flex;
  flex-direction: column;
}
.day--drag-over {
  background: #f6f6f6;
}
.day--empty {
  background: #f9fafbff;
}
.day__header {
  text-align: center;

  padding: 4px;

  font-size: 0.875rem /* 14px */;
  line-height: 1.25rem; /* 20px */
}

.day__content__container {
  flex: 1 1 100%;

  overflow-y: auto;
  visibility: hidden;
}
.day__content__container:hover {
  visibility: visible;
}
.day__content {
  visibility: visible;
  display: flex;
  flex-direction: column;

  row-gap: 4px;

  padding: 4px;

  overflow-y: hidden;
}

.current-day {
  font-weight: bold;
}
</style>
