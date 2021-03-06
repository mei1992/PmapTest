// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'
import App from './App'
import Vuex from 'vuex';
import store from './store/store'
import VueResource from 'vue-resource'
import router from './router'
import EasyScroll from 'easyscroll'

Vue.config.productionTip = false;
Vue.use(Vuex);
Vue.use(VueResource);
Vue.use(EasyScroll);   //优化滚动条插件

Vue.directive('focus', {
  // 当绑定元素插入到 DOM 中。
  bind: function (el,value) {
    // 聚焦元素
    if(value){
      el.focus();
    }
  }
})

/* eslint-disable no-new */
new Vue({
  el: '#app',
  store,
  router,
  template: '<App/>',
  components: { App }
});
