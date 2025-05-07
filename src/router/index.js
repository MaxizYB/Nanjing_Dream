import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MapView from '../components/MapView.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/map', name: 'Map', component: MapView }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 