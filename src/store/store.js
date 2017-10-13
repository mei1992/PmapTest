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
  },

// getters
  getters: {
    cur_solution: state => state.cur_solution,
  },

// actions
  actions: {
    updateCurSolution ({commit, state}, mode) {
      commit(globals.UPDATE_CUR_SOLUTION, {mode})
    },

  },

// mutations
  mutations: {
    [globals.UPDATE_CUR_SOLUTION] (state, {mode}) {
      state.cur_solution = mode
    },

  }
})

