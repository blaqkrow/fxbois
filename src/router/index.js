import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Borrow from '../views/Borrow.vue'
import Lend from '../views/Lend.vue'
import BorrowHistory from '../views/BorrowHistory.vue'
import LendPortfolio from '../views/LendPortfolio.vue'
import SignIn from '../views/SignIn.vue'
import RegisterMambu from '../views/RegisterMambu.vue'
import SignUp from '../views/SignUp.vue'
import {auth} from '@/firebase/init'

Vue.use(VueRouter)

  const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/borrow',
    name: 'Borrow',
    component: Borrow,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/borrowhistory',
    name: 'BorrowHistory',
    component: BorrowHistory,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/lend',
    name: 'Lend',
    component: Lend,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/lendportfolio',
    name: 'LendPortfolio',
    component: LendPortfolio,
    meta: {
      requiresAuth: true
    },
  },
  {
    path: '/registerMambu',
    name: 'registerMambu',
    component: RegisterMambu,
    meta: {
      requiresAuth: false
    },
  },
  {
    path: '/signup',
    name: 'SignUp',
    component: SignUp,
  },
  {
    path:'/signin',
    name: 'SignIn',
    component: SignIn,
    beforeEnter: (to,from,next) => {
      auth.onAuthStateChanged((user) => {
        // Await vuex store retrieval of admin...
        if(user){
          next({ name: 'Home' })
        } else {
          next()
        } 
      })
    }
  },
  {
    path: '*', //catch all other invalid URLS
    beforeEnter: (to, from, next) => {
      if(store.state.admin!= null){
        next({ name: 'Home' })
      }
    }
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

router.beforeEach((to, from, next) => {
  //check to see if route requires auth
  if(to.matched.some(rec => rec.meta.requiresAuth)){
    //check auth state
    auth.onAuthStateChanged((user) => {
      if(user) {
        //user signed in, proceed to route
          next()
      } else {
        //NO user signed in, redirect to login
        next({ name: 'SignIn' })
      }
    })
  }else {
    next()
  }
})

export default router
