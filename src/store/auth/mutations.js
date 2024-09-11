export default {
  setUserData(state, payload) {
    state.user = payload;
  },
  setUserDataError(state, payload) {
    state.error = payload;
  },
  setShowSmsCodeInput(state, value) {
    state.showSmsCodeInput = value;
  },
  saveUserData(state, userData) {
    state.userPhone = userData.userPhone;
    state.firstName = userData.firstName;
    state.lastName = userData.lastName;
    state.birthDate = userData.birthDate;
  }
};
