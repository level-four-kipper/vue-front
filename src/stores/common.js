import { ref, computed } from 'vue'
import { defineStore } from 'pinia' // 解构的方式引入

export const useCommonStore = defineStore('common', {
  state: () => {
    return {
      searchWord: ''
    }
  },
  getters: {},
  actions: {
    updateSearchWord(value) {
      console.log('dd');
      this.searchWord = value
    }
  }
})
