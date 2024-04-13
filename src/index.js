import calendar from "./components/calendarComponent.vue";

export default {
    install(Vue, options) {
        Vue.component('vue-events-calendar', calendar)
    }
}
