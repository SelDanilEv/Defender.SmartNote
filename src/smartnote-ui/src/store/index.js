import Vuex from "vuex";

export default new Vuex.Store({
  // State: single source of truth
  state: {
    isLoggedIn: !!localStorage.getItem("token"),
  },
  // Mutations: synchronous functions to change state
  mutations: {
    setLoginState(state, isLoggedIn) {
      state.isLoggedIn = isLoggedIn;
    },
  },
  // Actions: can contain asynchronous operations, commit mutations
  actions: {
    login({ commit }, token) {
      localStorage.setItem("token", token);
      window.location.replace("/note");
      commit("setLoginState", true);
    },
    logout({ commit }) {
      localStorage.removeItem("token");
      window.location.replace("/login");
      commit("setLoginState", false);
    },
  },
  // Getters: computed properties for the store
  getters: {
    isLoggedIn: (state) => state.isLoggedIn,
  },
});
