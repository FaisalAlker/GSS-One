import { createRouter, createWebHashHistory } from 'vue-router'
import SplashScreen from '@/views/SplashScreen.vue'
import PrepareScreen from '@/views/PrepareScreen.vue'
import BaseLayout from '@/components/layout/BaseLayout.vue'

const router = createRouter({
  history: createWebHashHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: SplashScreen },
    { path: '/prepare', component: PrepareScreen },
    {
      path: '/',
      component: BaseLayout,
      children: [
        { path: '/home', name: 'home', component: () => import('@/views/HomeView.vue') },
        { path: '/settings', name: 'settings', component: () => import('@/views/SettingView.vue') },
        // ... other pages inside layout
      ],
    },
  ],
})


export default router
