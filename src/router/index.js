import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MapView from '../components/MapView.vue'
import LocationDetail from '../views/LocationDetail.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    { path: '/map', name: 'Map', component: MapView, props: true },
    {
        path: '/location/:id',
        name: 'LocationDetail',
        component: LocationDetail,
        props: true
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 