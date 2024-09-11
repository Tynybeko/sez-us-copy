export default {
  addUser({ commit }, isAuth) {
    commit("setUserData", isAuth);
  },
  setAuth({ commit }, { isAuth }) {
    commit("setAuth", { isAuth });
  },
  addSearchState({ commit }, { searchStatus, searchValue }) {
    commit("setSearchState", { searchStatus, searchValue });
  },
};
