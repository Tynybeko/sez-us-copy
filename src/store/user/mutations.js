export default {
  setUserData(state, isAuth) {
    state.user.isAuth = isAuth;
  },
  setAuth(state, { isAuth }) {
    state.user.isAuth = isAuth;
  },
  setSearchState(state, { searchStatus, searchValue }) {
    state.search.searchStatus = searchStatus;
    state.search.searchValue = searchValue;
  },
};
