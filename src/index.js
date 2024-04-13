import calendar from "./components/calendarComponent.vue";

export default {
    install(app) {
        app.component('EventsCalendar', calendar)
    }
}
