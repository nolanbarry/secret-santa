import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import '@/assets/scss/main.scss';
import AuthService from '@/services/AuthService';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      // route level code-splitting
      // this generates a separate chunk (Login.[hash].js) for this route
      // which is lazy-loaded when the route is visited.
      component: () => import('../views/LoginView.vue')
    },
    {
      path: '/otp',
      name: 'otp',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/OTPView.vue')
    },
    {
      path: '/joinExchange',
      name: 'joinExchange',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/JoinExchangeView.vue')
    },
    {
      path: '/createExchange',
      name: 'createExchange',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/CreateExchangeView.vue')
    },
    {
      path: '/chooseExchange',
      name: 'chooseExchange',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/ChooseExchangeView.vue')
    },
    {
      path: '/userView',
      name: 'userView',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/UserView.vue')
    }
  ]
})

router.beforeEach((to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!AuthService.getAuth()) {
      sessionStorage.setItem('redirectPath', to.path);
      next({ name: 'login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

export default router
