/**
 * Created by limei on 2017/10/9.
 */
/**
 * Created by limei on 2017/9/8.
 */
import Vue from 'vue'
import Vuex from 'vuex'
import * as globals from '../globals/index'


Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    cur_solution: globals.MAP_SOLUTION,   //当前配图的solution
    cur_city: globals.CUR_CITY_INFO,   //当前所在城市
    cur_token: globals.MAP_ACCESS_TOKEN  //当前token
  },

// getters
  getters: {
    cur_solution: state => state.cur_solution,
    cur_city: state => state.cur_city,
    cur_token: state => state.cur_token,
  },

// actions
  actions: {
    updateCurSolution ({commit, state}, mode) {
      commit(globals.UPDATE_CUR_SOLUTION, {mode})
    },
    updateCurCity({commit, state}, mode) {
      commit(globals.UPDATE_CUR_CITY, {mode})
    },
    updateCurToken({commit, state}, mode) {
      commit(globals.UPDATE_CUR_TOKEN, {mode})
    },

  },

// mutations
  mutations: {
    [globals.UPDATE_CUR_SOLUTION] (state, {mode}) {
      state.cur_solution = mode
    },
    [globals.UPDATE_CUR_CITY] (state, {mode}) {
      state.cur_city = mode
    },
    [globals.UPDATE_CUR_TOKEN] (state, {mode}) {
      state.cur_token = mode
    },

  }
})

