import calendar from "./components/calendarComponent.vue";

export default {
    install(app, options) {
        app.component('vue-events-calendar', calendar)
    }
}
