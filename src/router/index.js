import Vue from 'vue'
import Router from 'vue-router'
import PMIndexView from '@/PMIndexView'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'PMIndexView',
      component: PMIndexView
    }
  ]
})
