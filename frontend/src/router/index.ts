import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'

import { getAuth } from '@/services/MockNetwork';

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
      component: () => import('../views/OTPView.vue'),
      props: { default: true }
    },
    {
      path: '/join-exchange',
      name: 'joinExchange',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/JoinExchangeView.vue')
    },
    {
      path: '/create-exchange',
      name: 'createExchange',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/CreateExchangeView.vue')
    },
    {
      path: '/choose-exchange',
      name: 'chooseExchange',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/ChooseExchangeView.vue')
    },
    {
      path: '/user-view/:gameid',
      name: 'userView',
      meta: {
        requiresAuth: true
      },
      component: () => import('../views/UserView.vue'),
      props: { default: true }
    }
  ]
})

router.beforeEach(async (to, from, next) => {

  if (to.matched.some(record => record.meta.requiresAuth)) {
    // this route requires auth, check if logged in
    // if not, redirect to login page.
    if (!(await getAuth())) {
      sessionStorage.setItem('redirectName', to.name ? to.name.toString() : '/');
      next({ name: 'login' })
    } else {
      next() // go to wherever I'm going
    }
  } else {
    next() // does not require auth, make sure to always call next()!
  }
})

export default router
