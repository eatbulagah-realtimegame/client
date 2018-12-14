import Vue from 'vue'
import Vuex from 'vuex'
import database from '@/assets/config'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    roomList2: [],
    room2: ''
  },
  mutations: {
    changeRoomList(state, rooms) {
      state.roomList2 = rooms
    },
    changeCurrentRoom(state, room) {
      state.room2 = room
    }
  },
  actions: {
    getAllRoom({commit}) {
        database.ref('room/').on('value', function(snapshot) {
            let result = snapshot.val()
            result = Object.keys(result)
            commit('changeRoomList', result)
        })
    },
    chooseRoom({commit}, room) {
      commit('changeCurrentRoom', room)
    }
  }
})
