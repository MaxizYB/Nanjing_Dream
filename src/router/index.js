import { createRouter, createWebHistory } from 'vue-router'
import Home from '../views/Home.vue'
import MapView from '../components/MapView.vue'
import LocationDetail from '../views/LocationDetail.vue'
import AIGuide from '../views/AIGuide.vue'
import Achievements from '../views/Achievements.vue'
import Help from '../views/Help.vue'

const routes = [
    { path: '/', name: 'Home', component: Home },
    {
        path: '/map',
        name: 'Map',
        component: MapView,
        props: true
    },
    {
        path: '/location/:id/:period',
        name: 'LocationDetail',
        component: LocationDetail,
        props: true
    },
    {
        path: '/ai-guide',
        name: 'AIGuide',
        component: AIGuide
    },
    {
        path: '/story/:id',
        name: 'StoryView',
        component: () => import('../views/StoryView.vue')
    },
    {
        path: '/achievements',
        name: 'Achievements',
        component: Achievements
    },
    {
        path: '/help',
        name: 'Help',
        component: Help
    }
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router 