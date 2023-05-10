import { createRouter, createWebHistory } from 'vue-router'
import HomeMain from '../pages/Home/HomeMain.vue'
import AboutMain from '../pages/About/AboutMain.vue'

const routes = [
  { path: '/', component: HomeMain },
  { path: '/about', component: AboutMain }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
