import Vue from 'vue'
import Router from 'vue-router'
import Game from '@/components/Game'
import Hello from '@/components/Hello'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Game',
      component: Game
    },
    {
      path: '/hello',
      name: 'Hello',
      component: Hello
    }
  ]
})
