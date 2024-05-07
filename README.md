# Vue3 Events calendar

Full page calendar with month, week and day modes, options to go to the previous or next month, week and day, select 
today date and the most important feature view custom events. 

I have created this package because I couldn't find anything easy to style and use as I wish. I hope it will be 
useful for your yoo.

# Instalation 

```
npm i vue3-events-calendar
```

# How to use
In main.js file add the following 

```js
import EventsCalendar from 'vue3-events-calendar';
import 'vue3-events-calendar/dist/style.css';

app.use(EventsCalendar);
```

Use the EventsCalendar in a .vue file

```js
<script setup>
    const events = ref([{
        id: 1,
        title: "New Event",
        date: new Date(),
        allDay: ""
     }])
</script>
```

```html
<tempmplate>
    <EventsCalendar
      :events="events"
      v-slot="{ event }"
    >
      <div
        class="rounded bg-orange-700 p-1 text-xs text-white hover:cursor-pointer hover:bg-orange-600 hover:shadow active:shadow-inner"
        @click="handleEventClick(event)"
      >
        {{ event.title }}
      </div>
    </EventsCalendar>
</template>
```

# Event structure 
Each event must have at least the following field. You can add others if you wish.
```js
const event = {
    id: 1,
    title: "Event title",
    date: new Date(),
    allDay: false
}
```

# Custom styles
It is up to you to style the event div as you wish. In the example TailwindCSS was used, but it is not needed.

For styling the calendar elements use :deep() selector for each class. Classes are visible using inspector from dev console. 
TailwindCSS was used for this example that styles the Prev, Next and Today buttons. You can use whatever you wish.

```css
  :deep(.calendar__navigation) > * {
    @apply rounded bg-sky-600 px-2 py-1 text-sm text-white;
  }
```

# Bugs, issues and requests
This package is not tested in production. If you use it and find any problem don't hesitate to report them using the 
issue tab from GitHub

https://github.com/dragos-boisteanu/vue3-events-calendar/issues


# Screenshots
<img src="https://github.com/dragos-boisteanu/vue3-events-calendar/assets/38045539/81df4367-0fc4-4cd1-8e76-cc187a72a934" width="768" height="432">
<img src="https://github.com/dragos-boisteanu/vue3-events-calendar/assets/38045539/d472f1c6-fb52-41da-80e8-34ba84615db4" width="768" height="432">
<img src="https://github.com/dragos-boisteanu/vue3-events-calendar/assets/38045539/45ae8a22-ef68-44fc-8dc7-adc497c6f883" width="768" height="432">
