<script setup>
const props = defineProps({
  monthDays: { type: Array, required: false, default: () => [] },
  prevMonthDays: { type: Array, required: false, default: () => [] },
  nextMonthDays: { type: Array, required: false, default: () => [] },

  today: { type: Date, required: true }
})

const isCurrentDay = (day) => {
  const todayDate = props.today.getDate()
  const todayMonth = props.today.getMonth()
  const currentMonth = day.date.getMonth()

  return todayDate === day.id && currentMonth === todayMonth
}
</script>

<template>
  <div v-for="day in props.prevMonthDays" :key="day" class="day day--empty">
    <div class="day__header">{{ day.id }}</div>
    <div class="day__content">
      <slot :event="event" v-for="event in day.events" :key="event.id" />
    </div>
  </div>

  <div v-for="day in props.monthDays" :key="day.id" class="day">
    <div class="day__header" :class="{ 'current-day': isCurrentDay(day) }">
      {{ day.id }}
    </div>
    <div class="day__content">
      <slot :event="event" v-for="event in day.events" :key="event.id" />
    </div>
  </div>

  <div v-for="day in props.nextMonthDays" :key="day" class="day day--empty">
    <div class="day__header">{{ day.id }}</div>
    <div class="day__content">
      <slot :event="event" v-for="event in day.events" :key="event.id" />
    </div>
  </div>
</template>

<style scoped>
.day {
  border: 1px solid #e5e7ebff;
  border-collapse: collapse;
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

.day__content {
  display: flex;
  flex-direction: column;
  row-gap: 4px;

  padding: 4px;
}

.current-day {
  font-weight: bold;
}
</style>
