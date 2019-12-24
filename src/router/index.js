import Vue from 'vue'
import Router from 'vue-router'
import Pos from '@/components/pos'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Pos',
      component:Pos
    }
  ]
})
